
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { HelmetProvider } from 'react-helmet-async';
import * as Sentry from "@sentry/react";
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import { ErrorProvider } from '@/contexts/ErrorContext'
import ErrorBoundary from '@/components/ui/error-boundary'
import App from './App.tsx'
import './index.css'

// Initialize Sentry for error tracking
// Set VITE_SENTRY_DSN in your environment or Supabase secrets
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
      // Filter out non-critical errors
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <ErrorBoundary>
    <HelmetProvider>
      <HashRouter>
        <QueryClientProvider client={queryClient}>
          <ErrorProvider>
            <AuthProvider>
              <App />
              <Toaster />
            </AuthProvider>
          </ErrorProvider>
        </QueryClientProvider>
      </HashRouter>
    </HelmetProvider>
  </ErrorBoundary>
);
