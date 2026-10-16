import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import HostBadge from "@/components/HostBadge";
import SeatRing from "@/components/SeatRing";
import { getDinner, getHostReviews } from "@/lib/data";
import { clock, dinnerDate, goLabel, hostFeeLabel, money, seatSplit, shortDate, tzName } from "@/lib/format";
import type { DinnerWithHost } from "@/lib/types";

type Params = Promise<{ code: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { code } = await params;
  const d = await getDinner(code);
  return d ? { title: d.title, description: d.summary } : { title: "Dinner not found" };
}

function Split({ d }: { d: DinnerWithHost }) {
  const s = seatSplit(d);
  const rows = [
    { label: "Goes to the cause", value: s.cause, color: "var(--ok)" },
    { label: `Host fee (${hostFeeLabel(d)}${d.host_fee_type === "fixed" ? " for the dinner" : ""})`, value: s.host, color: "var(--candle)" },
    { label: "TableCause fee (10%)", value: s.platform, color: "var(--ink-2)" },
  ];
  const hostHeavy = s.host / Math.max(1, s.seat - s.platform) > 0.5;
  return (
    <div>
      <div className="flex h-3 rounded-full overflow-hidden" aria-hidden>
        {rows.map((r) => (
          <span key={r.label} style={{ width: `${(r.value / s.seat) * 100}%`, background: r.color }} />
        ))}
      </div>
      <dl className="mt-4 space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-4 text-sm">
            <dt className="flex items-center gap-2">
              <span className="inline-block size-2.5 rounded-full" style={{ background: r.color }} />
              {r.label}
            </dt>
            <dd className="tabular-nums">{money(r.value, d.currency)}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-ink-2 mt-3">
        Based on the minimum seat of {money(s.seat, d.currency)}. The host pays for the meal out of the host fee. Card
        processing (charged by our payment provider, usually around 3%) comes out of the host&apos;s share.
      </p>
      {hostHeavy && (
        <p className="text-sm mt-3 rounded-lg bg-paper-2 p-3">Most of your contribution goes to the host.</p>
      )}
    </div>
  );
}

