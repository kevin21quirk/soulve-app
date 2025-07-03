
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface RateLimitConfig {
  maxAttempts: number;
  windowMinutes: number;
  storageKey: string;
}

interface RateLimitState {
  isLimited: boolean;
  remainingAttempts: number;
  resetTime: Date | null;
}

export const useRateLimit = (config: RateLimitConfig): RateLimitState => {
  const { user } = useAuth();
  const [state, setState] = useState<RateLimitState>({
    isLimited: false,
    remainingAttempts: config.maxAttempts,
    resetTime: null
  });

  const storageKey = `rateLimit_${config.storageKey}_${user?.id || 'anonymous'}`;

  const checkRateLimit = () => {
    if (!user) return;

    const stored = localStorage.getItem(storageKey);
    if (!stored) {
      setState({
        isLimited: false,
        remainingAttempts: config.maxAttempts,
        resetTime: null
      });
      return;
    }

    const { attempts, windowStart } = JSON.parse(stored);
    const windowStartTime = new Date(windowStart);
    const now = new Date();
    const windowEnd = new Date(windowStartTime.getTime() + config.windowMinutes * 60 * 1000);

    // Reset if window has expired
    if (now > windowEnd) {
      localStorage.removeItem(storageKey);
      setState({
        isLimited: false,
        remainingAttempts: config.maxAttempts,
        resetTime: null
      });
      return;
    }

    // Check if rate limited
    const remaining = Math.max(0, config.maxAttempts - attempts.length);
    const isLimited = remaining === 0;

    setState({
      isLimited,
      remainingAttempts: remaining,
      resetTime: isLimited ? windowEnd : null
    });
  };

  const recordAttempt = () => {
    if (!user) return false;

    const now = new Date();
    const stored = localStorage.getItem(storageKey);
    
    let attempts = [];
    let windowStart = now;

    if (stored) {
      const parsed = JSON.parse(stored);
      attempts = parsed.attempts || [];
      windowStart = new Date(parsed.windowStart);
      
      // Remove attempts outside current window
      const windowEnd = new Date(windowStart.getTime() + config.windowMinutes * 60 * 1000);
      if (now > windowEnd) {
        attempts = [];
        windowStart = now;
      }
    }

    // Check if adding this attempt would exceed limit
    if (attempts.length >= config.maxAttempts) {
      checkRateLimit();
      return false;
    }

    // Record the attempt
    attempts.push(now.toISOString());
    localStorage.setItem(storageKey, JSON.stringify({
      attempts,
      windowStart: windowStart.toISOString()
    }));

    checkRateLimit();
    return true;
  };

  useEffect(() => {
    checkRateLimit();
    
    // Check every minute for expired windows
    const interval = setInterval(checkRateLimit, 60000);
    return () => clearInterval(interval);
  }, [user?.id, config.maxAttempts, config.windowMinutes]);

  return {
    ...state,
    recordAttempt
  } as RateLimitState & { recordAttempt: () => boolean };
};

// Specific rate limit hooks for common operations
export const usePostCreationRateLimit = () => {
  return useRateLimit({
    maxAttempts: 5,
    windowMinutes: 15,
    storageKey: 'postCreation'
  });
};

export const useReportRateLimit = () => {
  return useRateLimit({
    maxAttempts: 3,
    windowMinutes: 60,
    storageKey: 'reporting'
  });
};
