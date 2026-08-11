import { createClient } from "jsr:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const appUrl = Deno.env.get("APP_URL") || "https://fitpulse-gym-app.hcalinoiu.chatgpt.site/";
const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY") || "";
const plusPriceId = Deno.env.get("STRIPE_PLUS_PRICE_ID") || "price_1Ty7yuPIXWdDw7KS9bOaoyYE";
const proPriceId = Deno.env.get("STRIPE_PRO_PRICE_ID") || "price_1Ty7zEPIXWdDw7KSSjCmYkRi";
const trialDays = Number(Deno.env.get("STRIPE_TRIAL_DAYS") || "5");
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }
  if (!stripeSecretKey || !supabaseUrl || !supabaseAnonKey) {
    return json({ error: "Stripe checkout is not configured." }, 500);
  }

  const authHeader = req.headers.get("Authorization") || "";
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    return json({ error: "Authentication required." }, 401);
  }

  const payload = await req.json().catch(() => ({}));
  const plan = payload.plan === "pro" ? "pro" : payload.plan === "plus" ? "plus" : "";
  const priceId = plan === "pro" ? proPriceId : plan === "plus" ? plusPriceId : "";
  if (!priceId) {
    return json({ error: "Invalid plan." }, 400);
  }

  const successUrl = `${appUrl}?checkout=success&plan=${encodeURIComponent(plan)}`;
  const cancelUrl = `${appUrl}?checkout=cancelled&plan=${encodeURIComponent(plan)}`;
  const body = new URLSearchParams({
    mode: "subscription",
    success_url: successUrl,
    cancel_url: cancelUrl,
    client_reference_id: userData.user.id,
    customer_email: userData.user.email || "",
    "line_items[0][price]": priceId,
    "line_items[0][quantity]": "1",
    "metadata[user_id]": userData.user.id,
    "metadata[plan]": plan,
    "subscription_data[metadata][user_id]": userData.user.id,
    "subscription_data[metadata][plan]": plan,
    "subscription_data[trial_period_days]": String(trialDays),
  });

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${stripeSecretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });
  const data = await response.json();
  if (!response.ok) {
    return json({ error: data.error?.message || "Stripe checkout failed." }, response.status);
  }
  return json({ url: data.url });
});

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
