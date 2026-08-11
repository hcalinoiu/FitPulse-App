import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, "");
const dist = join(root, "dist");

const sourceFiles = [
  ["index.html", "text/html; charset=utf-8"],
  ["styles.css", "text/css; charset=utf-8"],
  ["app.js", "application/javascript; charset=utf-8"],
  ["manifest.webmanifest", "application/manifest+json; charset=utf-8"],
  ["sw.js", "application/javascript; charset=utf-8"],
  ["assets/icon.svg", "image/svg+xml; charset=utf-8"],
  ["assets/fitpulse-logo.png", "image/png"],
  ["assets/fitpulse-logo-fp.png", "image/png"],
  ["assets/apple-touch-icon.png", "image/png"],
  ["assets/apple-touch-icon-fp.png", "image/png"],
  ["assets/favicon-fp-32.png", "image/png"],
  ["assets/icon-192.png", "image/png"],
  ["assets/icon-512.png", "image/png"],
  ["assets/icon-fp-192.png", "image/png"],
  ["assets/icon-fp-512.png", "image/png"],
];

await rm(dist, { force: true, recursive: true });
await mkdir(join(dist, "server"), { recursive: true });
await mkdir(join(dist, ".openai"), { recursive: true });

const assets = {};
for (const [relativePath, contentType] of sourceFiles) {
  const body = await readFile(join(root, relativePath));
  assets[`/${relativePath}`] = { body: body.toString("base64"), contentType };
}
assets["/"] = assets["/index.html"];

const server = `const assets = ${JSON.stringify(assets)};

const headers = {
  "Cache-Control": "public, max-age=120",
  "X-Content-Type-Options": "nosniff",
};

const decodedAssets = new Map();

function decodeAsset(pathname, asset) {
  if (decodedAssets.has(pathname)) return decodedAssets.get(pathname);
  const binary = atob(asset.body);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  decodedAssets.set(pathname, bytes);
  return bytes;
}

function responseFor(pathname) {
  const normalized = pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
  const asset = assets[normalized] || assets["/index.html"];
  return new Response(decodeAsset(normalized, asset), {
    headers: {
      ...headers,
      "Content-Type": asset.contentType,
    },
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    return responseFor(url.pathname);
  },
};
`;

await writeFile(join(dist, "server", "index.js"), server);
await writeFile(join(dist, ".openai", "hosting.json"), await readFile(join(root, ".openai", "hosting.json"), "utf8"));
