import type { EnrichedPosition } from "@/lib/portfolio";

function fmtUsd(n: number | null) {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(n);
}

function fmtPct(n: number | null) {
  if (n == null || Number.isNaN(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

export function StockCard({ p }: { p: EnrichedPosition }) {
  const plUp = (p.plAbs ?? 0) >= 0;
  const priceLoaded = p.quote?.price != null;

  return (
    <article className="bg-card hover:bg-cardHover transition-colors border border-line rounded-2xl p-5 flex flex-col gap-3">
      <header className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-3xl leading-none" aria-hidden>
            {p.emoji}
          </span>
          <div className="min-w-0">
            <div className="text-ink font-semibold truncate">{p.name}</div>
            <div className="text-xs text-muted tracking-wider">{p.ticker}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-ink font-semibold tabular-nums text-lg">
            {fmtUsd(p.quote?.price ?? null)}
          </div>
          <div className="text-[10px] text-muted uppercase tracking-wider">
            {priceLoaded ? "precio actual" : p.quote?.error ?? "sin datos"}
          </div>
        </div>
      </header>

      <dl className="grid grid-cols-3 gap-2 text-xs border-t border-line pt-3">
        <div className="flex flex-col">
          <dt className="text-muted">Peso</dt>
          <dd className="text-ink font-medium tabular-nums">
            {p.weightPct != null ? `${p.weightPct.toFixed(1)}%` : "—"}
          </dd>
        </div>
        <div className="flex flex-col">
          <dt className="text-muted">Valor</dt>
          <dd className="text-ink font-medium tabular-nums">
            {p.hasFill ? fmtUsd(p.marketValue) : "sin compra"}
          </dd>
        </div>
        <div className="flex flex-col">
          <dt className="text-muted">P&amp;L</dt>
          <dd className={`font-medium tabular-nums ${plUp ? "text-up" : "text-down"}`}>
            {p.hasFill ? `${fmtUsd(p.plAbs)} (${fmtPct(p.plPct)})` : "—"}
          </dd>
        </div>
      </dl>

      <p className="text-xs text-muted leading-relaxed border-t border-line pt-3">
        {p.why}
      </p>
    </article>
  );
}
