import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useContentSections } from '../useContentSections';

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// Mock Supabase
vi.mock('../../integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    })),
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn()
      }))
    })),
    removeChannel: vi.fn()
  }
}));

describe('useContentSections Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with empty sections', () => {
    const { result } = renderHook(() => useContentSections('/'));
    
    expect(result.current.sections).toEqual([]);
    expect(typeof result.current.getSectionsByType).toBe('function');
    expect(typeof result.current.getSectionByKey).toBe('function');
    expect(typeof result.current.refetch).toBe('function');
    expect(result.current.loading).toBe(true);
  });

  it('should return sections by type', async () => {
    const mockSections = [
      { id: '1', section_key: 'test1', section_type: 'hero', title: 'Hero Section' },
      { id: '2', section_key: 'test2', section_type: 'feature', title: 'Feature Section' }
    ];
    
    const mockSupabase = await import('../../integrations/supabase/client');
    vi.mocked(mockSupabase.supabase.from).mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockSections, error: null }))
        }))
      }))
    } as any);

    const { result } = renderHook(() => useContentSections('/'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    const heroSections = result.current.getSectionsByType('hero');
    expect(heroSections).toHaveLength(1);
    expect(heroSections[0].section_type).toBe('hero');
  });

  it('should return section by key', async () => {
    const mockSections = [
      { id: '1', section_key: 'hero-main', section_type: 'hero', title: 'Main Hero' }
    ];
    
    const mockSupabase = await import('../../integrations/supabase/client');
    vi.mocked(mockSupabase.supabase.from).mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockSections, error: null }))
        }))
      }))
    } as any);

    const { result } = renderHook(() => useContentSections('/'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    const section = result.current.getSectionByKey('hero-main');
    expect(section?.section_key).toBe('hero-main');
  });

  it('should handle fetch errors gracefully', async () => {
    const mockSupabase = await import('../../integrations/supabase/client');
    vi.mocked(mockSupabase.supabase.from).mockReturnValue({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Fetch error' } }))
        }))
      }))
    } as any);

    const { result } = renderHook(() => useContentSections('/'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBe('Fetch error');
    });
  });
});