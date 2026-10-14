import type { Metadata } from "next";
import { Suspense } from "react";
import DinnerCard from "@/components/DinnerCard";
import { getCategories, getCities, getCountries, getUpcomingDinners } from "@/lib/data";

export const metadata: Metadata = { title: "Find a dinner" };

type SP = Promise<{ [k: string]: string | string[] | undefined }>;
const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) || undefined;

async function Filters({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const [countries, cities, categories] = await Promise.all([getCountries(), getCities(), getCategories()]);
  const parents = categories.filter((c) => c.parent_id === null);
  const sel = "w-full rounded-lg border border-line bg-paper px-3 py-2";
  return (
    <form className="grid gap-4 sm:grid-cols-4 items-end" action="/explore">
      <label className="text-sm">
        <span className="block mb-1 text-ink-2">Country</span>
        <select name="country" defaultValue={one(sp.country) ?? ""} className={sel}>
          <option value="">Any country</option>
          {countries.map((c) => (
            <option key={c.country} value={c.country}>{c.name}</option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        <span className="block mb-1 text-ink-2">City</span>
        <select name="city" defaultValue={one(sp.city) ?? ""} className={sel}>
          <option value="">Any city</option>
          {cities.map((c) => (
            <option key={`${c.country}-${c.city}`} value={c.city}>{c.city}</option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        <span className="block mb-1 text-ink-2">Cause</span>
        <select name="category" defaultValue={one(sp.category) ?? ""} className={sel}>
          <option value="">Any cause</option>
          {parents.map((c) => (
            <option key={c.slug} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </label>
      <button className="rounded-full bg-ink text-paper px-5 py-2.5 hover:opacity-90">Show dinners</button>
    </form>
  );
}

async function Results({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const dinners = await getUpcomingDinners({
    country: one(sp.country),
    city: one(sp.city),
    category: one(sp.category),
  });
  if (dinners.length === 0) {
    return (
      <div className="py-16 max-w-lg">
        <h2 className="text-2xl">No dinners match these filters yet.</h2>
        <p className="text-ink-2 mt-2">
          Try another city or cause, or <a href="/host" className="underline underline-offset-4 hover:text-wine">host the first one</a>.
        </p>
      </div>
    );
  }
  return (
    <>
      <p className="text-sm text-ink-2 mb-6">{dinners.length} {dinners.length === 1 ? "dinner" : "dinners"}</p>
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {dinners.map((d) => (
          <DinnerCard key={d.id} d={d} />
        ))}
      </div>
    </>
  );
}

export default function Explore({ searchParams }: { searchParams: SP }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      <h1 className="text-4xl">Find a dinner</h1>
      <p className="text-ink-2 mt-2 max-w-xl">
        Every dinner below is hosted by someone whose identity we&apos;ve verified, at a venue they&apos;ve booked.
      </p>
      <div className="mt-8 mb-10">
        <Suspense fallback={<div className="h-16" />}>
          <Filters searchParams={searchParams} />
        </Suspense>
      </div>
      <Suspense fallback={<p className="text-ink-2">Loading dinners…</p>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
