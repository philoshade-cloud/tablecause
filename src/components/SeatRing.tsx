type Props = {
  capacity: number;
  taken: number;
  goSeats?: number | null; // guests needed for the dinner to go ahead
  size?: number;
  animate?: boolean;
  label?: string;
};

// The table, seen from above. Filled chairs are booked, outlined chairs are open.
// Chairs up to the go threshold carry a small mark so guests can see how close the dinner is to happening.
export default function SeatRing({ capacity, taken, goSeats, size = 220, animate = false, label }: Props) {
  const c = size / 2;
  const tableR = size * 0.27;
  const seatR = Math.max(2.5, Math.min(13, (Math.PI * 2 * size * 0.4) / capacity / 2.8));
  const ringR = size * 0.4;
  const seats = Array.from({ length: capacity }, (_, i) => {
    const a = (i / capacity) * Math.PI * 2 - Math.PI / 2;
    return { x: c + ringR * Math.cos(a), y: c + ringR * Math.sin(a), i };
  });
  const open = Math.max(0, capacity - taken);
  const aria =
    label ?? `${taken} of ${capacity} seats booked, ${open} open${goSeats ? `. Goes ahead at ${goSeats} guests` : ""}`;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={aria} className="max-w-full h-auto">
      <circle cx={c} cy={c} r={tableR} fill="var(--paper-2)" stroke="var(--line)" strokeWidth={1.5} />
      <text
        x={c}
        y={c - 2}
        textAnchor="middle"
        style={{ fontFamily: "var(--font-young-serif)", fontSize: size * 0.13 }}
        fill="var(--ink)"
      >
        {taken}/{capacity}
      </text>
      {size >= 120 && (
        <text x={c} y={c + size * 0.085} textAnchor="middle" style={{ fontSize: size * 0.055 }} fill="var(--ink-2)">
          seats taken
        </text>
      )}
      {seats.map((s) => {
        const booked = s.i < taken;
        const inGo = goSeats != null && s.i < goSeats;
        return (
          <g key={s.i}>
            <circle
              cx={s.x}
              cy={s.y}
              r={seatR}
              className={animate && booked ? "seat-in" : undefined}
              style={animate && booked ? { animationDelay: `${120 + s.i * 45}ms` } : undefined}
              fill={booked ? "var(--wine)" : "var(--paper)"}
              stroke={booked ? "var(--wine)" : "var(--ink-2)"}
              strokeWidth={1.5}
            />
            {inGo && !booked && <circle cx={s.x} cy={s.y} r={seatR * 0.32} fill="var(--candle)" />}
          </g>
        );
      })}
    </svg>
  );
}
