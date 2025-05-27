
/**
 * Testing utilities and helpers
 */

import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { AppStateProvider } from '@/contexts/AppStateContext';
import { ErrorProvider } from '@/contexts/ErrorContext';

/**
 * Custom render function with providers
 */
export const renderWithProviders = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <ErrorProvider>
      <AppStateProvider>
        {children}
      </AppStateProvider>
    </ErrorProvider>
  );

  return render(ui, { wrapper: Wrapper, ...options });
};

/**
 * Mock data generators for testing
 */
export const mockGenerators = {
  user: (overrides = {}) => ({
    id: '1',
    name: 'Test User',
    email: 'test@example.com',
    avatar: '/placeholder.svg',
    trustScore: 85,
    ...overrides,
  }),

  post: (overrides = {}) => ({
    id: '1',
    title: 'Test Post',
    content: 'This is a test post content',
    author: 'Test User',
    category: 'general',
    timestamp: new Date().toISOString(),
    likes: 0,
    responses: 0,
    ...overrides,
  }),

  notification: (overrides = {}) => ({
    id: '1',
    type: 'info' as const,
    title: 'Test Notification',
    message: 'This is a test notification',
    timestamp: new Date().toISOString(),
    read: false,
    ...overrides,
  }),
};

/**
 * Test utilities for async operations
 */
export const testUtils = {
  /**
   * Wait for a condition to be true
   */
  waitFor: async (condition: () => boolean, timeout = 5000): Promise<void> => {
    const start = Date.now();
    while (!condition() && Date.now() - start < timeout) {
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    if (!condition()) {
      throw new Error('Condition not met within timeout');
    }
  },

  /**
   * Mock console methods
   */
  mockConsole: () => {
    const originalConsole = { ...console };
    const mockMethods = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      info: jest.fn(),
    };
    
    Object.assign(console, mockMethods);
    
    return {
      ...mockMethods,
      restore: () => Object.assign(console, originalConsole),
    };
  },

  /**
   * Create a mock function with tracking
   */
  createMockFunction: <T extends (...args: any[]) => any>(
    implementation?: T
  ) => {
    const calls: Parameters<T>[] = [];
    const fn = jest.fn((...args: Parameters<T>) => {
      calls.push(args);
      return implementation?.(...args);
    });
    
    return Object.assign(fn, { calls });
  },
};

/**
 * Performance testing utilities
 */
export const performanceTests = {
  /**
   * Measure render time of a component
   */
  measureRenderTime: async (renderFn: () => void): Promise<number> => {
    const start = performance.now();
    renderFn();
    await new Promise(resolve => setTimeout(resolve, 0));
    return performance.now() - start;
  },

  /**
   * Test memory usage
   */
  measureMemoryUsage: (): number => {
    if ('memory' in performance) {
      return (performance as any).memory.usedJSHeapSize;
    }
    return 0;
  },
};
