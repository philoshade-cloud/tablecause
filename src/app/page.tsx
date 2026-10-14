import Link from "next/link";
import { Suspense } from "react";
import DinnerCard from "@/components/DinnerCard";
import SeatRing from "@/components/SeatRing";
import { getUpcomingDinners } from "@/lib/data";
import { goLabel, money, shortDate } from "@/lib/format";

async function Featured() {
  const dinners = await getUpcomingDinners();
  const d = dinners[0];
  if (!d) return null;
  const goSeats = d.go_threshold_type === "guests" ? d.go_threshold_value : null;
  return (
    <Link href={`/d/${d.short_code}`} className="group block">
      <figure className="flex flex-col items-center text-center">
        <SeatRing capacity={d.capacity} taken={d.seats_taken} goSeats={goSeats} size={340} animate />
        <figcaption className="mt-4 max-w-xs">
          <span className="block font-serif text-lg group-hover:text-wine">{d.title}</span>
          <span className="block text-sm text-ink-2 mt-1">
            {shortDate(d.starts_at, d.timezone)} in {d.city} · {money(d.min_contribution, d.currency)} a seat · goes ahead
            at {goLabel(d)}
          </span>
        </figcaption>
      </figure>
    </Link>
  );
}

async function Upcoming() {
  const dinners = await getUpcomingDinners();
  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {dinners.slice(0, 6).map((d) => (
        <DinnerCard key={d.id} d={d} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 grid gap-12 lg:grid-cols-[1.1fr_1fr] items-center">
        <div>
          <h1 className="text-5xl sm:text-6xl">Pull up a chair for something you believe in.</h1>
          <p className="mt-6 text-lg text-ink-2 max-w-xl">
            Founders, creators and people doing good work host small dinners. You book a seat, share a meal with them,
            and your contribution goes to what they&apos;re building. Your card is only charged after the dinner happens
            as promised.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/explore" className="rounded-full bg-wine text-wine-ink px-6 py-3 hover:opacity-90">
              Find a dinner
            </Link>
            <Link href="/host" className="rounded-full border border-ink px-6 py-3 hover:bg-ink hover:text-paper">
              Host a dinner
            </Link>
          </div>
        </div>
        <Suspense fallback={<div className="h-[400px]" />}>
          <Featured />
        </Suspense>
      </section>

      <section className="mx-auto max-w-6xl px-4" aria-labelledby="upcoming">
        <div className="flex items-end justify-between mb-6">
          <h2 id="upcoming" className="text-3xl">
            Upcoming dinners
          </h2>
          <Link href="/explore" className="text-sm underline underline-offset-4 hover:text-wine">
            See all dinners
          </Link>
        </div>
        <Suspense fallback={<p className="text-ink-2">Loading dinners…</p>}>
          <Upcoming />
        </Suspense>
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-24 grid gap-10 lg:grid-cols-[1fr_2fr]" aria-labelledby="money">
        <h2 id="money" className="text-3xl">
          How your money moves
        </h2>
        <ol className="grid gap-8 sm:grid-cols-3">
          <li>
            <p className="font-serif text-4xl text-wine">1</p>
            <h3 className="text-lg mt-2">Book a seat</h3>
            <p className="text-ink-2 mt-1">
              Your card is saved and verified. Nothing is charged. If the dinner doesn&apos;t reach its minimum, your
              card is never touched.
            </p>
          </li>
          <li>
            <p className="font-serif text-4xl text-wine">2</p>
            <h3 className="text-lg mt-2">The day before</h3>
            <p className="text-ink-2 mt-1">
              We place a hold for your seat. You get the exact address, and the entry details on the day.
            </p>
          </li>
          <li>
            <p className="font-serif text-4xl text-wine">3</p>
            <h3 className="text-lg mt-2">After dinner</h3>
            <p className="text-ink-2 mt-1">
              You tell us whether the host kept their promises. Only then is the payment taken. If they didn&apos;t,
              the hold is released.
            </p>
          </li>
        </ol>
      </section>

      <section className="mx-auto max-w-6xl px-4 mt-24">
        <div className="rounded-2xl bg-ink text-paper p-10 sm:p-14 grid gap-8 lg:grid-cols-[2fr_1fr] items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl">Have something worth gathering around?</h2>
            <p className="mt-4 text-paper/80 max-w-xl">
              Set a date, a seat price and what you&apos;ll do at the table. We verify who you are, give you a short
              link to share, and handle payments. You keep your host fee and spend the rest on what you said you would.
            </p>
          </div>
          <Link
            href="/host"
            className="justify-self-start lg:justify-self-end rounded-full bg-paper text-ink px-6 py-3 hover:bg-sage"
          >
            Learn about hosting
          </Link>
        </div>
      </section>
    </>
  );
}
