import { NextResponse } from "next/server";
import { isTestMode, stripe } from "@/lib/stripe";
import { serverSecret } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// Test mode only. Creates a Stripe connected account for each sample host that doesn't have one,
// using the configuration we'll use in production: full Stripe Dashboard, Stripe liable for negative
// balances, Stripe collecting its fees from the host. Returns onboarding links so the accounts can be
// completed with Stripe's test data.
// Call: POST /api/dev/test-hosts with header x-server-secret: <SERVER_DB_SECRET>
export async function POST(req: Request) {
  if (req.headers.get("x-server-secret") !== serverSecret()) {
    return NextResponse.json({ error: "not allowed" }, { status: 403 });
  }
  const s = stripe();
  if (!s || !isTestMode()) return NextResponse.json({ error: "test mode only" }, { status: 400 });

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!);
  const { data: hosts, error } = await db.from("profiles").select("handle,display_name,home_city,is_sample");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const countryOf = (city: string | null) => (city?.endsWith("UK") ? "GB" : city?.endsWith("ON") ? "CA" : "US");
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(req.url).origin;
  const out = [];
  for (const h of (hosts ?? []).filter((x) => x.is_sample)) {
    const account = await s.accounts.create({
      country: countryOf(h.home_city),
      business_type: "individual",
      controller: {
        stripe_dashboard: { type: "full" },
        fees: { payer: "account" },
        losses: { payments: "stripe" },
        requirement_collection: "stripe",
      },
      capabilities: { card_payments: { requested: true }, transfers: { requested: true } },
      metadata: { handle: h.handle, sample: "true" },
    });
    await db.rpc("server_set_stripe_account", { p_secret: serverSecret(), p_handle: h.handle, p_account: account.id });
    const link = await s.accountLinks.create({
      account: account.id,
      type: "account_onboarding",
      refresh_url: `${origin}/host`,
      return_url: `${origin}/h/${h.handle}`,
    });
    out.push({ handle: h.handle, account: account.id, onboarding: link.url });
  }
  return NextResponse.json({ created: out });
}