async function Reviews({ hostId }: { hostId: string }) {
  const reviews = await getHostReviews(hostId);
  if (reviews.length === 0) return <p className="text-ink-2">No reviews yet. This host&apos;s first dinner.</p>;
  const avg = reviews.reduce((a, r) => a + r.rating, 0) / reviews.length;
  return (
    <div>
      <p className="text-sm text-ink-2 mb-4">
        {avg.toFixed(1)} out of 5 from {reviews.length} guests at past dinners
      </p>
      <ul className="space-y-4">
        {reviews.slice(0, 3).map((r) => (
          <li key={r.id} className="border-t border-line pt-4">
            <p className="text-sm" aria-label={`${r.rating} out of 5`}>
              {"★".repeat(r.rating)}
              <span className="text-line">{"★".repeat(5 - r.rating)}</span>
            </p>
            <p className="mt-1">{r.body}</p>
            <p className="text-sm text-ink-2 mt-1">{r.guest_display_name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function Dinner({ params }: { params: Params }) {
  const { code } = await params;
  const d = await getDinner(code);
  if (!d) notFound();
  const goSeats = d.go_threshold_type === "guests" ? d.go_threshold_value : null;
  const open = d.capacity - d.seats_taken;
  const bookable = (d.status === "open" || d.status === "confirmed") && open > 0;
  const tz = tzName(d.starts_at, d.timezone);

  return (
    <article className="mx-auto max-w-6xl px-4 pt-10">
      {d.is_sample && (
        <p className="mb-6 rounded-lg border border-line bg-paper-2 px-4 py-3 text-sm">
          This is a sample dinner to show how listings work. The host and details are illustrative.
        </p>
      )}
      <div className="relative aspect-[21/9] rounded-2xl overflow-hidden bg-paper-2">
        {d.image_url && <Image src={d.image_url} alt="" fill priority sizes="100vw" className="object-cover" />}
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <p className="text-ink-2">
            {d.category?.name} · {d.neighborhood ? `${d.neighborhood}, ` : ""}
            {d.city}
          </p>
          <h1 className="text-4xl sm:text-5xl mt-2">{d.title}</h1>
          <p className="text-lg text-ink-2 mt-4">{d.summary}</p>
          <div className="mt-6">
            <HostBadge host={d.host} />
          </div>
          <div className="mt-6 lg:hidden rounded-xl border border-line p-4 flex items-center justify-between gap-4">
            <p className="text-sm">
              {shortDate(d.starts_at, d.timezone)}, {clock(d.starts_at, d.timezone)}
              <br />
              <span className="text-ink-2">From {money(d.min_contribution, d.currency)} · {Math.max(0, open)} seats open</span>
            </p>
            {bookable && (
              <Link href={`/d/${d.short_code}/book`} className="rounded-full bg-wine text-wine-ink px-5 py-2.5 shrink-0">
                Book a seat
              </Link>
            )}
          </div>

          <section className="mt-12">
            <h2 className="text-2xl mb-3">Why this dinner</h2>
            <p className="max-w-[65ch]">{d.story}</p>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl mb-1">What {d.host.display_name.split(" ")[0]} promises</h2>
            <p className="text-sm text-ink-2 mb-4">
              After the dinner, guests confirm each of these. Your payment is only taken if they were kept.
            </p>
            <ul className="space-y-3">
              {d.commitments.map((c) => (
                <li key={c} className="flex gap-3">
                  <svg viewBox="0 0 20 20" className="size-5 shrink-0 mt-0.5" aria-hidden>
                    <circle cx="10" cy="10" r="9" fill="none" stroke="var(--wine)" strokeWidth="1.5" />
                    <path d="M6 10.5l2.5 2.5L14 7.5" fill="none" stroke="var(--wine)" strokeWidth="1.8" />
                  </svg>
                  <span>{c}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl mb-4">How the money will be used</h2>
            <ul className="space-y-3 max-w-xl">
              {d.use_of_funds.map((u) => (
                <li key={u.label}>
                  <div className="flex justify-between text-sm">
                    <span>{u.label}</span>
                    <span className="tabular-nums">{u.percent}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-paper-2 mt-1.5">
                    <div className="h-full rounded-full bg-ok" style={{ width: `${u.percent}%` }} />
                  </div>
                </li>
              ))}
            </ul>
            <p className="text-sm text-ink-2 mt-4 max-w-xl">
              The host receives the money and is responsible for using it as described here. They&apos;re asked to post
              an update with receipts within 90 days. TableCause checks the host&apos;s identity, venue and whether the
              dinner happened, but does not guarantee how the funds are spent.
              {d.country === "GB" &&
                " The money goes to the host, not to a registered charity, so you contribute at your own risk."}
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl mb-4">Where the venue is</h2>
            {d.venue_type === "private_residence" ? (
              <div className="rounded-lg border border-line p-4">
                <p className="font-medium">Private residence</p>
                <p className="text-sm text-ink-2 mt-1">
                  This dinner is in the host&apos;s home. The host has verified their address with us. You&apos;ll
                  need to verify your phone number to book, and you&apos;ll get the exact address the day before.
                  {d.est_meal_value &&
                    ` The host cooks the meal themselves (valued at about ${money(d.est_meal_value, d.currency)} a person, included in your seat).`}
                </p>
              </div>
            ) : (
              <p>
                A restaurant or private dining room in {d.neighborhood ? `${d.neighborhood}, ` : ""}
                {d.city}. You&apos;ll get the exact address the day before, and the name or code to give at the door
                on the day.
              </p>
            )}
            <p className="text-sm text-ink-2 mt-3">
              {d.alcohol === "none"
                ? "No alcohol is served."
                : d.alcohol === "venue"
                  ? `Drinks are available to buy from the venue, for guests of legal drinking age${d.country === "US" ? " (21 in the US)" : ""}.`
                  : "Drinks are served by a licensed caterer."}{" "}
              Guests must be {d.min_age} or older.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl mb-4">About the host</h2>
            <HostBadge host={d.host} />
            {d.host.bio && <p className="mt-4 max-w-[65ch]">{d.host.bio}</p>}
            <div className="mt-6">
              <Suspense fallback={null}>
                <Reviews hostId={d.host.id} />
              </Suspense>
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-6 self-start">
          <div className="rounded-2xl border border-line p-6">
            <p className="font-serif text-2xl">{dinnerDate(d.starts_at, d.timezone)}</p>
            <p className="text-ink-2">
              {clock(d.starts_at, d.timezone)} to {clock(d.ends_at, d.timezone)} {tz}
            </p>
            <div className="flex justify-center my-6">
              <SeatRing capacity={d.capacity} taken={d.seats_taken} goSeats={goSeats} size={220} animate />
            </div>
            <dl className="text-sm space-y-2">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-2">Seat</dt>
                <dd>From {money(d.min_contribution, d.currency)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-2">Goes ahead at</dt>
                <dd>{goLabel(d)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-ink-2">Decided on</dt>
                <dd>{shortDate(d.go_deadline, d.timezone)}</dd>
              </div>
              {d.go_threshold_type === "total" && (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-2">Pledged so far</dt>
                  <dd>{money(d.amount_pledged, d.currency)}</dd>
                </div>
              )}
            </dl>
            {goSeats != null && d.seats_taken < goSeats && (
              <p className="text-xs text-ink-2 mt-3 flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-candle" /> Marked seats still need to fill for the
                dinner to go ahead.
              </p>
            )}
            {d.status === "completed" ? (
              <p className="mt-6 rounded-full bg-paper-2 text-center py-3">This dinner has happened</p>
            ) : bookable ? (
              <Link
                href={`/d/${d.short_code}/book`}
                className="mt-6 block rounded-full bg-wine text-wine-ink text-center py-3 hover:opacity-90"
              >
                Book a seat
              </Link>
            ) : (
              <p className="mt-6 rounded-full bg-paper-2 text-center py-3">Fully booked</p>
            )}
            <p className="text-xs text-ink-2 mt-3 text-center">
              No charge now. Paid only after the dinner, if the host keeps their promises.
            </p>
          </div>
          <div className="rounded-2xl border border-line p-6 mt-6">
            <h2 className="text-lg mb-4">Where a seat goes</h2>
            <Split d={d} />
          </div>
          <p className="text-sm text-ink-2 mt-4">
            Share this dinner: <span className="text-ink break-all">{(process.env.NEXT_PUBLIC_SITE_URL ?? "").replace(/^https?:\/\//, "")}/d/{d.short_code}</span>
            <br />
            Something wrong with this listing?{" "}
            <Link href={`/contact?topic=report&dinner=${d.short_code}`} className="underline underline-offset-4 hover:text-wine">
              Report it
            </Link>
          </p>
        </aside>
      </div>
    </article>
  );
}

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 pt-10 text-ink-2">Loading dinner…</div>}>
      <Dinner params={params} />
    </Suspense>
  );
}
