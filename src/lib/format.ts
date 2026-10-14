import type { Dinner } from "./types";

const zeroDecimal = new Set(["krw", "jpy"]);

export function money(minor: number, currency: string) {
  const cur = currency.toUpperCase();
  const value = zeroDecimal.has(currency) ? minor : minor / 100;
  return new Intl.NumberFormat("en", {
    style: "currency",
    currency: cur,
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}

export function dinnerDate(iso: string, tz: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: tz,
  }).format(new Date(iso));
}

export function shortDate(iso: string, tz: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: tz,
  }).format(new Date(iso));
}

export function clock(iso: string, tz: string) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
  }).format(new Date(iso));
}

export function tzName(iso: string, tz: string) {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" }).formatToParts(new Date(iso));
  return parts.find((p) => p.type === "timeZoneName")?.value ?? tz;
}

export function hostFeeLabel(d: Pick<Dinner, "host_fee_type" | "host_fee_value" | "currency">) {
  return d.host_fee_type === "percent" ? `${d.host_fee_value}%` : money(d.host_fee_value, d.currency);
}

export function goLabel(d: Pick<Dinner, "go_threshold_type" | "go_threshold_value" | "currency">) {
  return d.go_threshold_type === "guests"
    ? `${d.go_threshold_value} guests`
    : `${money(d.go_threshold_value, d.currency)} pledged`;
}

export function goProgress(d: Dinner) {
  const have = d.go_threshold_type === "guests" ? d.seats_taken : d.amount_pledged;
  return Math.min(1, have / d.go_threshold_value);
}

export const PLATFORM_FEE_PERCENT = 10;

// Where a typical seat's money goes, before card processing (charged by Stripe, varies by card and country).
export function seatSplit(d: Dinner, seat = d.min_contribution) {
  const platform = Math.round((seat * PLATFORM_FEE_PERCENT) / 100);
  const afterPlatform = seat - platform;
  const hostPerSeat =
    d.host_fee_type === "percent"
      ? Math.round((afterPlatform * d.host_fee_value) / 100)
      : Math.round(d.host_fee_value / Math.max(1, d.capacity));
  const host = Math.min(afterPlatform, hostPerSeat);
  return { seat, platform, host, cause: afterPlatform - host };
}

export const countryName: Record<string, string> = {
  US: "United States",
  GB: "United Kingdom",
  CA: "Canada",
};
