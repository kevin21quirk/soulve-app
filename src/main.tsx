import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from "@sentry/react";
import ReactGA from 'react-ga4';
import { Toaster } from '@/components/ui/toaster'
import { createOptimizedQueryClient } from '@/utils/queryConfig';
import App from './App.tsx'
import './index.css'

// Initialize Sentry for error tracking
const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;

if (SENTRY_DSN && import.meta.env.PROD) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    beforeSend(event, hint) {
      if (event.exception) {
        const error = hint.originalException;
        if (error instanceof Error && error.message.includes('Network request failed')) {
          return null;
        }
      }
      return event;
    },
  });
}

// Initialize Google Analytics 4
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID;

if (GA4_MEASUREMENT_ID) {
  ReactGA.initialize(GA4_MEASUREMENT_ID, {
    gaOptions: {
      siteSpeedSampleRate: 100,
    },
  });
}

const queryClient = createOptimizedQueryClient();

// Hide the initial loading spinner once React mounts
const hideInitialLoader = () => {
  const loader = document.getElementById('initial-loader');
  if (loader) {
    loader.style.opacity = '0';
    setTimeout(() => loader.remove(), 300);
  }
};

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <HelmetProvider>
    <HashRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster />
      </QueryClientProvider>
    </HashRouter>
  </HelmetProvider>
);

// Remove loader after React renders
hideInitialLoader();

// Preload critical routes during browser idle time for faster navigation
const preloadCriticalRoutes = () => {
  const routes = [
    () => import('@/pages/Index'),
    () => import('@/pages/Dashboard'),
    () => import('@/pages/Auth'),
  ];
  
  routes.forEach(route => route().catch(() => {}));
};

// Use requestIdleCallback for Safari compatibility
if ('requestIdleCallback' in window) {
  requestIdleCallback(() => preloadCriticalRoutes(), { timeout: 3000 });
} else {
  setTimeout(preloadCriticalRoutes, 200);
}
