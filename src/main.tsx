
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import { ErrorProvider } from '@/contexts/ErrorContext'
import ErrorBoundary from '@/components/ui/error-boundary'
import App from './App.tsx'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

console.log('🚀 Starting SouLVE app...');

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <ErrorBoundary>
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
  </ErrorBoundary>
);

console.log('✅ SouLVE app rendered');
