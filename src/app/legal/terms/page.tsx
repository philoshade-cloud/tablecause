import type { Metadata } from "next";
import Link from "next/link";
import Policy from "@/components/Policy";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Terms of service" };

export default function Terms() {
  return (
    <Policy
      title="Terms of service"
      intro={`These terms are an agreement between you and ${site.company} ("TableCause", "we", "us"). They apply when you use the TableCause website and services as a guest, a host or a visitor. By creating an account or booking a seat, you agree to them.`}
    >
      <h2>1. What TableCause does</h2>
      <p>
        TableCause is a platform where hosts list small in-person dinners and guests book seats at them. Each guest
        pays a seat contribution to the host. In return, the guest attends the dinner and the host keeps the promises
        listed for it. The host explains in the listing how the money beyond their own costs and host fee will be
        used.
      </p>
      <p>
        TableCause is not a party to the arrangement between host and guest. The host is the seller of the seat and
        the merchant of record for each payment. We provide the listing, booking, payment and confirmation tools, and
        we review dinners and resolve disputes as described in these terms.
      </p>
      <p>
        Seat contributions are not charitable donations and are not tax-deductible. TableCause does not endorse any
        cause and does not guarantee how hosts use the money they receive.
      </p>

      <h2>2. Accounts</h2>
      <ul>
        <li>You must be at least 18 years old to use TableCause.</li>
        <li>You must give accurate information and keep it up to date.</li>
        <li>You are responsible for activity on your account. Tell us right away if you think someone else is using it.</li>
      </ul>

      <h2>3. Booking a seat</h2>
      <p>
        When you book, you choose a contribution of at least the listed minimum and authorise us and our payment
        provider to save your card and charge it on the host&apos;s behalf as described in our{" "}
        <Link href="/legal/refunds">payments, cancellations and refunds policy</Link>. In short: nothing is charged at
        booking, a hold is placed the day before the dinner, and the payment is taken only after guests confirm the
        dinner happened as promised.
      </p>
      <p>
        You&apos;ll receive the exact address the day before and the reservation name or entry code on the day.
        Please don&apos;t share these with anyone who hasn&apos;t booked.
      </p>

      <h2>4. Confirming the dinner</h2>
      <p>
        After the dinner, we ask each guest whether each listed promise was kept. Please answer honestly. If you checked
        in and don&apos;t answer within 24 hours, we treat your answer as &quot;kept&quot;. Where answers or evidence
        conflict, we decide the outcome based on check-in records, guest answers and evidence from the host. Our
        decision determines how much of each held payment is captured.
      </p>

      <h2>5. Hosting</h2>
      <p>
        Hosts must verify their identity, connect a payout account with our payment provider in their own name and agree to the{" "}
        <Link href="/legal/host-agreement">host agreement</Link>, which forms part of these terms. Hosts are solely
        responsible for their dinners, their venues, the meal, the promises they make, the use of funds they receive
        and their own taxes.
      </p>

      <h2>6. Fees</h2>
      <p>
        TableCause charges a platform fee of 10% of each captured seat contribution, deducted from the payment before it
        reaches the host. The payment provider&apos;s card processing fee is also deducted from the host&apos;s share. Guests pay only
        the contribution they choose.
      </p>

      <h2>7. Conduct</h2>
      <ul>
        <li>Treat hosts, guests and venue staff with respect. Harassment of any kind leads to removal.</li>
        <li>Don&apos;t arrange payments for a TableCause dinner outside TableCause.</li>
        <li>Don&apos;t list or attend dinners that break our <Link href="/legal/prohibited">rules on what can&apos;t be hosted</Link>.</li>
        <li>Don&apos;t impersonate anyone or misrepresent a cause.</li>
      </ul>

      <h2>8. Private residences</h2>
      <p>
        Some dinners take place in a host&apos;s home. These are clearly marked. The host has verified their address
        with us, and guests must verify their phone number to book. Hosts are responsible for the safety of their home
        and for any insurance, building or local rules that apply.
      </p>

      <h2>9. Removing content and accounts</h2>
      <p>
        We may remove a listing, hold back a payment capture, or suspend an account if we reasonably believe these
        terms or the law have been broken, or to protect guests or hosts. Where we can, we&apos;ll tell you why.
      </p>

      <h2>10. Liability</h2>
      <p>
        Hosts provide the dinners, not TableCause. To the extent the law allows, TableCause is not liable for the
        conduct of hosts or guests, for what happens at a dinner, or for how hosts use funds. Our total liability to
        you for any claim relating to TableCause is limited to the platform fees we received from the bookings
        involved. Nothing in these terms limits liability that can&apos;t be limited by law, or any rights you have
        under consumer protection laws where you live.
      </p>

      <h2>11. Changes</h2>
      <p>
        We may update these terms. If a change is significant, we&apos;ll tell you by email or on the site before it
        takes effect. Bookings made before a change are covered by the terms in force when they were made.
      </p>

      <h2>12. Governing law</h2>
      <p>
        These terms are governed by the laws of Singapore. If you&apos;re a consumer, you also keep the protection of
        the mandatory laws of the country where you live, and you may bring claims in your local courts.
      </p>

      <h2>13. Contact</h2>
      <p>
        {site.company}, UEN {site.uen}, {site.companyAddress}. Email {site.supportEmail} or use our{" "}
        <Link href="/contact">contact page</Link>.
      </p>
    </Policy>
  );
}
