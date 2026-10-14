import { NextResponse } from "next/server";
import { accountFor, stripe } from "@/lib/stripe";
import { db, serverSecret } from "@/lib/supabase";

type Body = { eventId?: string; name?: string; email?: string; contribution?: number; agreed?: boolean };

// Starts a booking: creates a customer and a SetupIntent on the host's Stripe account and records the booking.
// Nothing is charged here. The card is verified with the bank and saved for the hold the day before the dinner.
export async function POST(req: Request) {
  const s = stripe();
  if (!s) {
    return NextResponse.json({ error: "Payments aren't set up on this preview yet." }, { status: 503 });
  }
  const body = (await req.json().catch(() => ({}))) as Body;
  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim().toLowerCase();
  const contribution = Math.round(Number(body.contribution));
  if (!body.eventId || !name || !/^\S+@\S+\.\S+$/.test(email) || !Number.isFinite(contribution) || !body.agreed) {
    return NextResponse.json({ error: "Add your name, a valid email and agree to the terms." }, { status: 400 });
  }

  const client = db();
  const { data: info, error } = await client.rpc("server_event_payment_info", {
    p_secret: serverSecret(),
    p_event: body.eventId,
  });
  const ev = Array.isArray(info) ? info[0] : null;
  if (error || !ev) return NextResponse.json({ error: "We couldn't find this dinner." }, { status: 404 });
  if (!["open", "confirmed"].includes(ev.status)) {
    return NextResponse.json({ error: "This dinner isn't taking bookings." }, { status: 409 });
  }
  if (ev.seats_taken >= ev.capacity) return NextResponse.json({ error: "This dinner is full." }, { status: 409 });
  if (contribution < ev.min_contribution) {
    return NextResponse.json({ error: "Your contribution is below the minimum for this dinner." }, { status: 400 });
  }

  let account: string | undefined;
  try {
    account = accountFor(ev.stripe_account_id);
  } catch {
    return NextResponse.json({ error: "This host can't take bookings yet." }, { status: 409 });
  }
  const opts = account ? { stripeAccount: account } : undefined;

  const customer = await s.customers.create({ name, email, metadata: { event_id: ev.event_id } }, opts);
  const setup = await s.setupIntents.create(
    {
      customer: customer.id,
      usage: "off_session",
      allowed_payment_method_types: ["card"],
      payment_method_options: { card: { request_three_d_secure: "any" } },
      metadata: { event_id: ev.event_id, contribution: String(contribution), currency: ev.currency },
    },
    opts,
  );

  const { data: bookingId, error: bErr } = await client.rpc("server_create_booking", {
    p_secret: serverSecret(),
    p_event: ev.event_id,
    p_name: name,
    p_email: email,
    p_contribution: contribution,
    p_customer: customer.id,
    p_setup_intent: setup.id,
  });
  if (bErr || !bookingId) {
    await s.setupIntents.cancel(setup.id, undefined, opts).catch(() => {});
    return NextResponse.json({ error: "We couldn't save your booking. Try again." }, { status: 409 });
  }

  return NextResponse.json({ bookingId, clientSecret: setup.client_secret, stripeAccount: account ?? null });
}
