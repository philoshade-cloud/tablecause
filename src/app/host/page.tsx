import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Host a dinner" };

export default function Host() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      <h1 className="text-4xl sm:text-5xl max-w-3xl">Raise money for what you&apos;re building, one table at a time.</h1>
      <p className="text-lg text-ink-2 mt-4 max-w-2xl">
        You set the date, the seat price and what you&apos;ll do at the dinner. We verify you, give you a short link to
        share on your channels, handle payments, and confirm with guests that the dinner happened.
      </p>

      <section className="mt-12 grid gap-10 lg:grid-cols-3">
        <div>
          <h2 className="text-2xl">What you decide</h2>
          <ul className="mt-3 space-y-2 text-ink-2">
            <li>Your cause and how the money will be used</li>
            <li>The date, area and number of seats</li>
            <li>The minimum seat contribution</li>
            <li>How many guests or how much money the dinner needs to go ahead</li>
            <li>Your host fee, as a fixed amount or a percentage</li>
            <li>The promises you make to guests</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl">What you&apos;re responsible for</h2>
          <ul className="mt-3 space-y-2 text-ink-2">
            <li>Booking the venue and paying for the meal from your host fee</li>
            <li>Keeping the promises you list. Guests confirm each one, and you&apos;re paid only for what you keep</li>
            <li>Using the money as you described and posting an update within 90 days</li>
            <li>Your own taxes on what you receive</li>
          </ul>
        </div>
        <div>
          <h2 className="text-2xl">How you get paid</h2>
          <p className="mt-3 text-ink-2">
            Guest payments go to your own payout account with our payment provider once guests confirm the dinner happened. TableCause
            takes 10% and the payment provider deducts its card processing fee. You can see every payment in your account.
          </p>
        </div>
      </section>

      <section className="mt-16 rounded-2xl bg-paper-2 p-8 max-w-3xl">
        <h2 className="text-2xl">Promise only what you can keep</h2>
        <p className="mt-3">
          Guests will be asked, promise by promise, whether you did what you said. &quot;I&apos;ll stay for the full
          dinner&quot; is a better promise than &quot;every guest gets a one-on-one&quot; if you&apos;re not sure
          there&apos;ll be time.
        </p>
      </section>

      <section className="mt-16">
        <h2 className="text-3xl">Host applications open soon</h2>
        <p className="mt-3 text-ink-2 max-w-2xl">
          We&apos;re onboarding our first hosts in the United States, the United Kingdom and Canada. Tell us about the
          dinner you&apos;d like to host and we&apos;ll be in touch.
        </p>
        <Link
          href="/contact?topic=host"
          className="mt-6 inline-block rounded-full bg-wine text-wine-ink px-6 py-3 hover:opacity-90"
        >
          Apply to host
        </Link>
        <p className="text-sm text-ink-2 mt-4">
          Before applying, read the <Link href="/legal/host-agreement" className="underline underline-offset-4 hover:text-wine">host agreement</Link> and{" "}
          <Link href="/legal/prohibited" className="underline underline-offset-4 hover:text-wine">what can&apos;t be hosted</Link>.
        </p>
      </section>
    </div>
  );
}
