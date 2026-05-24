import type { EnrichedPosition } from "@/lib/portfolio";

const PALETTE = [
  "#60a5fa", "#f472b6", "#34d399", "#fbbf24", "#a78bfa",
  "#fb7185", "#22d3ee", "#facc15", "#4ade80", "#f97316",
];

type Slice = {
  label: string;
  value: number;
  color: string;
};

export function WeightDonut({ positions }: { positions: EnrichedPosition[] }) {
  const slices: Slice[] = positions.map((p, i) => ({
    label: `${p.ticker}`,
    value: Math.max(0, p.weightPct ?? 0),
    color: PALETTE[i % PALETTE.length],
  }));

  const total = slices.reduce((acc, s) => acc + s.value, 0) || 1;
  const size = 220;
  const stroke = 28;
  const radius = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  let offset = 0;
  const segments = slices.map((s, i) => {
    const fraction = s.value / total;
    const length = fraction * circumference;
    const seg = (
      <circle
        key={i}
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke={s.color}
        strokeWidth={stroke}
        strokeDasharray={`${length} ${circumference - length}`}
        strokeDashoffset={-offset}
        transform={`rotate(-90 ${cx} ${cy})`}
      />
    );
    offset += length;
    return seg;
  });

  return (
    <section className="bg-card border border-line rounded-2xl p-5">
      <h2 className="text-ink font-semibold mb-4">Reparto de la cartera</h2>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <svg width={size} height={size} className="shrink-0">
          <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#1f2a44" strokeWidth={stroke} />
          {segments}
        </svg>
        <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs w-full">
          {slices.map((s, i) => (
            <li key={i} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 min-w-0">
                <span
                  className="inline-block w-2.5 h-2.5 rounded-sm shrink-0"
                  style={{ backgroundColor: s.color }}
                />
                <span className="text-ink truncate">{s.label}</span>
              </span>
              <span className="text-muted tabular-nums">{s.value.toFixed(1)}%</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
