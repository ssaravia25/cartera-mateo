export type Quote = {
  ticker: string;
  price: number | null;
  asOf: string | null; // "YYYY-MM-DD HH:MM" (UTC, as reported by Stooq)
  error?: string;
};

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

// Stooq mapping: NASDAQ/NYSE tickers go with `.us` suffix.
function stooqSymbol(ticker: string): string {
  return `${ticker.toLowerCase()}.us`;
}

async function fetchOne(ticker: string): Promise<Quote> {
  const sym = stooqSymbol(ticker);
  const url = `https://stooq.com/q/l/?s=${sym}&f=sd2t2ohlcv&h&e=csv`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA, Accept: "text/csv,text/plain,*/*" },
      next: { revalidate: 60 },
    });
    if (!res.ok) return { ticker, price: null, asOf: null, error: `HTTP ${res.status}` };

    const csv = (await res.text()).trim();
    const lines = csv.split(/\r?\n/);
    if (lines.length < 2) return { ticker, price: null, asOf: null, error: "empty csv" };

    // header: Symbol,Date,Time,Open,High,Low,Close,Volume
    const cells = lines[1].split(",");
    const date = cells[1];
    const time = cells[2];
    const close = parseFloat(cells[6]);

    if (!Number.isFinite(close) || date === "N/D") {
      return { ticker, price: null, asOf: null, error: "no quote" };
    }

    return {
      ticker,
      price: close,
      asOf: `${date} ${time ?? ""}`.trim(),
    };
  } catch (e) {
    return {
      ticker,
      price: null,
      asOf: null,
      error: e instanceof Error ? e.message : "fetch error",
    };
  }
}

export async function fetchQuotes(tickers: string[]): Promise<Record<string, Quote>> {
  // Stooq es generoso con paralelo — 10 tickers en una sola tanda.
  const results = await Promise.all(tickers.map(fetchOne));
  return Object.fromEntries(results.map((q) => [q.ticker, q]));
}
