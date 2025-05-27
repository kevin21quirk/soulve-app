
import { useEffect, useState, useCallback } from "react";

// Keyboard navigation hook
export const useKeyboardNavigation = (
  items: any[],
  onSelect: (index: number) => void
) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setActiveIndex(prev => (prev + 1) % items.length);
          break;
        case "ArrowUp":
          e.preventDefault();
          setActiveIndex(prev => (prev - 1 + items.length) % items.length);
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          if (activeIndex >= 0) {
            onSelect(activeIndex);
          }
          break;
        case "Escape":
          setActiveIndex(-1);
          break;
      }
    },
    [items.length, activeIndex, onSelect]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { activeIndex, setActiveIndex };
};

// Focus management hook
export const useFocusManagement = () => {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener("keydown", handleTabKey);
    return () => container.removeEventListener("keydown", handleTabKey);
  }, []);

  const restoreFocus = useCallback(() => {
    if (focusedElement) {
      focusedElement.focus();
      setFocusedElement(null);
    }
  }, [focusedElement]);

  const saveFocus = useCallback(() => {
    setFocusedElement(document.activeElement as HTMLElement);
  }, []);

  return { trapFocus, restoreFocus, saveFocus };
};

// Screen reader announcements
export const useScreenReader = () => {
  const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", priority);
    announcement.setAttribute("aria-atomic", "true");
    announcement.className = "sr-only";
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  return { announce };
};

// High contrast mode detection
export const useHighContrast = () => {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-contrast: high)");
    setIsHighContrast(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return isHighContrast;
};

// Reduced motion preference
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return prefersReducedMotion;
};

// ARIA live region hook
export const useLiveRegion = () => {
  const [liveRegion, setLiveRegion] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const region = document.createElement("div");
    region.setAttribute("aria-live", "polite");
    region.setAttribute("aria-atomic", "true");
    region.className = "sr-only";
    document.body.appendChild(region);
    setLiveRegion(region);

    return () => {
      if (region.parentNode) {
        region.parentNode.removeChild(region);
      }
    };
  }, []);

  const announce = useCallback((message: string) => {
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }, [liveRegion]);

  return { announce };
};
