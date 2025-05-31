
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
  
  try {
    const rootElement = document.getElementById("root");
    if (!rootElement) {
      console.error('❌ Root element not found!');
      // Create root element if it doesn't exist (mobile fallback)
      const newRoot = document.createElement('div');
      newRoot.id = 'root';
      document.body.appendChild(newRoot);
      console.log('✅ Created new root element');
    }
    
    console.log('✅ Root element found, creating React root...');
    
    const finalRootElement = document.getElementById("root")!;
    createRoot(finalRootElement).render(
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
  } catch (error) {
    console.error('❌ Error rendering app:', error);
    // Fallback: show basic error message
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center; font-family: Arial, sans-serif;">
        <h1>SouLVE</h1>
        <p>App is loading...</p>
        <p style="color: red; font-size: 12px;">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    `;
  }
};

// Initialize the app with better error handling
console.log('🎯 Initializing SouLVE app...');

if (Capacitor.isNativePlatform()) {
  console.log('📱 Running on native platform, waiting for device ready...');
  
  // Simple mobile initialization
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
  
  // Method 2: Simple timeout fallback for quick loading
  setTimeout(() => {
    if (!appStarted) {
      console.log('⏰ Timeout triggered, starting app...');
      startApp();
    }
  }, 500); // Reduced timeout for faster mobile loading
  
} else {
  console.log('🌐 Running on web platform');
  renderApp();
}
