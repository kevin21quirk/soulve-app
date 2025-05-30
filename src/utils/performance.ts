import { useEffect, useState } from "react";

// Performance tracking utility
export const usePerformanceTracker = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      console.info(`Performance Metric - ${componentName}_render: ${renderTime.toFixed(2)}ms`);
    };
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
