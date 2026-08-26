import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";
import countriesData from "@/app/lib/data";

// Past (closed) days are immutable — OER's historical data for a date
// that's already ended doesn't change. Only "today" is still live and
// could shift as the day progresses, so it gets a real revalidate
// window instead of a long one.

const TODAY_REVALIDATE_SECONDS = 3600;

const PAST_DAY_REVALIDATE_SECONDS = 60 * 60 * 24 * 30; // forever for a closed day, without touching revalidate:false (which needs manual invalidation to ever clear)

const CURRENCY_CODES = new Set(countriesData.currencies.map((c) => c.code));

function isPastDay(date: string): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return date < today;
}

function isValidHistoryDate(date: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;

  const parsed = new Date(`${date}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return false;

  const normalized = parsed.toISOString().slice(0, 10);

  return normalized === date && date <= new Date().toISOString().slice(0, 10);
}

async function fetchHistoricalRates(date: string, base: string) {
  const appId = process.env.OPEN_EXCHANGE_RATES_APP_ID;
  if (!appId) {
    throw new Error("OPEN_EXCHANGE_RATES_APP_ID is not set");
  }

  // Fetch and cache the whole day's table once. Filtering by target here would
  // create a separate OER request for every target currency/date combination.
  const url = `https://openexchangerates.org/api/historical/${date}.json?app_id=${appId}&base=${base}`;
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Open Exchange Rates returned status: ${res.status}`);
  }

  return res.json() as Promise<{ rates: Record<string, number> }>;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date");
  const base = searchParams.get("base");
  const target = searchParams.get("target");

  if (!date || !base || !target) {
    return NextResponse.json(
      { error: "Missing required parameters (date, base, target)" },
      { status: 400 },
    );
  }

  if (
    !isValidHistoryDate(date) ||
    base !== "USD" ||
    !CURRENCY_CODES.has(target)
  ) {
    return NextResponse.json(
      { error: "Invalid required parameters (date, base, target)" },
      { status: 400 },
    );
  }

  // Cache key carries date/base so each historical day gets one upstream fetch.
  // Built inline per request (not at module scope like getCachedRates)
  // because the revalidate window itself depends on date — that's fine,
  // unstable_cache just resolves to the existing cache slot by key.
  const getCached = unstable_cache(
    () => fetchHistoricalRates(date, base),
    ["history", date, base],
    {
      revalidate: isPastDay(date)
        ? PAST_DAY_REVALIDATE_SECONDS
        : TODAY_REVALIDATE_SECONDS,
    },
  );

  try {
    const data = await getCached();
    const rate = data.rates[target];

    if (typeof rate !== "number") {
      return NextResponse.json(
        { error: "Requested target currency is unavailable" },
        { status: 404 },
      );
    }

    return NextResponse.json({ rates: { [target]: rate } });
  } catch (error) {
    console.error("History API Proxy Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch historical rates" },
      { status: 502 },
    );
  }
}
