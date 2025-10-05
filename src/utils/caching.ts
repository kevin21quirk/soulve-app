// Caching strategies for improved performance

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  storage?: 'memory' | 'localStorage' | 'sessionStorage';
}

class CacheManager {
  private memoryCache = new Map<string, { data: any; expires: number }>();

  set(key: string, data: any, options: CacheOptions = {}): void {
    const { ttl = 5 * 60 * 1000, storage = 'memory' } = options;
    const expires = Date.now() + ttl;
    const cacheEntry = { data, expires };

    if (storage === 'memory') {
      this.memoryCache.set(key, cacheEntry);
    } else if (storage === 'localStorage') {
      try {
        localStorage.setItem(key, JSON.stringify(cacheEntry));
      } catch (error) {
        console.error('Failed to set localStorage cache:', error);
      }
    } else if (storage === 'sessionStorage') {
      try {
        sessionStorage.setItem(key, JSON.stringify(cacheEntry));
      } catch (error) {
        console.error('Failed to set sessionStorage cache:', error);
      }
    }
  }

  get<T = any>(key: string, storage: 'memory' | 'localStorage' | 'sessionStorage' = 'memory'): T | null {
    let cacheEntry: { data: any; expires: number } | null = null;

    if (storage === 'memory') {
      cacheEntry = this.memoryCache.get(key) || null;
    } else if (storage === 'localStorage') {
      try {
        const stored = localStorage.getItem(key);
        if (stored) cacheEntry = JSON.parse(stored);
      } catch (error) {
        console.error('Failed to get localStorage cache:', error);
      }
    } else if (storage === 'sessionStorage') {
      try {
        const stored = sessionStorage.getItem(key);
        if (stored) cacheEntry = JSON.parse(stored);
      } catch (error) {
        console.error('Failed to get sessionStorage cache:', error);
      }
    }

    if (!cacheEntry) return null;

    if (Date.now() > cacheEntry.expires) {
      this.delete(key, storage);
      return null;
    }

    return cacheEntry.data as T;
  }

  delete(key: string, storage: 'memory' | 'localStorage' | 'sessionStorage' = 'memory'): void {
    if (storage === 'memory') {
      this.memoryCache.delete(key);
    } else if (storage === 'localStorage') {
      localStorage.removeItem(key);
    } else if (storage === 'sessionStorage') {
      sessionStorage.removeItem(key);
    }
  }

  clear(storage: 'memory' | 'localStorage' | 'sessionStorage' = 'memory'): void {
    if (storage === 'memory') {
      this.memoryCache.clear();
    } else if (storage === 'localStorage') {
      localStorage.clear();
    } else if (storage === 'sessionStorage') {
      sessionStorage.clear();
    }
  }

  has(key: string, storage: 'memory' | 'localStorage' | 'sessionStorage' = 'memory'): boolean {
    return this.get(key, storage) !== null;
  }
}

export const cache = new CacheManager();

// React Query cache configuration helper
export const getQueryCacheConfig = () => ({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Memoization decorator for expensive functions
export const memoize = <T extends (...args: any[]) => any>(
  fn: T,
  options: CacheOptions = {}
): T => {
  const cacheKey = fn.name || 'anonymous';
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = `${cacheKey}:${JSON.stringify(args)}`;
    const cached = cache.get<ReturnType<T>>(key, options.storage);
    
    if (cached !== null) {
      return cached;
    }
    
    const result = fn(...args);
    cache.set(key, result, options);
    return result;
  }) as T;
};
