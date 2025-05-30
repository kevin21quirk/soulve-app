
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
  console.log('🚀 Starting app render...');
  console.log('📱 Platform:', Capacitor.getPlatform());
  console.log('🔧 Is native platform:', Capacitor.isNativePlatform());
  
  const rootElement = document.getElementById("root");
  if (!rootElement) {
    console.error('❌ Root element not found!');
    return;
  }
  
  console.log('✅ Root element found, creating React root...');
  
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
  
  console.log('✅ React app rendered successfully!');
};

// Initialize the app with better error handling
console.log('🎯 Initializing SouLVE app...');

if (Capacitor.isNativePlatform()) {
  console.log('📱 Running on native platform, waiting for device ready...');
  
  // Try multiple initialization methods
  let appStarted = false;
  
  const startApp = () => {
    if (!appStarted) {
      appStarted = true;
      console.log('🎉 Device ready! Starting app...');
      renderApp();
    }
  };
  
  // Method 1: Standard deviceready event
  document.addEventListener('deviceready', startApp, false);
  
  // Method 2: Capacitor ready event
  Capacitor.addListener('appStateChange', (state) => {
    console.log('📱 App state change:', state);
    if (state.isActive && !appStarted) {
      startApp();
    }
  });
  
  // Method 3: Fallback timeout (reduced to 1 second for faster loading)
  setTimeout(() => {
    if (!appStarted) {
      console.log('⏰ Fallback timeout triggered, starting app...');
      startApp();
    }
  }, 1000);
  
} else {
  console.log('🌐 Running on web platform');
  renderApp();
}
