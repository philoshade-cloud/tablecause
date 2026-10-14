import "server-only";
import Stripe from "stripe";

export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export const isTestMode = () => (process.env.STRIPE_SECRET_KEY ?? "").startsWith("sk_test_");

// Card details are saved on the host's own Stripe account, because the host is the merchant of record.
// In test mode only, if a sample host's account isn't connected or hasn't finished onboarding, we save the
// card on the platform account so the booking flow can still be tried end to end.
export async function accountFor(s: Stripe, hostAccount: string | null): Promise<string | undefined> {
  if (hostAccount) {
    if (!isTestMode()) return hostAccount;
    const acct = await s.accounts.retrieve(hostAccount).catch(() => null);
    if (acct?.charges_enabled) return hostAccount;
  }
  if (isTestMode()) return undefined;
  throw new Error("This host hasn't connected a Stripe account yet");
}
