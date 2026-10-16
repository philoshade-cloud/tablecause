import type { Metadata } from "next";
import Link from "next/link";
import Policy from "@/components/Policy";

export const metadata: Metadata = { title: "Payments, cancellations and refunds" };

export default function Refunds() {
  return (
    <Policy
      title="Payments, cancellations and refunds"
      intro="Guests are only charged after a dinner has happened and they've confirmed the host kept their promises. This page explains exactly when money moves and what happens if plans change."
    >
      <h2>What you pay</h2>
      <p>
        Each dinner has a minimum seat contribution set by the host. You can choose to contribute more. The amount you
        choose is the total you pay. We don&apos;t add booking fees on top.
      </p>
      <p>
        Out of each payment, TableCause keeps a 10% platform fee and our payment provider deducts its card
        processing fee. The rest goes to the host, who pays for the meal and keeps the host fee shown on the listing,
        then uses the remainder as described in the listing&apos;s &quot;How the money will be used&quot; section.
      </p>
      <p>
        Seat contributions are payments to the host for attending the dinner. They are not donations to a charity and
        are not tax-deductible.
      </p>

      <h2>When your card is charged</h2>
      <ul>
        <li>
          <strong>When you book:</strong> we save and verify your card. Your bank may ask you to confirm it. Nothing is
          charged.
        </li>
        <li>
          <strong>On decision day</strong> (shown on each listing, usually 7 days before): if the dinner hasn&apos;t
          reached its minimum number of guests or amount, it&apos;s cancelled and your card is never charged.
        </li>
        <li>
          <strong>The day before the dinner:</strong> we place a temporary hold on your card for your contribution.
          A hold reserves the amount but doesn&apos;t take it. If the hold fails, we&apos;ll ask you to update your card. If
          it&apos;s still failing 3 hours before the dinner starts, your seat is released.
        </li>
        <li>
          <strong>Within 24 hours after the dinner:</strong> once guests confirm the host kept their promises, the
          held amount is captured and paid to the host. If you don&apos;t respond within 24 hours and you checked in
          at the dinner, we treat your answer as &quot;kept&quot;.
        </li>
      </ul>
      <p>The charge appears on your statement under the host&apos;s name with a reference to TableCause.</p>

      <h2>If the host doesn&apos;t keep their promises</h2>
      <p>
        After the dinner, each guest confirms whether each promise was kept, partly kept or not kept. If enough guests
        report a problem, or few guests checked in, we review the dinner before any payment is taken. We look at
        check-in records, guest answers, the guest check-in partway through the dinner, and evidence the host provides.
      </p>
      <ul>
        <li>If the promises were kept, the full amount is captured.</li>
        <li>If some promises weren&apos;t kept, we capture only part of the amount.</li>
        <li>If the dinner didn&apos;t really happen, we release the hold and you pay nothing.</li>
      </ul>
      <p>
        If our review takes longer than your card&apos;s hold allows, we capture the payment and then refund it in
        full or in part according to the outcome. Refunds go back to the card you paid with and usually appear within
        5 to 10 business days.
      </p>

      <h2>If the host cancels</h2>
      <p>
        If the host cancels before decision day, or the dinner doesn&apos;t reach its minimum, your card is not charged.
        If the host cancels after the hold is placed, the hold is released. If a host doesn&apos;t show up, you pay
        nothing and the host loses their hosting privileges.
      </p>

      <h2>If you cancel</h2>
      <ul>
        <li>
          <strong>Before decision day:</strong> cancel any time from your booking confirmation email. You won&apos;t be
          charged.
        </li>
        <li>
          <strong>After decision day:</strong> your seat is confirmed and the host is counting on you, so you&apos;ll
          still be charged if the dinner goes ahead. If someone from the waitlist takes your seat, or you transfer it
          to a friend, you won&apos;t be charged.
        </li>
      </ul>

      <h2>Disputes and chargebacks</h2>
      <p>
        If something went wrong, please <Link href="/contact?topic=booking">contact us</Link> first. We can usually
        resolve it faster than your bank can. You keep any rights you have with your card issuer.
      </p>

      <h2>Questions</h2>
      <p>
        Write to us through the <Link href="/contact?topic=booking">contact page</Link> and include the dinner link. We
        reply within two business days.
      </p>
    </Policy>
  );
}
