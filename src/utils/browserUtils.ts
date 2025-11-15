/**
 * Cross-browser compatible requestIdleCallback polyfill
 * Falls back to setTimeout for browsers that don't support it (Safari, iOS)
 */
export const requestIdleCallbackPolyfill = (callback: IdleRequestCallback): number => {
  const win = typeof window !== 'undefined' ? window : null;
  
  if (win && 'requestIdleCallback' in win) {
    return win.requestIdleCallback(callback);
  }
  
  // Fallback for Safari and older browsers
  if (win) {
    return win.setTimeout(() => {
      const start = Date.now();
      callback({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, 1) as unknown as number;
  }
  
  return 0;
};

/**
 * Cross-browser compatible cancelIdleCallback polyfill
 */
export const cancelIdleCallbackPolyfill = (id: number): void => {
  const win = typeof window !== 'undefined' ? window : null;
  
  if (win && 'cancelIdleCallback' in win) {
    win.cancelIdleCallback(id);
  } else if (win) {
    win.clearTimeout(id);
  }
};
