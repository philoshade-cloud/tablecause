import "server-only";
import Stripe from "stripe";

export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export const isTestMode = () => (process.env.STRIPE_SECRET_KEY ?? "").startsWith("sk_test_");

// Card details are saved on the host's own Stripe account, because the host is the merchant of record.
// In test mode only, if a sample host hasn't connected a Stripe account yet, we save the card on the
// platform account so the booking flow can still be tried end to end.
export function accountFor(hostAccount: string | null) {
  if (hostAccount) return hostAccount;
  if (isTestMode()) return undefined;
  throw new Error("This host hasn't connected a Stripe account yet");
}
