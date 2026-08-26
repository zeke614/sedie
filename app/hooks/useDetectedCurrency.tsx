"use client";

import { useEffect } from "react";
import countriesData from "@/app/lib/data";
import { CACHE_KEYS } from "@/app/lib/constants";
import { readCache, writeCache } from "@/app/lib/cache";

type Currency = (typeof countriesData.currencies)[number];

export function useDetectedCurrency(setCurrency: (currency: Currency) => void) {
  useEffect(() => {
    const controller = new AbortController();

    async function detect() {
      const cached = readCache<Currency>(CACHE_KEYS.userCurrency);
      if (cached) {
        setCurrency(cached);
        return;
      }

      try {
        const res = await fetch("/api/geo", { signal: controller.signal });
        if (!res.ok) throw new Error("Geo fetch failed");

        const data = await res.json();
        const countryCode = data.country?.toUpperCase();

        const currency = resolveCurrencyFromCountry(countryCode);
        if (!controller.signal.aborted && currency) {
          setCurrency(currency);
          writeCache(CACHE_KEYS.userCurrency, currency);
        }
      } catch {
        // Silently fall back to the default currency set in App state (GBP)
      }
    }

    detect();

    return () => {
      // Abort the geo lookup if this component unmounts before IPInfo responds.
      controller.abort();
    };
  }, [setCurrency]);
}

function resolveCurrencyFromCountry(
  countryCode?: string,
): Currency | undefined {
  if (!countryCode) return undefined;

  if (countriesData.euroZone.includes(countryCode)) {
    return countriesData.currencies.find((c) => c.code === "EUR");
  }

  return countriesData.currencies.find(
    (c) => c.flag.toUpperCase() === countryCode,
  );
}
