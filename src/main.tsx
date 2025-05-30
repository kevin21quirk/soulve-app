
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/AuthContext'
import { ErrorProvider } from '@/contexts/ErrorContext'
import ErrorBoundary from '@/components/ui/error-boundary'
import { Capacitor } from '@capacitor/core'
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

const renderApp = () => {
  createRoot(document.getElementById("root")!).render(
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
};

// Initialize the app
if (Capacitor.isNativePlatform()) {
  // Wait for the device to be ready on native platforms
  document.addEventListener('deviceready', renderApp, false);
  
  // Fallback timeout in case deviceready doesn't fire
  setTimeout(renderApp, 2000);
} else {
  // Render immediately on web
  renderApp();
}
