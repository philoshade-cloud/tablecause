import { notFound } from "next/navigation";
import { Suspense } from "react";
import DinnerCard from "@/components/DinnerCard";
import { Initials } from "@/components/HostBadge";
import { getHost, getHostDinners, getHostReviews } from "@/lib/data";

type Params = Promise<{ handle: string }>;

export async function generateMetadata({ params }: { params: Params }) {
  const { handle } = await params;
  const h = await getHost(handle);
  return { title: h ? h.display_name : "Host not found" };
}

async function Profile({ params }: { params: Params }) {
  const { handle } = await params;
  const host = await getHost(handle);
  if (!host) notFound();
  const [dinners, reviews] = await Promise.all([getHostDinners(host.id), getHostReviews(host.id)]);
  const upcoming = dinners.filter((d) => d.status === "open" || d.status === "confirmed");
  const past = dinners.filter((d) => d.status === "completed");
  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : null;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-12">
      {host.is_sample && (
        <p className="mb-8 rounded-lg border border-line bg-paper-2 px-4 py-3 text-sm">
          This is a sample host profile to show how profiles work.
        </p>
      )}
      <header className="grid gap-8 lg:grid-cols-[auto_1fr] items-start">
        <Initials name={host.display_name} size={112} />
        <div>
          <h1 className="text-4xl">{host.display_name}</h1>
          {host.headline && <p className="text-lg text-ink-2 mt-1">{host.headline}</p>}
          {host.bio && <p className="mt-4 max-w-[65ch]">{host.bio}</p>}
          <dl className="mt-6 grid gap-x-10 gap-y-3 sm:grid-cols-3 text-sm">
            <div>
              <dt className="text-ink-2">Identity</dt>
              <dd>{host.id_verified ? "Verified by TableCause" : "Not yet verified"}</dd>
            </div>
            <div>
              <dt className="text-ink-2">Dinners hosted</dt>
              <dd>{past.length}</dd>
            </div>
            <div>
              <dt className="text-ink-2">Guest rating</dt>
              <dd>{avg ? `${avg.toFixed(1)} out of 5 (${reviews.length})` : "No reviews yet"}</dd>
            </div>
          </dl>
          {host.linked_channels.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-ink-2 mb-2">
                Linked channels. Check that the dinner link was shared from one of these before you book.
              </p>
              <ul className="flex flex-wrap gap-2">
                {host.linked_channels.map((c) => (
                  <li key={c.label} className="rounded-full border border-line px-3 py-1 text-sm">
                    {c.label}
                    {c.verified && <span className="text-ok"> · ownership confirmed</span>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      <section className="mt-16">
        <h2 className="text-2xl mb-6">Upcoming dinners</h2>
        {upcoming.length ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((d) => <DinnerCard key={d.id} d={d} />)}
          </div>
        ) : (
          <p className="text-ink-2">No dinners scheduled right now.</p>
        )}
      </section>

      <section className="mt-16">
        <h2 className="text-2xl mb-6">Past dinners</h2>
        {past.length ? (
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((d) => <DinnerCard key={d.id} d={d} />)}
          </div>
        ) : (
          <p className="text-ink-2">This host hasn&apos;t held a dinner yet.</p>
        )}
      </section>

      <section className="mt-16">
        <h2 className="text-2xl mb-6">What guests said</h2>
        {reviews.length ? (
          <ul className="grid gap-6 sm:grid-cols-2">
            {reviews.map((r) => (
              <li key={r.id} className="border-t border-line pt-4">
                <p aria-label={`${r.rating} out of 5`}>
                  {"★".repeat(r.rating)}
                  <span className="text-line">{"★".repeat(5 - r.rating)}</span>
                </p>
                <p className="mt-1">{r.body}</p>
                <p className="text-sm text-ink-2 mt-1">{r.guest_display_name}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-ink-2">Only guests who attended can leave a review.</p>
        )}
      </section>
    </div>
  );
}

export default function Page({ params }: { params: Params }) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-4 pt-12 text-ink-2">Loading host…</div>}>
      <Profile params={params} />
    </Suspense>
  );
}
