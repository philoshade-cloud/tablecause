import type { Metadata } from "next";
import Link from "next/link";
import Policy from "@/components/Policy";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy policy" };

export default function Privacy() {
  return (
    <Policy
      title="Privacy policy"
      intro={`This policy explains what personal information ${site.company} ("TableCause") collects, why, who we share it with and the choices you have.`}
    >
      <h2>What we collect</h2>
      <ul>
        <li><strong>Account details:</strong> name, email address, and phone number if you verify it.</li>
        <li>
          <strong>Booking details:</strong> the dinners you book, your contribution, check-in and your answers after
          the dinner.
        </li>
        <li>
          <strong>Payment details:</strong> your card is collected and stored by Stripe. We never see or store your
          full card number.
        </li>
        <li>
          <strong>Host details:</strong> identity verification, payout account and tax information are collected by
          Stripe. We receive the result of identity checks and the public channels hosts choose to link. For dinners at
          home, we receive proof of address.
        </li>
        <li><strong>Messages</strong> you send to us, and reviews you post.</li>
        <li><strong>Technical data:</strong> device, browser and usage information used to keep the site secure and working.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To run bookings, place holds and take payments, and send you dinner details</li>
        <li>To verify hosts, review dinners and decide disputes</li>
        <li>To prevent fraud, impersonation and abuse</li>
        <li>To answer your questions and send you updates about dinners you booked</li>
        <li>To meet legal, tax and accounting obligations</li>
      </ul>
      <p>We don&apos;t sell your personal information and we don&apos;t use it for third-party advertising.</p>

      <h2>Who we share it with</h2>
      <ul>
        <li>
          <strong>Hosts</strong> see the name of each guest who books their dinner, their contribution, check-in
          status and answers about their dinner. Hosts don&apos;t see guests&apos; card details.
        </li>
        <li>
          <strong>Other guests</strong> don&apos;t see your contribution. Your first name may be shown to the host
          and, if you choose, on the guest list.
        </li>
        <li><strong>Stripe</strong>, which processes payments and verifies hosts.</li>
        <li><strong>Service providers</strong> who host our site and database or send our emails, under contracts that protect your data.</li>
        <li><strong>Authorities</strong>, where the law requires it or to prevent fraud or harm.</li>
      </ul>

      <h2>Where it&apos;s stored</h2>
      <p>
        Our database is hosted in the United States. If you&apos;re in the United Kingdom or Canada, your data is
        transferred to the United States with safeguards required by the laws that apply to you.
      </p>

      <h2>How long we keep it</h2>
      <p>
        We keep account information while your account is open. We keep booking and payment records for 5 years to
        meet legal and anti-fraud obligations, then delete or anonymise them.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        Depending on where you live, you can ask to access, correct, delete or receive a copy of your personal
        information, and object to or limit some uses. California residents have rights under the CCPA, UK residents
        under the UK GDPR, and Canadian residents under PIPEDA. To make a request, <Link href="/contact">contact us</Link>.
        We won&apos;t treat you differently for using these rights. You can also complain to your local data protection
        authority.
      </p>

      <h2>Cookies</h2>
      <p>
        We use cookies needed to keep you signed in and to keep the site secure. We don&apos;t use advertising cookies.
      </p>

      <h2>Contact</h2>
      <p>
        {site.company}, UEN {site.uen}, {site.companyAddress}. Email {site.supportEmail}.
      </p>
    </Policy>
  );
}
