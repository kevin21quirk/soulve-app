
import React, { createContext, useContext } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

const QueryContext = createContext<QueryClient>(queryClient);

export const useQueryClient = () => {
  const context = useContext(QueryContext);
  if (!context) {
    throw new Error('useQueryClient must be used within QueryProvider');
  }
  return context;
};

interface QueryProviderProps {
  children: React.ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <QueryContext.Provider value={queryClient}>
        {children}
      </QueryContext.Provider>
    </QueryClientProvider>
  );
};
