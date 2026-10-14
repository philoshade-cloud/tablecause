import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getDinner } from "@/lib/data";
import { clock, dinnerDate, goLabel, money, shortDate, tzName } from "@/lib/format";
import BookingForm from "./BookingForm";

type Params = Promise<{ code: string }>;

export const metadata = { title: "Book a seat" };

async function Book({ params }: { params: Params }) {
  const { code } = await params;
  const d = await getDinner(code);
  if (!d) notFound();
  if (!["open", "confirmed"].includes(d.status) || d.seats_taken >= d.capacity) {
    return (
      <div className="mx-auto max-w-xl px-4 pt-16">
        <h1 className="text-3xl">This dinner isn&apos;t taking bookings</h1>
        <p className="text-ink-2 mt-2">It may be full or already over.</p>
        <Link href="/explore" className="mt-6 inline-block underline underline-offset-4 hover:text-wine">Find another dinner</Link>
      </div>
    );
  }
  const paymentsReady = Boolean(process.env.STRIPE_SECRET_KEY && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

  return (
    <div className="mx-auto max-w-5xl px-4 pt-12 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
      <aside>
        <Link href={`/d/${d.short_code}`} className="text-sm text-ink-2 hover:text-wine">Back to the dinner</Link>
        <h1 className="text-3xl mt-3">{d.title}</h1>
        <p className="mt-2">
          {dinnerDate(d.starts_at, d.timezone)}, {clock(d.starts_at, d.timezone)} to {clock(d.ends_at, d.timezone)}{" "}
          {tzName(d.starts_at, d.timezone)}
        </p>
        <p className="text-ink-2">
          {d.venue_type === "private_residence" ? "Host's home in " : ""}
          {d.neighborhood ? `${d.neighborhood}, ` : ""}
          {d.city} · hosted by {d.host.display_name}
        </p>

        <h2 className="text-xl mt-10 mb-3">What happens next</h2>
        <ol className="space-y-3 text-sm">
          <li>
            <strong>Today:</strong> we verify your card. Nothing is charged.
          </li>
          <li>
            <strong>{shortDate(d.go_deadline, d.timezone)}:</strong> the dinner goes ahead if it reaches {goLabel(d)}.
            If not, your card is never charged. Until then you can cancel for free.
          </li>
          <li>
            <strong>The day before:</strong> we place a hold for your contribution and send you the address.
          </li>
          <li>
            <strong>Within 24 hours after:</strong> you confirm the host kept their promises, and the payment is taken.
            If they didn&apos;t, the hold is released or reduced.
          </li>
        </ol>
        <p className="text-sm text-ink-2 mt-6">
          Minimum seat {money(d.min_contribution, d.currency)}. TableCause keeps 10% and the host pays for the meal from
          their host fee.
        </p>
      </aside>
      <div className="rounded-2xl border border-line p-6 sm:p-8 self-start">
        <BookingForm
          eventId={d.id}
          code={d.short_code}
          currency={d.currency}
          minContribution={d.min_contribution}
          isHome={d.venue_type === "private_residence"}
          goDeadlineLabel={shortDate(d.go_deadline, d.timezone)}
          paymentsReady={paymentsReady}
        />
      </div>
    </div>
  );
}

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-5xl px-4 pt-12 text-ink-2">Loading…</div>}>
      <Book params={params} />
    </Suspense>
  );
}
