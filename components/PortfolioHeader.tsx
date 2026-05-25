import type { PortfolioSnapshot } from "@/lib/portfolio";

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

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function PortfolioHeader({ snap }: { snap: PortfolioSnapshot }) {
  const hasFill = snap.totalValue != null;
  const pl = snap.totalPLAbs ?? 0;
  const plUp = pl >= 0;
  const plColor = plUp ? "text-up" : "text-down";
  const plBg = plUp ? "bg-up/10 border-up/20" : "bg-down/10 border-down/20";

  return (
    <header className="bg-card border border-line rounded-2xl p-5 sm:p-6 flex flex-col gap-5">

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink">
            Cartera de {snap.owner} 🚀
          </h1>
          <p className="text-xs text-muted mt-1">
            Entrada: 24 may 2026 · Actualizado: {fmtDate(snap.updatedAt)}
          </p>
        </div>
        {!hasFill && (
          <span className="text-xs bg-line text-muted rounded-full px-3 py-1 self-start">
            aún sin compra
          </span>
        )}
      </div>

      {/* Main stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        {/* Total value */}
        <div className="bg-bg rounded-xl border border-line p-4">
          <div className="text-xs text-muted uppercase tracking-wider mb-1">Valor hoy</div>
          <div className="text-3xl font-bold text-ink tabular-nums">
            {hasFill ? fmtUsd(snap.totalValue) : fmtUsd(snap.totalBudget)}
          </div>
          <div className="text-xs text-muted mt-1">
            invertiste {fmtUsd(snap.totalCost || snap.totalBudget)}
          </div>
        </div>

        {/* P&L */}
        <div className={`rounded-xl border p-4 ${hasFill ? plBg : "bg-bg border-line"}`}>
          <div className="text-xs text-muted uppercase tracking-wider mb-1">Ganancia / Pérdida</div>
          <div className={`text-3xl font-bold tabular-nums ${hasFill ? plColor : "text-muted"}`}>
            {hasFill ? fmtUsd(snap.totalPLAbs) : "—"}
          </div>
          <div className={`text-xs mt-1 font-semibold tabular-nums ${hasFill ? plColor : "text-muted"}`}>
            {hasFill ? fmtPct(snap.totalPLPct) : "tras la compra"}
          </div>
        </div>

        {/* Positions */}
        <div className="bg-bg rounded-xl border border-line p-4">
          <div className="text-xs text-muted uppercase tracking-wider mb-1">Posiciones</div>
          <div className="text-3xl font-bold text-ink">
            {snap.positions.length}
          </div>
          <div className="text-xs text-muted mt-1">acciones distintas</div>
        </div>

      </div>
    </header>
  );
}
