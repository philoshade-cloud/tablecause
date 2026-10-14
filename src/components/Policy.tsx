import Link from "next/link";
import { site } from "@/lib/site";

const pages = [
  { href: "/legal/terms", label: "Terms of service" },
  { href: "/legal/privacy", label: "Privacy policy" },
  { href: "/legal/refunds", label: "Payments, cancellations and refunds" },
  { href: "/legal/prohibited", label: "What can't be hosted" },
  { href: "/legal/host-agreement", label: "Host agreement" },
];

export default function Policy({ title, intro, children }: { title: string; intro: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-12 grid gap-12 lg:grid-cols-[14rem_1fr]">
      <nav aria-label="Policies" className="text-sm lg:sticky lg:top-6 self-start">
        <ul className="space-y-2">
          {pages.map((p) => (
            <li key={p.href}>
              <Link href={p.href} className="hover:text-wine">{p.label}</Link>
            </li>
          ))}
        </ul>
      </nav>
      <article className="prose-policy">
        <h1 className="text-4xl">{title}</h1>
        <p className="text-ink-2 mt-2">Last updated {site.policiesUpdated}</p>
        <p className="text-lg mt-6">{intro}</p>
        {children}
      </article>
    </div>
  );
}
