import { cacheLife } from "next/cache";
import { fixtures, fixturesOn } from "./fixtures";
import { db } from "./supabase";
import type { Category, CountryPolicy, DinnerWithHost, Host, Review } from "./types";

const hostCols = "id,handle,display_name,headline,bio,avatar_url,home_city,id_verified,linked_channels,is_sample";
const dinnerSelect = `*, host:profiles!events_host_id_fkey(${hostCols}), category:categories(*)`;
const LISTED = ["open", "confirmed"];

export async function getCategories(): Promise<Category[]> {
  "use cache";
  cacheLife("hours");
  if (fixturesOn()) return fixtures.categories();
  const { data, error } = await db().from("categories").select("*").order("sort_order");
  if (error) throw error;
  return data as Category[];
}

export async function getCountries(): Promise<CountryPolicy[]> {
  "use cache";
  cacheLife("hours");
  if (fixturesOn()) return fixtures.countries();
  const { data, error } = await db().from("country_policies").select("*").eq("is_live", true).order("name");
  if (error) throw error;
  return data as CountryPolicy[];
}

export type DinnerFilters = { country?: string; city?: string; category?: string };

async function categoryIds(slug?: string) {
  if (!slug) return null;
  const cats = await getCategories();
  const parent = cats.find((c) => c.slug === slug);
  if (!parent) return null;
  return cats.filter((c) => c.id === parent.id || c.parent_id === parent.id).map((c) => c.id);
}

export async function getUpcomingDinners(f: DinnerFilters = {}): Promise<DinnerWithHost[]> {
  "use cache";
  cacheLife("minutes");
  const ids = await categoryIds(f.category);
  if (fixturesOn()) {
    return fixtures
      .dinners()
      .filter((d) => LISTED.includes(d.status))
      .filter((d) => !f.country || d.country === f.country)
      .filter((d) => !f.city || d.city.toLowerCase() === f.city.toLowerCase())
      .filter((d) => !ids || (d.category_id != null && ids.includes(d.category_id)))
      .sort((a, b) => a.starts_at.localeCompare(b.starts_at));
  }
  let q = db().from("events").select(dinnerSelect).in("status", LISTED).order("starts_at");
  if (f.country) q = q.eq("country", f.country);
  if (f.city) q = q.ilike("city", f.city);
  if (ids) q = q.in("category_id", ids);
  const { data, error } = await q;
  if (error) throw error;
  return data as unknown as DinnerWithHost[];
}

export async function getDinner(code: string): Promise<DinnerWithHost | null> {
  "use cache";
  cacheLife("minutes");
  if (fixturesOn()) return fixtures.dinners().find((d) => d.short_code === code) ?? null;
  const { data, error } = await db().from("events").select(dinnerSelect).eq("short_code", code).maybeSingle();
  if (error) throw error;
  return data as unknown as DinnerWithHost | null;
}

export async function getHost(handle: string): Promise<Host | null> {
  "use cache";
  cacheLife("minutes");
  if (fixturesOn()) return fixtures.host(handle);
  const { data, error } = await db().from("profiles").select(hostCols).eq("handle", handle).maybeSingle();
  if (error) throw error;
  return data as unknown as Host | null;
}

export async function getHostDinners(hostId: string): Promise<DinnerWithHost[]> {
  "use cache";
  cacheLife("minutes");
  if (fixturesOn()) {
    return fixtures
      .dinners()
      .filter((d) => d.host_id === hostId)
      .sort((a, b) => b.starts_at.localeCompare(a.starts_at));
  }
  const { data, error } = await db()
    .from("events")
    .select(dinnerSelect)
    .eq("host_id", hostId)
    .order("starts_at", { ascending: false });
  if (error) throw error;
  return data as unknown as DinnerWithHost[];
}

export async function getHostReviews(hostId: string): Promise<Review[]> {
  "use cache";
  cacheLife("minutes");
  if (fixturesOn()) return fixtures.reviews(hostId);
  const { data, error } = await db()
    .from("reviews")
    .select("*")
    .eq("host_id", hostId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as Review[];
}

export async function getCities(): Promise<{ country: string; city: string }[]> {
  "use cache";
  cacheLife("minutes");
  const rows = fixturesOn()
    ? fixtures.dinners().filter((d) => LISTED.includes(d.status))
    : ((await db().from("events").select("country,city").in("status", LISTED)).data ?? []);
  const seen = new Map<string, { country: string; city: string }>();
  for (const r of rows) seen.set(`${r.country}:${r.city}`, { country: r.country, city: r.city });
  return [...seen.values()].sort((a, b) => a.city.localeCompare(b.city));
}
