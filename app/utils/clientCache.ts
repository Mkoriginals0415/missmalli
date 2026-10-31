// Lightweight Stale-While-Revalidate Client-Side Memory & Session Cache for Miss Malli
// Zero dependencies - Pure Native Web APIs

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const MEMORY_CACHE = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes fresh window

/**
 * Retrieve cached data from memory or sessionStorage
 */
export function getClientCache<T>(key: string): T | null {
  if (typeof window === "undefined") return null;

  // 1. Check in-memory Map
  const inMem = MEMORY_CACHE.get(key);
  if (inMem) {
    if (Date.now() - inMem.timestamp < CACHE_TTL_MS) {
      return inMem.data;
    }
  }

  // 2. Fallback to sessionStorage
  try {
    const raw = sessionStorage.getItem(`mm_cache_${key}`);
    if (raw) {
      const parsed: CacheEntry<T> = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        MEMORY_CACHE.set(key, parsed);
        return parsed.data;
      }
    }
  } catch (e) {
    // SessionStorage unavailable or full
  }

  return null;
}

/**
 * Save data to client cache
 */
export function setClientCache<T>(key: string, data: T) {
  if (typeof window === "undefined" || !data) return;

  const entry: CacheEntry<T> = { data, timestamp: Date.now() };
  MEMORY_CACHE.set(key, entry);

  try {
    sessionStorage.setItem(`mm_cache_${key}`, JSON.stringify(entry));
  } catch (e) {
    // Handle quota errors silently
  }
}

/**
 * Invalidate client cache (called when admin updates products/settings)
 */
export function invalidateClientCache() {
  if (typeof window === "undefined") return;

  MEMORY_CACHE.clear();

  try {
    const keysToRemove: string[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const k = sessionStorage.key(i);
      if (k && k.startsWith("mm_cache_")) {
        keysToRemove.push(k);
      }
    }
    keysToRemove.forEach((k) => sessionStorage.removeItem(k));
  } catch (e) {}
}
