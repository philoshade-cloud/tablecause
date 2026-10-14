"use client";

import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe, type Stripe } from "@stripe/stripe-js";
import Link from "next/link";
import { useMemo, useState } from "react";

type Props = {
  eventId: string;
  code: string;
  currency: string;
  minContribution: number; // minor units
  isHome: boolean;
  goDeadlineLabel: string;
  paymentsReady: boolean;
};

const zeroDecimal = new Set(["krw", "jpy"]);
const toMinor = (v: number, cur: string) => (zeroDecimal.has(cur) ? Math.round(v) : Math.round(v * 100));
const toMajor = (v: number, cur: string) => (zeroDecimal.has(cur) ? v : v / 100);

function CardStep({ bookingId, code }: { bookingId: string; code: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!stripe || !elements) return;
    setBusy(true);
    setError(null);
    const { error } = await stripe.confirmSetup({
      elements,
      confirmParams: { return_url: `${window.location.origin}/booking/${bookingId}?d=${code}` },
    });
    // On success the browser is redirected; we only get here if something went wrong.
    setError(error?.message ?? "Your card couldn't be verified. Try another card.");
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <PaymentElement options={{ layout: "tabs" }} />
      {error && <p role="alert" className="text-sm text-wine">{error}</p>}
      <button
        disabled={!stripe || busy}
        className="w-full rounded-full bg-wine text-wine-ink py-3 hover:opacity-90 disabled:opacity-60"
      >
        {busy ? "Verifying your card…" : "Save card and book my seat"}
      </button>
      <p className="text-xs text-ink-2 text-center">Your card won&apos;t be charged now.</p>
    </form>
  );
}

export default function BookingForm(p: Props) {
  const [contribution, setContribution] = useState(toMajor(p.minContribution, p.currency));
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [homeOk, setHomeOk] = useState(!p.isHome);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [session, setSession] = useState<{ bookingId: string; clientSecret: string; stripeAccount: string | null } | null>(null);

  const stripePromise = useMemo<Promise<Stripe | null> | null>(() => {
    if (!session) return null;
    const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!;
    return loadStripe(pk, session.stripeAccount ? { stripeAccount: session.stripeAccount } : undefined);
  }, [session]);

  const minMajor = toMajor(p.minContribution, p.currency);
  const fmt = (v: number) =>
    new Intl.NumberFormat("en", { style: "currency", currency: p.currency.toUpperCase() }).format(v);

  async function start(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (contribution < minMajor) return setError(`The minimum seat for this dinner is ${fmt(minMajor)}.`);
    setBusy(true);
    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventId: p.eventId,
        name,
        email,
        contribution: toMinor(contribution, p.currency),
        agreed: agreed && homeOk,
      }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(json.error ?? "Something went wrong. Try again.");
    setSession(json);
  }

  if (session && stripePromise) {
    return (
      <div>
        <h2 className="text-2xl mb-1">Add your card</h2>
        <p className="text-ink-2 mb-6">
          Seat contribution: <span className="text-ink">{fmt(contribution)}</span>. We&apos;ll verify your card with your
          bank and save it for the dinner.
        </p>
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret: session.clientSecret,
            appearance: {
              theme: "flat",
              variables: { colorPrimary: "#7a2e46", borderRadius: "10px", fontFamily: "system-ui, sans-serif" },
            },
          }}
        >
          <CardStep bookingId={session.bookingId} code={p.code} />
        </Elements>
      </div>
    );
  }

  const field = "w-full rounded-lg border border-line bg-paper px-3 py-2";
  return (
    <form onSubmit={start} className="space-y-5">
      <label className="block">
        <span className="block text-sm text-ink-2 mb-1">Your seat contribution ({p.currency.toUpperCase()})</span>
        <input
          type="number"
          inputMode="decimal"
          min={minMajor}
          step={zeroDecimal.has(p.currency) ? 1 : 1}
          value={contribution}
          onChange={(e) => setContribution(Number(e.target.value))}
          className={field}
          required
        />
        <span className="block text-xs text-ink-2 mt-1">Minimum {fmt(minMajor)}. You can give more if you&apos;d like.</span>
      </label>
      <label className="block">
        <span className="block text-sm text-ink-2 mb-1">Your name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" className={field} />
      </label>
      <label className="block">
        <span className="block text-sm text-ink-2 mb-1">Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className={field}
        />
        <span className="block text-xs text-ink-2 mt-1">We send the address and entry details here.</span>
      </label>

      {p.isHome && (
        <label className="flex gap-3 items-start text-sm">
          <input type="checkbox" checked={homeOk} onChange={(e) => setHomeOk(e.target.checked)} className="mt-1" />
          <span>I understand this dinner is in the host&apos;s private home.</span>
        </label>
      )}
      <label className="flex gap-3 items-start text-sm">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1" />
        <span>
          I agree to the <Link href="/legal/terms" className="underline underline-offset-2" target="_blank">terms</Link> and the{" "}
          <Link href="/legal/refunds" className="underline underline-offset-2" target="_blank">payment and cancellation policy</Link>.
          I understand this is a payment to the host, not a tax-deductible donation, and that I can cancel for free
          until {p.goDeadlineLabel}.
        </span>
      </label>

      {error && <p role="alert" className="text-sm text-wine">{error}</p>}
      {!p.paymentsReady && (
        <p className="text-sm rounded-lg bg-paper-2 p-3">
          Card payments aren&apos;t connected on this preview yet, so bookings can&apos;t be completed right now.
        </p>
      )}
      <button
        disabled={busy || !agreed || !homeOk || !p.paymentsReady}
        className="w-full rounded-full bg-wine text-wine-ink py-3 hover:opacity-90 disabled:opacity-50"
      >
        {busy ? "One moment…" : "Continue to card"}
      </button>
    </form>
  );
}
