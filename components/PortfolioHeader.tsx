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

function fmtTime(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Stat({
  label,
  value,
  sub,
  tone = "neutral",
}: {
  label: string;
  value: string;
  sub?: string;
  tone?: "neutral" | "up" | "down";
}) {
  const toneClass =
    tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-ink";
  return (
    <div className="flex flex-col">
      <span className="text-xs text-muted uppercase tracking-wider">{label}</span>
      <span className={`text-xl sm:text-2xl font-semibold tabular-nums ${toneClass}`}>
        {value}
      </span>
      {sub && <span className="text-xs text-muted tabular-nums mt-0.5">{sub}</span>}
    </div>
  );
}

export function PortfolioHeader({ snap }: { snap: PortfolioSnapshot }) {
  const hasFill = snap.totalValue != null;
  const plTone =
    snap.totalPLAbs == null ? "neutral" : snap.totalPLAbs >= 0 ? "up" : "down";

  return (
    <header className="bg-card border border-line rounded-2xl p-5 sm:p-6 flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink">
            Cartera de {snap.owner}
          </h1>
          <p className="text-sm text-muted">
            10 acciones · presupuesto {fmtUsd(snap.totalBudget)} · actualizado {fmtTime(snap.updatedAt)}
          </p>
        </div>
        {!hasFill && (
          <span className="text-xs bg-line text-muted rounded-full px-3 py-1 self-start">
            aún no se ha comprado · precios en vivo de referencia
          </span>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 sm:gap-6">
        <Stat
          label="Valor actual"
          value={hasFill ? fmtUsd(snap.totalValue) : fmtUsd(snap.totalBudget)}
          sub={hasFill ? `coste ${fmtUsd(snap.totalCost)}` : "presupuesto"}
        />
        <Stat
          label="P&L total"
          value={hasFill ? fmtUsd(snap.totalPLAbs) : "—"}
          sub={hasFill ? fmtPct(snap.totalPLPct) : "tras la compra"}
          tone={plTone}
        />
        <Stat
          label="Posiciones"
          value={`${snap.positions.length}`}
          sub="acciones"
        />
      </div>
    </header>
  );
}
