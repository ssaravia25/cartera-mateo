import { loadSnapshot } from "@/lib/portfolio";
import { PortfolioHeader } from "@/components/PortfolioHeader";
import { StockCard } from "@/components/StockCard";
import { WeightDonut } from "@/components/WeightDonut";

export const revalidate = 60;

export default async function Page() {
  const snap = await loadSnapshot();

  const anyError = snap.positions.some((p) => p.quote?.error);

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col gap-6">
      <PortfolioHeader snap={snap} />

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {snap.positions.map((p) => (
          <StockCard key={p.ticker} p={p} />
        ))}
      </section>

      <WeightDonut positions={snap.positions} />

      <footer className="text-xs text-muted text-center pt-4 pb-2 leading-relaxed">
        Beta · solo precio de cierre actual. Fuente: Stooq (gratis, sin clave). Esto no es asesoramiento
        financiero — es una cartera para aprender. Hecho con cariño para Mateo.
        {anyError && (
          <div className="mt-1 text-down/80">
            Algunos tickers fallaron al cargar; reintenta en unos segundos.
          </div>
        )}
      </footer>
    </main>
  );
}
