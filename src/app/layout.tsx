import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { site } from "@/lib/site";
import "./globals.css";

// Young Serif and Instrument Sans, both SIL Open Font License, self-hosted.
const serif = localFont({
  src: "../fonts/young-serif-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-young-serif",
});
const sans = localFont({
  src: [
    { path: "../fonts/instrument-sans-latin-wght-normal.woff2", style: "normal", weight: "400 700" },
    { path: "../fonts/instrument-sans-latin-wght-italic.woff2", style: "italic", weight: "400 700" },
  ],
  variable: "--font-instrument-sans",
});

export const metadata: Metadata = {
  title: { default: "TableCause: small dinners for the things people care about", template: "%s | TableCause" },
  description:
    "Hosts open a seat at their table to raise money for a project or cause. Guests book a seat and are only charged after the dinner happens as promised.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="min-h-dvh flex flex-col">
        <div className="bg-ink text-paper text-sm">
          <p className="mx-auto max-w-6xl px-4 py-2">
            Preview site. Dinners and hosts shown are samples, and bookings run in test mode. No real cards are
            charged.
          </p>
        </div>
        <header className="border-b border-line">
          <nav className="mx-auto max-w-6xl px-4 h-16 flex items-center gap-4 sm:gap-6 whitespace-nowrap text-sm sm:text-base" aria-label="Main">
            <Link href="/" className="font-serif text-xl sm:text-2xl mr-auto">
              TableCause
            </Link>
            <Link href="/explore" className="hover:text-wine">
              Find a dinner
            </Link>
            <Link href="/how-it-works" className="hover:text-wine hidden sm:inline">
              How it works
            </Link>
            <Link
              href="/host"
              className="rounded-full border border-ink px-3 sm:px-4 py-1.5 hover:bg-ink hover:text-paper transition-colors"
            >
              Host a dinner
            </Link>
          </nav>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-line mt-24">
          <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 sm:grid-cols-3 text-sm">
            <div>
              <p className="font-serif text-xl mb-2">TableCause</p>
              <p className="text-ink-2 max-w-xs">
                Small dinners where guests support what the host is building. Live in the United States, the United
                Kingdom and Canada.
              </p>
            </div>
            <ul className="space-y-2">
              <li><Link href="/explore" className="hover:text-wine">Find a dinner</Link></li>
              <li><Link href="/host" className="hover:text-wine">Host a dinner</Link></li>
              <li><Link href="/how-it-works" className="hover:text-wine">How it works</Link></li>
              <li><Link href="/contact" className="hover:text-wine">Contact us</Link></li>
            </ul>
            <ul className="space-y-2">
              <li><Link href="/legal/terms" className="hover:text-wine">Terms of service</Link></li>
              <li><Link href="/legal/privacy" className="hover:text-wine">Privacy policy</Link></li>
              <li><Link href="/legal/refunds" className="hover:text-wine">Payments, cancellations and refunds</Link></li>
              <li><Link href="/legal/prohibited" className="hover:text-wine">What can&apos;t be hosted</Link></li>
              <li><Link href="/legal/host-agreement" className="hover:text-wine">Host agreement</Link></li>
            </ul>
          </div>
          <div className="mx-auto max-w-6xl px-4 pb-10 text-xs text-ink-2">
            TableCause is operated by {site.company} (UEN {site.uen}), {site.companyAddress}. Payments are processed by
            a licensed payment provider. Contributions are not tax-deductible donations.
          </div>
        </footer>
      </body>
    </html>
  );
}
