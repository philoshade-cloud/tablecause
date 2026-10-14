import type { Metadata } from "next";
import { Suspense } from "react";
import { site } from "@/lib/site";
import ContactForm from "./ContactForm";

export const metadata: Metadata = { title: "Contact us" };

type SP = Promise<{ [k: string]: string | string[] | undefined }>;

async function Form({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const s = (v: unknown) => (typeof v === "string" ? v : undefined);
  return <ContactForm topic={s(sp.topic)} dinner={s(sp.dinner)} />;
}

export default function Contact({ searchParams }: { searchParams: SP }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 grid gap-12 lg:grid-cols-[1fr_1.4fr]">
      <div>
        <h1 className="text-4xl">Contact us</h1>
        <p className="text-ink-2 mt-3 max-w-md">
          Questions about a booking, hosting, or a listing that doesn&apos;t look right. We reply within two business
          days.
        </p>
        <dl className="mt-8 space-y-4 text-sm">
          <div>
            <dt className="text-ink-2">Email</dt>
            <dd>{site.supportEmail}</dd>
          </div>
          <div>
            <dt className="text-ink-2">Company</dt>
            <dd>
              {site.company}
              <br />
              UEN {site.uen}
              <br />
              {site.companyAddress}
            </dd>
          </div>
        </dl>
      </div>
      <Suspense fallback={null}>
        <Form searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
