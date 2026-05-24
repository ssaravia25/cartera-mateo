import portfolioJson from "@/data/portfolio.json";
import { fetchQuotes, type Quote } from "@/lib/yahoo";

export type Position = {
  ticker: string;
  name: string;
  shares: number;
  buyPrice: number;
  buyDate: string;
  emoji: string;
  why: string;
};

export type PortfolioConfig = {
  owner: string;
  currency: string;
  totalBudget: number;
  positions: Position[];
};

export type EnrichedPosition = Position & {
  quote: Quote;
  marketValue: number | null;
  costBasis: number;
  plAbs: number | null;
  plPct: number | null;
  weightPct: number | null;
  hasFill: boolean;
};

export type PortfolioSnapshot = {
  owner: string;
  currency: string;
  totalBudget: number;
  totalCost: number;
  totalValue: number | null;
  totalPLAbs: number | null;
  totalPLPct: number | null;
  positions: EnrichedPosition[];
  updatedAt: string;
};

export function loadConfig(): PortfolioConfig {
  return portfolioJson as PortfolioConfig;
}

export async function loadSnapshot(): Promise<PortfolioSnapshot> {
  const cfg = loadConfig();
  const tickers = cfg.positions.map((p) => p.ticker);
  const quotes = await fetchQuotes(tickers);

  const enriched: EnrichedPosition[] = cfg.positions.map((p) => {
    const quote = quotes[p.ticker];
    const hasFill = p.shares > 0 && p.buyPrice > 0;
    const price = quote?.price ?? null;

    const marketValue =
      hasFill && price != null ? p.shares * price : null;

    const costBasis = p.shares * p.buyPrice;
    const plAbs = hasFill && price != null ? p.shares * (price - p.buyPrice) : null;
    const plPct =
      hasFill && price != null && p.buyPrice > 0
        ? ((price - p.buyPrice) / p.buyPrice) * 100
        : null;

    return {
      ...p,
      quote,
      marketValue,
      costBasis,
      plAbs,
      plPct,
      weightPct: null,
      hasFill,
    };
  });

  const anyFilled = enriched.some((p) => p.hasFill);
  const totalCost = enriched.reduce((acc, p) => acc + p.costBasis, 0);
  const totalValue = anyFilled
    ? enriched.reduce(
        (acc, p) => acc + (p.hasFill && p.marketValue != null ? p.marketValue : 0),
        0,
      )
    : null;

  enriched.forEach((p) => {
    if (anyFilled) {
      p.weightPct =
        p.hasFill && p.marketValue != null && totalValue && totalValue > 0
          ? (p.marketValue / totalValue) * 100
          : 0;
    } else {
      // Pre-compra: asumimos $100 por posición (presupuesto $1000 / 10) → pesos iguales.
      p.weightPct = 100 / enriched.length;
    }
  });

  const totalPLAbs = totalValue != null ? totalValue - totalCost : null;
  const totalPLPct =
    totalPLAbs != null && totalCost > 0 ? (totalPLAbs / totalCost) * 100 : null;

  return {
    owner: cfg.owner,
    currency: cfg.currency,
    totalBudget: cfg.totalBudget,
    totalCost,
    totalValue,
    totalPLAbs,
    totalPLPct,
    positions: enriched,
    updatedAt: new Date().toISOString(),
  };
}
