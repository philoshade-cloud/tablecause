import type { Metadata } from "next";
import Link from "next/link";
import Policy from "@/components/Policy";

export const metadata: Metadata = { title: "Host agreement" };

export default function HostAgreement() {
  return (
    <Policy
      title="Host agreement"
      intro="This agreement applies to everyone who hosts a dinner on TableCause. It's part of our terms of service. Please read it before you list a dinner."
    >
      <h2>Verification</h2>
      <ul>
        <li>You must verify your identity with a government ID through Stripe and connect a Stripe account in your own name.</li>
        <li>Your display name must be your legal name or the name you use on the public channels you link.</li>
        <li>For dinners at home, you must verify the address with a recent utility bill or similar document.</li>
        <li>You must give us proof of your venue booking before your dinner goes live.</li>
      </ul>

      <h2>Your listing</h2>
      <ul>
        <li>Describe your cause and how the money will be used truthfully and specifically.</li>
        <li>List only promises you&apos;re sure you can keep. Guests confirm each one after the dinner.</li>
        <li>State your host fee clearly. You pay for the meal out of your host fee.</li>
        <li>
          Follow our <Link href="/legal/prohibited">rules on what can&apos;t be hosted</Link>. In particular, don&apos;t
          describe seat contributions as donations or raise money in the name of a charity.
        </li>
      </ul>

      <h2>How you&apos;re paid</h2>
      <p>
        Guest payments are charged directly to your Stripe account after guests confirm the dinner happened as promised.
        TableCause deducts a 10% platform fee from each payment, and Stripe deducts its processing fee. If guests report
        that promises weren&apos;t kept, we review the evidence and may capture only part of a payment or none of it.
        You agree to provide evidence when asked, such as photos from the dinner and venue receipts.
      </p>
      <p>
        If a payment is refunded because you didn&apos;t keep your promises, the Stripe processing fee is not
        returned and comes out of your balance. Chargebacks on your dinners are deducted from your Stripe balance.
      </p>

      <h2>Using the money</h2>
      <p>
        Once you receive the money, you&apos;re responsible for using it as your listing describes. You agree to post an
        update with evidence, such as receipts or a confirmation from the people who benefited, within 90 days of the
        dinner. Hosts who don&apos;t post an update are marked as overdue on their profile and can&apos;t list new
        dinners.
      </p>
      <p>
        Misusing funds can lead to removal from TableCause, claims from guests for repayment and, where the listing was
        deliberately misleading, criminal liability for fraud.
      </p>

      <h2>Taxes</h2>
      <p>
        You&apos;re responsible for any taxes on the money you receive, including income tax on your host fee and any
        sales tax or VAT that applies to your dinner. Money you receive for your cause may also be taxable depending on
        where you live. Stripe may send you tax forms, such as a Form 1099-K in the United States. We recommend talking
        to a tax professional before your first dinner. TableCause doesn&apos;t give tax advice.
      </p>

      <h2>Cancelling</h2>
      <p>
        If you cancel, guests aren&apos;t charged. Cancelling after decision day or not showing up affects your ability
        to host: one late cancellation gets a warning, and a second, or any no-show, ends your hosting privileges.
      </p>

      <h2>Safety</h2>
      <ul>
        <li>Alcohol may only be sold or served by a licensed venue or caterer.</li>
        <li>For dinners at home, you&apos;re responsible for your guests&apos; safety and for any insurance, building or local rules.</li>
        <li>Tell us right away about any incident at your dinner.</li>
      </ul>
    </Policy>
  );
}
