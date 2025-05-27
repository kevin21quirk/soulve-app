
import { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

// Debounce hook for search inputs
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

// Throttle hook for scroll events
export const useThrottle = <T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T => {
  const [lastCall, setLastCall] = useState<number>(0);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      setLastCall(now);
      return callback(...args);
    }
  }, [callback, delay, lastCall]) as T;
};

// Intersection Observer for lazy loading
export const useLazyLoading = (
  threshold: number = 0.1,
  rootMargin: string = "50px"
) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [targetRef, setTargetRef] = useState<Element | null>(null);

  useEffect(() => {
    if (!targetRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { threshold, rootMargin }
    );

    observer.observe(targetRef);

    return () => {
      observer.disconnect();
    };
  }, [targetRef, threshold, rootMargin]);

  const ref = useCallback((node: Element | null) => {
    setTargetRef(node);
  }, []);

  return { ref, isIntersecting };
};

// Virtual scrolling for large lists
export const useVirtualList = <T>(
  items: T[],
  itemHeight: number,
  containerHeight: number
) => {
  const [scrollTop, setScrollTop] = useState(0);

  const visibleItems = useMemo(() => {
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );

    return {
      start,
      end,
      items: items.slice(start, end),
      offsetY: start * itemHeight,
      totalHeight: items.length * itemHeight,
    };
  }, [items, itemHeight, containerHeight, scrollTop]);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    visibleItems,
    onScroll,
  };
};

// Prefetch data for improved UX
export const usePrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchData = useCallback(
    (queryKey: string[], queryFn: () => Promise<any>) => {
      queryClient.prefetchQuery({
        queryKey,
        queryFn,
        staleTime: 5 * 60 * 1000, // 5 minutes
      });
    },
    [queryClient]
  );

  const prefetchOnHover = useCallback(
    (queryKey: string[], queryFn: () => Promise<any>) => {
      return {
        onMouseEnter: () => prefetchData(queryKey, queryFn),
      };
    },
    [prefetchData]
  );

  return { prefetchData, prefetchOnHover };
};

// Memory usage monitoring
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<any>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        setMemoryInfo({
          usedJSHeapSize: (performance as any).memory.usedJSHeapSize,
          totalJSHeapSize: (performance as any).memory.totalJSHeapSize,
          jsHeapSizeLimit: (performance as any).memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000);

    return () => clearInterval(interval);
  }, []);

  return memoryInfo;
};
