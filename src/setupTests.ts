
/**
 * Test setup and configuration
 */

import '@testing-library/jest-dom';
import { performanceMonitor } from './utils/performance';

// Mock IntersectionObserver for lazy loading tests
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock ResizeObserver for responsive tests
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock PerformanceObserver for performance tests
global.PerformanceObserver = class PerformanceObserver {
  constructor() {}
  observe() {}
  disconnect() {}
};

// Mock crypto for security utilities
if (!global.crypto) {
  global.crypto = {
    getRandomValues: (arr: any) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256);
      }
      return arr;
    }
  } as any;
}

// Cleanup after each test
afterEach(() => {
  performanceMonitor.cleanup();
});

// Global test utilities
global.testUtils = {
  createMockProps: (overrides = {}) => ({
    className: 'test-class',
    'data-testid': 'test-component',
    ...overrides,
  }),
  
  createMockEvent: (overrides = {}) => ({
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
    target: { value: '' },
    ...overrides,
  }),
};
