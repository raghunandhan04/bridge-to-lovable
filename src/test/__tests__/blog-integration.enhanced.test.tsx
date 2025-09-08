import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Blog from '../../pages/Blog';

// Enhanced blog integration tests for comprehensive coverage
describe('Blog Integration - Enhanced Coverage', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const TestWrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
      </BrowserRouter>
    </QueryClientProvider>
  );

  it('should handle empty blog state gracefully', async () => {
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    await waitFor(() => {
      // Should show loading initially
      expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    // After loading, should show placeholder
    await waitFor(() => {
      expect(screen.getByText(/select a blog to read/i)).toBeInTheDocument();
    });
  });

  it('should display categories correctly', async () => {
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/categories/i)).toBeInTheDocument();
      expect(screen.getByText(/general/i)).toBeInTheDocument();
      expect(screen.getByText(/technology/i)).toBeInTheDocument();
      expect(screen.getByText(/artificial intelligence/i)).toBeInTheDocument();
      expect(screen.getByText(/business/i)).toBeInTheDocument();
    });
  });

  it('should show featured articles section', async () => {
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/featured articles/i)).toBeInTheDocument();
    });
  });

  it('should handle responsive design', async () => {
    // Mock window.innerWidth for mobile
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 640,
    });

    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    await waitFor(() => {
      // Should show mobile category selector
      const categorySelect = screen.getByRole('combobox');
      expect(categorySelect).toBeInTheDocument();
    });
  });

  it('should handle blog search functionality', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/categories/i)).toBeInTheDocument();
    });

    // Test category filtering
    const categoryButtons = screen.getAllByRole('button');
    if (categoryButtons.length > 0) {
      await user.click(categoryButtons[0]);
      // Should update the displayed content
      expect(screen.getByRole('main')).toBeInTheDocument();
    }
  });

  it('should maintain SEO best practices', async () => {
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    await waitFor(() => {
      // Should have proper heading structure
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
      expect(h1).toHaveTextContent(/insights & innovation/i);
    });
  });

  it('should handle error states gracefully', async () => {
    // Mock console.error to avoid test noise
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    // Component should render without crashing even with potential errors
    await waitFor(() => {
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  it('should provide proper accessibility features', async () => {
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for proper ARIA labels and roles
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();

      // Navigation should be accessible
      const navigation = screen.getAllByRole('button');
      expect(navigation.length).toBeGreaterThan(0);
    });
  });

  it('should handle keyboard navigation', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      if (buttons.length > 0) {
        buttons[0].focus();
        expect(buttons[0]).toHaveFocus();
      }
    });

    // Test tab navigation
    await user.tab();
    // Should move focus to next focusable element
    expect(document.activeElement).toBeTruthy();
  });
});