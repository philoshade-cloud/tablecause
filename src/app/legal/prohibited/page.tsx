import type { Metadata } from "next";
import Link from "next/link";
import Policy from "@/components/Policy";

export const metadata: Metadata = { title: "What can't be hosted" };

export default function Prohibited() {
  return (
    <Policy
      title="What can't be hosted"
      intro="TableCause is for dinners where guests back a host's project or cause. Some causes and activities aren't allowed, either because the law treats them differently or because they put guests at risk. We review every dinner before it goes live and remove listings that break these rules."
    >
      <h2>Causes we don&apos;t allow</h2>
      <ul>
        <li>Political fundraising, including for parties, candidates, election campaigns and political action committees</li>
        <li>Religious fundraising, including donations to a place of worship, tithes and missionary work</li>
        <li>Raising money in the name of a registered charity or nonprofit, or saying funds will be donated to one</li>
        <li>Investment offers, including equity, loans, profit sharing, tokens or any promise of financial return</li>
        <li>Paying off personal debts or bail</li>
        <li>Weapons, ammunition, explosives or their parts</li>
        <li>Gambling, lotteries, raffles or prize draws</li>
        <li>Adult content or services</li>
        <li>Drugs, cannabis or CBD products, tobacco and vaping products</li>
        <li>Medical products or treatments with unproven health claims</li>
        <li>Multi-level marketing, pyramid schemes and get-rich-quick programs</li>
        <li>Anything that promotes hate, violence, harassment or discrimination</li>
        <li>Anything illegal where the dinner takes place</li>
      </ul>

      <h2>Words we don&apos;t allow in listings</h2>
      <p>
        Because seat contributions are payments to the host, not donations, listings can&apos;t describe them as
        &quot;donations&quot; or say they&apos;re tax-deductible.
      </p>

      <h2>Causes that vary by country</h2>
      <p>
        In some countries, raising money for public-benefit causes such as social welfare, health, education, the
        environment or disaster relief requires a permit. Where that applies, those categories aren&apos;t available,
        and hosts can create dinners for their own startups, creative projects or hosting experiences instead.
      </p>

      <h2>How dinners must be run</h2>
      <ul>
        <li>Hosts must be who they say they are. Impersonating someone else leads to a permanent ban.</li>
        <li>Dinners must take place in person, at a venue the host has booked or at the host&apos;s own home.</li>
        <li>
          Alcohol can only be sold or served by a venue or caterer with the right licence. At dinners in a private
          home, alcohol is not served unless a licensed caterer provides it.
        </li>
        <li>Guests must be 18 or older, and of legal drinking age to drink.</li>
        <li>Hosts can&apos;t ask guests to pay anything outside TableCause for the dinner.</li>
      </ul>

      <h2>Report a listing</h2>
      <p>
        If a dinner breaks these rules or a host seems to be impersonating someone, <Link href="/contact?topic=report">report it</Link>.
        We pause bookings while we look into it.
      </p>
    </Policy>
  );
}
