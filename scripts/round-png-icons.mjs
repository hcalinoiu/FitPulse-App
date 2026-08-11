import { deflateSync, inflateSync } from "node:zlib";
import { readFileSync, writeFileSync } from "node:fs";

const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

const files = process.argv.slice(2);
if (!files.length) {
  throw new Error("Usage: node scripts/round-png-icons.mjs <png>...");
}

for (const file of files) {
  const png = decodePng(readFileSync(file));
  const rounded = applyRoundedMask(png);
  writeFileSync(file, encodePng(rounded));
}

function decodePng(buffer) {
  if (!buffer.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error("Not a PNG");
  }

  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      if (bitDepth !== 8 || (colorType !== 2 && colorType !== 6)) {
        throw new Error(`Unsupported PNG format: bitDepth=${bitDepth} colorType=${colorType}`);
      }
      if (data[12] !== 0) {
        throw new Error("Interlaced PNGs are not supported");
      }
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  const channels = colorType === 6 ? 4 : 3;
  const bytesPerPixel = channels;
  const rowBytes = width * channels;
  const inflated = inflateSync(Buffer.concat(idat));
  const raw = Buffer.alloc(width * height * 4);
  const previous = Buffer.alloc(rowBytes);
  const current = Buffer.alloc(rowBytes);
  let inputOffset = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = inflated[inputOffset];
    inputOffset += 1;
    inflated.copy(current, 0, inputOffset, inputOffset + rowBytes);
    inputOffset += rowBytes;
    unfilter(current, previous, filter, bytesPerPixel);

    for (let x = 0; x < width; x += 1) {
      const source = x * channels;
      const target = (y * width + x) * 4;
      raw[target] = current[source];
      raw[target + 1] = current[source + 1];
      raw[target + 2] = current[source + 2];
      raw[target + 3] = colorType === 6 ? current[source + 3] : 255;
    }

    current.copy(previous);
  }

  return { width, height, data: raw };
}

function unfilter(row, previous, filter, bpp) {
  for (let i = 0; i < row.length; i += 1) {
    const left = i >= bpp ? row[i - bpp] : 0;
    const up = previous[i] || 0;
    const upLeft = i >= bpp ? previous[i - bpp] || 0 : 0;
    if (filter === 1) row[i] = (row[i] + left) & 255;
    else if (filter === 2) row[i] = (row[i] + up) & 255;
    else if (filter === 3) row[i] = (row[i] + Math.floor((left + up) / 2)) & 255;
    else if (filter === 4) row[i] = (row[i] + paeth(left, up, upLeft)) & 255;
    else if (filter !== 0) throw new Error(`Unsupported PNG filter: ${filter}`);
  }
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

function applyRoundedMask(png) {
  const { width, height, data } = png;
  const radius = Math.min(width, height) * 0.2237;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  const innerWidth = halfWidth - radius;
  const innerHeight = halfHeight - radius;

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const px = x + 0.5 - halfWidth;
      const py = y + 0.5 - halfHeight;
      const dx = Math.max(Math.abs(px) - innerWidth, 0);
      const dy = Math.max(Math.abs(py) - innerHeight, 0);
      const distance = Math.sqrt(dx * dx + dy * dy) - radius;
      const coverage = Math.max(0, Math.min(1, 0.5 - distance));
      const alphaIndex = (y * width + x) * 4 + 3;
      data[alphaIndex] = Math.round(data[alphaIndex] * coverage);
    }
  }

  return png;
}

function encodePng(png) {
  const { width, height, data } = png;
  const rows = Buffer.alloc((width * 4 + 1) * height);
  let offset = 0;
  for (let y = 0; y < height; y += 1) {
    rows[offset] = 0;
    offset += 1;
    data.copy(rows, offset, y * width * 4, (y + 1) * width * 4);
    offset += width * 4;
  }

  return Buffer.concat([
    PNG_SIGNATURE,
    chunk("IHDR", ihdr(width, height)),
    chunk("IDAT", deflateSync(rows)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function ihdr(width, height) {
  const data = Buffer.alloc(13);
  data.writeUInt32BE(width, 0);
  data.writeUInt32BE(height, 4);
  data[8] = 8;
  data[9] = 6;
  data[10] = 0;
  data[11] = 0;
  data[12] = 0;
  return data;
}

function chunk(type, data) {
  const name = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, crc]);
}

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}
