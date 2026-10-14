import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "How it works" };

const timeline = [
  {
    when: "When you book",
    what: "You choose your seat contribution (at least the minimum) and add a card. We verify the card with your bank. Nothing is charged.",
  },
  {
    when: "Decision day, usually a week before",
    what: "If the dinner reaches its minimum number of guests or amount, your seat is confirmed. If not, the dinner is cancelled and your card is never charged.",
  },
  {
    when: "The day before",
    what: "We place a hold on your card for your contribution and send you the exact address. If the hold fails, we'll ask you to update your card so you keep your seat.",
  },
  {
    when: "On the day",
    what: "You get the reservation name or entry code. Check in when you arrive. Partway through, we'll ask how it's going so the host can fix anything on the spot.",
  },
  {
    when: "Within 24 hours after",
    what: "You confirm, promise by promise, whether the host did what they said. If they did, the payment goes through. If they didn't, we release or reduce the hold.",
  },
  {
    when: "Within 90 days",
    what: "The host posts an update on how the money was used. You'll get it by email.",
  },
];

export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      <h1 className="text-4xl sm:text-5xl max-w-3xl">You pay after the dinner, not before.</h1>
      <p className="text-lg text-ink-2 mt-4 max-w-2xl">
        TableCause lets hosts raise money for what they&apos;re building by sharing a meal with the people who back
        them. Here&apos;s what happens to a guest&apos;s booking, step by step.
      </p>

      <ol className="mt-12 max-w-3xl">
        {timeline.map((t, i) => (
          <li key={t.when} className="grid grid-cols-[3rem_1fr] gap-4 pb-10 relative">
            <span className="font-serif text-3xl text-wine">{i + 1}</span>
            <div>
              <h2 className="text-xl">{t.when}</h2>
              <p className="text-ink-2 mt-1">{t.what}</p>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-8 grid gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl">What we check</h2>
          <ul className="mt-4 space-y-3">
            <li>Every host verifies their identity with a government ID through our payment partner, Stripe.</li>
            <li>Hosts can link their public channels, so you can see the dinner was shared by the real person.</li>
            <li>Hosts give us proof of their venue booking. For dinners at home, they verify their address.</li>
            <li>Guests confirm whether the dinner happened as promised before any payment is taken.</li>
          </ul>
        </div>
        <div>
          <h2 className="text-3xl">What we don&apos;t do</h2>
          <ul className="mt-4 space-y-3">
            <li>We don&apos;t endorse causes or guarantee how hosts spend the money after the dinner.</li>
            <li>Seat contributions are not tax-deductible donations.</li>
            <li>We don&apos;t allow political or religious fundraising, or raising money in the name of a charity.</li>
          </ul>
        </div>
      </section>

      <section className="mt-16 rounded-2xl border border-line p-8">
        <h2 className="text-3xl">Fees</h2>
        <p className="mt-3 max-w-2xl">
          TableCause takes 10% of each seat. The card processing fee, charged by Stripe, also comes out of each payment
          and varies by country and card type. Guests pay exactly the seat price they choose, with nothing added. If a
          dinner doesn&apos;t go ahead, nobody pays anything.
        </p>
        <p className="mt-3 text-ink-2">
          Full details are in <Link href="/legal/refunds" className="underline underline-offset-4 hover:text-wine">payments, cancellations and refunds</Link>.
        </p>
      </section>
    </div>
  );
}
