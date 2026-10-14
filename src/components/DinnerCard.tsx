import Image from "next/image";
import Link from "next/link";
import { clock, money, shortDate } from "@/lib/format";
import type { DinnerWithHost } from "@/lib/types";
import SeatRing from "./SeatRing";

export default function DinnerCard({ d }: { d: DinnerWithHost }) {
  const open = d.capacity - d.seats_taken;
  return (
    <Link href={`/d/${d.short_code}`} className="group block">
      <article className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-3 border-t border-line pt-5">
        <div className="col-span-2 relative aspect-[16/9] overflow-hidden rounded-lg bg-paper-2">
          {d.image_url && (
            <Image
              src={d.image_url}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
            />
          )}
          {d.is_sample && (
            <span className="absolute left-3 top-3 rounded-full bg-paper/90 px-2.5 py-0.5 text-xs text-ink">Sample</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-ink-2">
            {shortDate(d.starts_at, d.timezone)}, {clock(d.starts_at, d.timezone)} · {d.neighborhood ?? d.city}, {d.city}
          </p>
          <h3 className="text-xl mt-1 group-hover:text-wine">{d.title}</h3>
          <p className="text-sm text-ink-2 mt-1">Hosted by {d.host.display_name}</p>
          <p className="text-sm mt-2">
            From <span className="font-medium">{money(d.min_contribution, d.currency)}</span> a seat ·{" "}
            {open > 0 ? `${open} open` : "Full"}
          </p>
        </div>
        <SeatRing capacity={d.capacity} taken={d.seats_taken} size={76} />
      </article>
    </Link>
  );
}
