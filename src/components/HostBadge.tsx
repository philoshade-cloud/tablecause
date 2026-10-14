import Link from "next/link";
import type { Host } from "@/lib/types";

export function Initials({ name, size = 48 }: { name: string; size?: number }) {
  const ini = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");
  return (
    <span
      aria-hidden
      className="inline-flex items-center justify-center rounded-full bg-sage text-ink font-serif shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {ini}
    </span>
  );
}

export default function HostBadge({ host }: { host: Host }) {
  return (
    <Link href={`/h/${host.handle}`} className="group flex items-center gap-3">
      <Initials name={host.display_name} />
      <span>
        <span className="block group-hover:text-wine">{host.display_name}</span>
        <span className="block text-sm text-ink-2">
          {host.id_verified ? "Identity verified" : "Identity not yet verified"}
          {host.linked_channels.length > 0 && ` · ${host.linked_channels.length} linked ${host.linked_channels.length === 1 ? "channel" : "channels"}`}
        </span>
      </span>
    </Link>
  );
}
