// Offline copy of the sample data, used only when TC_FIXTURES=1 (local previews without database access).
import raw from "./fixtures.json";
import type { Category, CountryPolicy, Dinner, DinnerWithHost, Host, Review } from "./types";

const fx = raw as unknown as {
  countries: CountryPolicy[];
  categories: Category[];
  profiles: Host[];
  events: Dinner[];
  reviews: Review[];
};

export const fixturesOn = () => process.env.TC_FIXTURES === "1";

const withHost = (e: Dinner): DinnerWithHost => ({
  ...e,
  host: fx.profiles.find((p) => p.id === e.host_id)!,
  category: fx.categories.find((c) => c.id === e.category_id) ?? null,
});

export const fixtures = {
  countries: () => fx.countries,
  categories: () => [...fx.categories].sort((a, b) => a.sort_order - b.sort_order),
  dinners: () => fx.events.map(withHost),
  host: (handle: string) => fx.profiles.find((p) => p.handle === handle) ?? null,
  reviews: (hostId: string) => fx.reviews.filter((r) => r.host_id === hostId),
};
