import type { EnrichedPosition } from "@/lib/portfolio";

function fmtUsd(n: number | null, decimals = 2) {
  if (n == null || Number.isNaN(n)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(n);
}

function fmtPct(n: number | null) {
  if (n == null || Number.isNaN(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(2)}%`;
}

export function StockCard({ p }: { p: EnrichedPosition }) {
  const up = (p.plAbs ?? 0) >= 0;
  const priceLoaded = p.quote?.price != null;
  const plColor = up ? "text-up" : "text-down";
  const plBg = up ? "bg-up/10" : "bg-down/10";
  const plBorder = up ? "border-up/20" : "border-down/20";

  return (
    <article className="bg-card hover:bg-cardHover transition-colors border border-line rounded-2xl p-5 flex flex-col gap-4">

      {/* Header: emoji + name + ticker */}
      <header className="flex items-center gap-3 min-w-0">
        <span className="text-3xl leading-none shrink-0" aria-hidden>{p.emoji}</span>
        <div className="min-w-0">
          <div className="text-ink font-semibold truncate leading-tight">{p.name}</div>
          <div className="text-[11px] text-muted tracking-widest font-medium">{p.ticker}</div>
        </div>
      </header>

      {/* Price section */}
      <div className="flex items-end justify-between gap-2">
        <div>
          <div className="text-[11px] text-muted mb-0.5">Ahora</div>
          <div className="text-xl font-bold text-ink tabular-nums">
            {priceLoaded ? fmtUsd(p.quote.price) : <span className="text-muted text-sm">sin datos</span>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px] text-muted mb-0.5">Compraste a</div>
          <div className="text-sm font-semibold text-muted tabular-nums">
            {fmtUsd(p.buyPrice)}
          </div>
        </div>
      </div>

      {/* P&L badge — protagonista */}
      <div className={`rounded-xl border px-3 py-2.5 flex items-start justify-between gap-2 ${plBg} ${plBorder}`}>
        <span className="text-xs text-muted leading-snug pt-0.5">Ganancia /<br />Pérdida</span>
        <div className="text-right shrink-0">
          <div className={`text-base font-bold tabular-nums ${plColor}`}>
            {fmtUsd(p.plAbs)}
          </div>
          <div className={`text-xs font-semibold tabular-nums ${plColor}`}>
            {fmtPct(p.plPct)}
          </div>
        </div>
      </div>

      {/* Meta: weight + market value */}
      <dl className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="text-muted">Peso en cartera</dt>
          <dd className="text-ink font-medium tabular-nums">
            {p.weightPct != null ? `${p.weightPct.toFixed(1)}%` : "—"}
          </dd>
        </div>
        <div className="text-right">
          <dt className="text-muted">Valor actual</dt>
          <dd className="text-ink font-medium tabular-nums">{fmtUsd(p.marketValue)}</dd>
        </div>
      </dl>

      {/* Educational description */}
      <p className="text-[11px] text-muted leading-relaxed border-t border-line pt-3">
        {p.why}
      </p>
    </article>
  );
}
