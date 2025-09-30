
import { useEffect, useState } from "react";

// Performance tracking utility (disabled in production)
export const usePerformanceTracker = (componentName: string) => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      const startTime = performance.now();
      return () => {
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        if (renderTime > 100) {
          console.warn(`Slow render - ${componentName}: ${renderTime.toFixed(2)}ms`);
        }
      };
    }
  }, [componentName]);
};

// Debounce utility for search and filters
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Performance monitor for testing
export const performanceMonitor = {
  cleanup: () => {
    // Cleanup function for tests
  }
};
