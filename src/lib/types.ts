export type Channel = { type: string; label: string; verified: boolean };

export type Host = {
  id: string;
  handle: string;
  display_name: string;
  headline: string | null;
  bio: string | null;
  avatar_url: string | null;
  home_city: string | null;
  id_verified: boolean;
  linked_channels: Channel[];
  is_sample: boolean;
};

export type Category = {
  id: number;
  slug: string;
  name: string;
  parent_id: number | null;
  public_benefit: boolean;
  sort_order: number;
};

export type Dinner = {
  id: string;
  short_code: string;
  host_id: string;
  title: string;
  summary: string;
  story: string;
  cause_type: "community" | "personal" | "host_experience";
  category_id: number | null;
  tags: string[];
  use_of_funds: { label: string; percent: number }[];
  commitments: string[];
  image_url: string | null;
  starts_at: string;
  ends_at: string;
  timezone: string;
  country: string;
  city: string;
  neighborhood: string | null;
  venue_type: "commercial" | "private_residence";
  capacity: number;
  currency: string;
  min_contribution: number;
  go_threshold_type: "guests" | "total";
  go_threshold_value: number;
  go_deadline: string;
  host_fee_type: "fixed" | "percent";
  host_fee_value: number;
  est_meal_value: number | null;
  alcohol: "none" | "venue" | "licensed_caterer";
  min_age: number;
  status: "draft" | "venue_review" | "open" | "confirmed" | "completed" | "cancelled";
  seats_taken: number;
  amount_pledged: number;
  is_sample: boolean;
};

export type DinnerWithHost = Dinner & { host: Host; category: Category | null };

export type Review = {
  id: string;
  event_id: string;
  host_id: string;
  guest_display_name: string;
  rating: number;
  body: string | null;
  created_at: string;
};

export type CountryPolicy = {
  country: string;
  name: string;
  currency: string;
  allow_public_benefit: boolean;
  is_live: boolean;
};
