import { createClient } from "jsr:@supabase/supabase-js@2";

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET") || "";
const plusPriceId = Deno.env.get("STRIPE_PLUS_PRICE_ID") || "price_1Ty7yuPIXWdDw7KS9bOaoyYE";
const proPriceId = Deno.env.get("STRIPE_PRO_PRICE_ID") || "price_1Ty7zEPIXWdDw7KSSjCmYkRi";
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !serviceRoleKey) {
    return new Response("Webhook not configured", { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature") || "";
  const valid = await verifyStripeSignature(rawBody, signature, webhookSecret);
  if (!valid) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(rawBody);
  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const eventInserted = await insertStripeEvent(supabase, event.id, event.type);
  if (!eventInserted) {
    return new Response(JSON.stringify({ received: true, duplicate: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (event.type === "checkout.session.completed") {
    await handleCheckoutCompleted(supabase, event.data.object);
  }
  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    await handleSubscriptionChanged(supabase, event.data.object);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});

async function insertStripeEvent(supabase: ReturnType<typeof createClient>, id: string, eventType: string) {
  const { error } = await supabase.from("stripe_events").insert({ id, event_type: eventType });
  if (!error) return true;
  if (String(error.code) === "23505") return false;
  throw error;
}

async function handleCheckoutCompleted(supabase: ReturnType<typeof createClient>, session: Record<string, any>) {
  const userId = session.client_reference_id
    || session.metadata?.user_id
    || await userIdForEmail(supabase, asString(session.customer_details?.email) || asString(session.customer_email));
  const plan = normalizePlan(session.metadata?.plan) || await planFromSessionSubscription(session);
  if (!userId || !plan) return;
  await updatePlan(supabase, userId, plan, {
    stripe_customer_id: asString(session.customer),
    stripe_subscription_id: asString(session.subscription),
    stripe_subscription_status: "active",
  });
}

async function handleSubscriptionChanged(supabase: ReturnType<typeof createClient>, subscription: Record<string, any>) {
  const status = asString(subscription.status);
  const customerId = asString(subscription.customer);
  const subscriptionId = asString(subscription.id);
  const priceId = asString(subscription.items?.data?.[0]?.price?.id);
  const active = ["active", "trialing"].includes(status);
  const plan = active ? planFromPrice(priceId) || normalizePlan(subscription.metadata?.plan) : "free";
  const userId = asString(subscription.metadata?.user_id) || await userIdForCustomer(supabase, customerId);
  if (!userId || !plan) return;
  await updatePlan(supabase, userId, plan, {
    stripe_customer_id: customerId,
    stripe_subscription_id: subscriptionId,
    stripe_subscription_status: status,
    plan_current_period_end: subscription.current_period_end
      ? new Date(Number(subscription.current_period_end) * 1000).toISOString()
      : null,
  });
}

async function updatePlan(supabase: ReturnType<typeof createClient>, userId: string, plan: string, extra: Record<string, unknown>) {
  const { error } = await supabase.from("profiles").update({
    plan,
    ...extra,
    plan_updated_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq("id", userId);
  if (error) throw error;
}

async function userIdForCustomer(supabase: ReturnType<typeof createClient>, customerId: string) {
  if (!customerId) return "";
  const { data } = await supabase.from("profiles").select("id").eq("stripe_customer_id", customerId).maybeSingle();
  return data?.id || "";
}

async function userIdForEmail(supabase: ReturnType<typeof createClient>, email: string) {
  if (!email) return "";
  const { data } = await supabase.from("profiles").select("id").ilike("email", email).maybeSingle();
  return data?.id || "";
}

function planFromPrice(priceId: string) {
  if (priceId === proPriceId) return "pro";
  if (priceId === plusPriceId) return "plus";
  return "";
}

async function planFromSessionSubscription(session: Record<string, any>) {
  const subscriptionId = asString(session.subscription);
  if (!subscriptionId) return "";
  const response = await fetch(`https://api.stripe.com/v1/subscriptions/${subscriptionId}`, {
    headers: { Authorization: `Bearer ${stripeSecretKey}` },
  });
  if (!response.ok) return "";
  const subscription = await response.json();
  return planFromPrice(asString(subscription.items?.data?.[0]?.price?.id));
}

function normalizePlan(plan: unknown) {
  return plan === "pro" ? "pro" : plan === "plus" ? "plus" : "";
}

function asString(value: unknown) {
  return typeof value === "string" ? value : "";
}

async function verifyStripeSignature(payload: string, header: string, secret: string) {
  const parts = Object.fromEntries(header.split(",").map((part) => {
    const [key, value] = part.split("=");
    return [key, value];
  }));
  const timestamp = parts.t;
  const expected = parts.v1;
  if (!timestamp || !expected) return false;
  const signedPayload = `${timestamp}.${payload}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(signedPayload));
  return timingSafeEqual(hex(signature), expected);
}

function hex(buffer: ArrayBuffer) {
  return Array.from(new Uint8Array(buffer)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let index = 0; index < a.length; index += 1) {
    result |= a.charCodeAt(index) ^ b.charCodeAt(index);
  }
  return result === 0;
}
