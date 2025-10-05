import * as Sentry from "@sentry/react";

/**
 * Initialize Sentry for error tracking and performance monitoring
 * Call this once at app startup
 */
export const initMonitoring = () => {
  const SENTRY_DSN = ""; // Add your Sentry DSN here after creating a project
  
  if (!SENTRY_DSN) {
    console.warn("Sentry DSN not configured. Error tracking disabled.");
    return;
  }

  Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [
      new Sentry.BrowserTracing({
        tracePropagationTargets: [
          "localhost",
          "bf52b470-070e-4c4a-ac1a-978a0d3d9af7.lovableproject.com",
          /^/,
        ],
      }),
      new Sentry.Replay({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: 0.1, // Capture 10% of transactions for performance monitoring
    replaysSessionSampleRate: 0.1, // Sample 10% of sessions
    replaysOnErrorSampleRate: 1.0, // Capture all sessions with errors
    environment: window.location.hostname.includes("localhost") ? "development" : "production",
    beforeSend(event, hint) {
      // Filter out certain errors
      const error = hint.originalException;
      if (error && typeof error === "object" && "message" in error) {
        const message = String(error.message);
        // Don't send network errors
        if (message.includes("NetworkError") || message.includes("Failed to fetch")) {
          return null;
        }
      }
      return event;
    },
  });
};

/**
 * Log an error to Sentry
 */
export const logError = (error: Error, context?: Record<string, any>) => {
  console.error("Error logged:", error, context);
  Sentry.captureException(error, {
    contexts: context ? { custom: context } : undefined,
  });
};

/**
 * Log a message to Sentry
 */
export const logMessage = (message: string, level: "info" | "warning" | "error" = "info", context?: Record<string, any>) => {
  console.log(`[${level.toUpperCase()}] ${message}`, context);
  Sentry.captureMessage(message, {
    level,
    contexts: context ? { custom: context } : undefined,
  });
};

/**
 * Set user context for error tracking
 */
export const setUserContext = (userId: string, email?: string, username?: string) => {
  Sentry.setUser({
    id: userId,
    email,
    username,
  });
};

/**
 * Clear user context (on logout)
 */
export const clearUserContext = () => {
  Sentry.setUser(null);
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (message: string, category: string, data?: Record<string, any>) => {
  Sentry.addBreadcrumb({
    message,
    category,
    data,
    level: "info",
  });
};

/**
 * Start a performance transaction
 */
export const startTransaction = (name: string, op: string) => {
  console.log(`[Performance] Transaction started: ${name} (${op})`);
  return { name, op };
};

/**
 * Performance monitoring utility
 */
export class PerformanceMonitor {
  private startTime: number;
  private name: string;

  constructor(name: string) {
    this.name = name;
    this.startTime = performance.now();
  }

  end(metadata?: Record<string, any>) {
    const duration = performance.now() - this.startTime;
    console.log(`[Performance] ${this.name}: ${duration.toFixed(2)}ms`, metadata);
    
    // Log slow operations
    if (duration > 1000) {
      logMessage(
        `Slow operation detected: ${this.name} took ${duration.toFixed(2)}ms`,
        "warning",
        { ...metadata, duration }
      );
    }
    
    return duration;
  }
}

/**
 * Measure async function performance
 */
export const measureAsync = async <T>(
  name: string,
  fn: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> => {
  const monitor = new PerformanceMonitor(name);
  try {
    const result = await fn();
    monitor.end({ ...metadata, success: true });
    return result;
  } catch (error) {
    monitor.end({ ...metadata, success: false, error: String(error) });
    throw error;
  }
};

/**
 * Database query performance tracker
 */
export class QueryMonitor {
  private static queries: Array<{
    name: string;
    duration: number;
    timestamp: number;
  }> = [];

  static track(name: string, duration: number) {
    this.queries.push({
      name,
      duration,
      timestamp: Date.now(),
    });

    // Keep only last 100 queries
    if (this.queries.length > 100) {
      this.queries.shift();
    }

    // Log slow queries
    if (duration > 2000) {
      logMessage(
        `Slow database query: ${name} took ${duration.toFixed(2)}ms`,
        "warning",
        { name, duration }
      );
    }
  }

  static getStats() {
    if (this.queries.length === 0) {
      return {
        count: 0,
        avgDuration: 0,
        slowestQuery: null,
      };
    }

    const totalDuration = this.queries.reduce((sum, q) => sum + q.duration, 0);
    const slowest = this.queries.reduce((prev, current) =>
      current.duration > prev.duration ? current : prev
    );

    return {
      count: this.queries.length,
      avgDuration: totalDuration / this.queries.length,
      slowestQuery: slowest,
    };
  }

  static clear() {
    this.queries = [];
  }
}

/**
 * API request monitoring
 */
export const monitorApiRequest = async <T>(
  endpoint: string,
  request: () => Promise<T>
): Promise<T> => {
  const monitor = new PerformanceMonitor(`API: ${endpoint}`);
  addBreadcrumb(`API Request`, "api", { endpoint });

  try {
    const result = await request();
    monitor.end({ endpoint, success: true });
    return result;
  } catch (error) {
    monitor.end({ endpoint, success: false, error: String(error) });
    logError(error as Error, { endpoint });
    throw error;
  }
};

/**
 * Component render monitoring (for React)
 */
export const usePerformanceMonitor = (componentName: string) => {
  const renderStart = performance.now();

  return () => {
    const renderTime = performance.now() - renderStart;
    if (renderTime > 100) {
      console.warn(`Slow render: ${componentName} took ${renderTime.toFixed(2)}ms`);
    }
  };
};
