import '@testing-library/jest-dom/vitest';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { testServer } from './testServer';
import { supabase } from '@/integrations/supabase/client';

// Establish API mocking before all tests
beforeAll(() => testServer.listen({ onUnhandledRequest: 'error' }));

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => testServer.resetHandlers());

// Clean up after the tests are finished
afterAll(() => testServer.close());

// Mock IntersectionObserver for components that use it
global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() { return []; }
} as any;

// Mock ResizeObserver for components that use it
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Polyfill hasPointerCapture for JSDOM (some Radix primitives call it)
if (typeof (Element.prototype as any).hasPointerCapture !== 'function') {
  (Element.prototype as any).hasPointerCapture = function () { return false; };
}

// Polyfill scrollIntoView used by some UI primitives
if (typeof (Element.prototype as any).scrollIntoView !== 'function') {
  (Element.prototype as any).scrollIntoView = function () { /* no-op for tests */ };
}

// Ensure global.window exists in all test contexts
if (typeof (global as any).window === 'undefined') {
  (global as any).window = global;
}

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Stub Supabase realtime channel to avoid network calls in tests
// The hook useContentSections subscribes to realtime updates; we replace it with no-op
try {
  const mockChannel = {
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnValue({
      unsubscribe: vi.fn(),
      state: 'SUBSCRIBED',
    }),
  } as any;

  if (supabase && (supabase as any).channel) {
    vi.spyOn(supabase as any, 'channel').mockImplementation(() => mockChannel);
    // Also mock removeChannel
    if ((supabase as any).removeChannel) {
      vi.spyOn(supabase as any, 'removeChannel').mockImplementation(() => ({ status: 'ok' }));
    } else {
      (supabase as any).removeChannel = vi.fn();
    }
  }
} catch (e) {
  // Ignore if supabase import shape changes; tests can proceed
}