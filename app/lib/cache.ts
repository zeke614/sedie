import { CACHE_MAX_AGE_MINUTES } from "./constants";

interface CachedValue<T> {
  data: T;
  timestamp: string;
}

export function readCache<T>(
  key: string,
  maxAgeMinutes: number = CACHE_MAX_AGE_MINUTES,
): T | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;

    const { data, timestamp }: CachedValue<T> = JSON.parse(raw);
    const ageInMinutes = (Date.now() - new Date(timestamp).getTime()) / 60_000;
    const isFresh = ageInMinutes < maxAgeMinutes;

    return isFresh ? data : null;
  } catch {
    // Cache is an optimization only. Corrupt JSON or blocked storage should
    // never take down the converter UI.
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore storage denial in private/restricted browser modes.
    }
    return null;
  }
}

export function writeCache<T>(key: string, data: T): void {
  try {
    const entry: CachedValue<T> = { data, timestamp: new Date().toISOString() };
    localStorage.setItem(key, JSON.stringify(entry));
  } catch {
    // Best-effort cache writes can fail on quota or privacy settings.
  }
}
