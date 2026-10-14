import Link from "next/link";
import { Suspense } from "react";
import { getDinner } from "@/lib/data";
import { dinnerDate, money, shortDate } from "@/lib/format";
import { stripe } from "@/lib/stripe";
import { db, serverSecret } from "@/lib/supabase";

type Params = Promise<{ id: string }>;
type SP = Promise<{ [k: string]: string | string[] | undefined }>;

export const metadata = { title: "Your booking" };

async function Result({ params, searchParams }: { params: Params; searchParams: SP }) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const code = typeof sp.d === "string" ? sp.d : "";
  const setupIntentId = typeof sp.setup_intent === "string" ? sp.setup_intent : "";
  const client = db();
  const [{ data: rows }, dinner] = await Promise.all([
    client.rpc("server_booking_v2", { p_secret: serverSecret(), p_booking: id }),
    code ? getDinner(code) : Promise.resolve(null),
  ]);
  const booking = Array.isArray(rows) ? rows[0] : null;
  if (!booking || !dinner || booking.event_id !== dinner.id) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-16">
        <h1 className="text-3xl">We couldn&apos;t find this booking</h1>
        <p className="text-ink-2 mt-2">
          Check the link in your email, or <Link href="/contact?topic=booking" className="underline">contact us</Link>.
        </p>
      </div>
    );
  }

  let saved = booking.has_card as boolean;
  if (!saved && setupIntentId) {
    const s = stripe();
    if (s) {
      const acct: string | null = booking.stripe_account_id;
      const si = await s.setupIntents.retrieve(setupIntentId, undefined, acct ? { stripeAccount: acct } : undefined);
      if (si.status === "succeeded" && typeof si.payment_method === "string") {
        await client.rpc("server_confirm_card", {
          p_secret: serverSecret(),
          p_setup_intent: si.id,
          p_payment_method: si.payment_method,
        });
        saved = true;
      }
    }
  }

  if (!saved) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-16">
        <h1 className="text-3xl">Your card wasn&apos;t verified</h1>
        <p className="text-ink-2 mt-2">Your seat isn&apos;t booked yet. Try again with the same or another card.</p>
        <Link
          href={`/d/${dinner.short_code}/book`}
          className="mt-6 inline-block rounded-full bg-wine text-wine-ink px-6 py-3 hover:opacity-90"
        >
          Try again
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 pt-16">
      <p className="text-ok">Seat booked</p>
      <h1 className="text-4xl mt-1">You&apos;re on the list for {dinner.title}</h1>
      <p className="mt-4">
        {dinnerDate(dinner.starts_at, dinner.timezone)} in {dinner.city}. Your contribution:{" "}
        {money(booking.contribution, dinner.currency)}. Nothing has been charged.
      </p>
      <ul className="mt-6 space-y-2 text-ink-2">
        <li>Dinner updates will go to {booking.guest_email}. (Emails aren&apos;t switched on in this preview yet.)</li>
        <li>On {shortDate(dinner.go_deadline, dinner.timezone)} we&apos;ll tell you whether the dinner is going ahead.</li>
        <li>The day before, we&apos;ll place a hold and send you the exact address.</li>
      </ul>
      <Link href={`/d/${dinner.short_code}`} className="mt-8 inline-block underline underline-offset-4 hover:text-wine">
        Back to the dinner
      </Link>
    </div>
  );
}

export default function Page({ params, searchParams }: { params: Params; searchParams: SP }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-xl px-4 pt-16 text-ink-2">Checking your card…</div>}>
      <Result params={params} searchParams={searchParams} />
    </Suspense>
  );
}
