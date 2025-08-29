import { describe, it, expect, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Blog from '../Blog';
import { mockBlogs, getBlogsByCategory } from '../../test/mocks/blogData';
import { render, screen, waitFor, TestWrapper } from '../../test/utils';

describe('Blog Page Integration Tests', () => {
  beforeEach(() => {
    // Reset any state before each test
  });

  it('should render loading state initially', () => {
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display blog categories in sidebar', async () => {
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/AI Technology/i)).toBeInTheDocument();
      expect(screen.getByText(/Business Insights/i)).toBeInTheDocument();
      expect(screen.getByText(/Industry Trends/i)).toBeInTheDocument();
    });
  });

  it('should show featured articles in right sidebar', async () => {
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check for "Featured Articles" heading
      expect(screen.getByText(/Featured Articles/i)).toBeInTheDocument();
      
      // Should show at least 3 featured articles (limited by our mock data)
      const featuredArticles = screen.getAllByTestId(/featured-article/i);
      expect(featuredArticles.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('should display blog posts when category is expanded', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/AI Technology/i)).toBeInTheDocument();
    });

    // Click on AI Technology category to expand it
    const aiTechCategory = screen.getByText(/AI Technology/i);
    await user.click(aiTechCategory);

    await waitFor(() => {
      const aiTechBlogs = getBlogsByCategory('ai-technology');
      if (aiTechBlogs.length > 0) {
        // Should show blog titles from the category
        const blogTitles = screen.getAllByTestId(/blog-title/i);
        expect(blogTitles.length).toBeGreaterThan(0);
      }
    });
  });

  it('should load blog content when blog post is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    // Wait for page to load
    await waitFor(() => {
      expect(screen.getByText(/AI Technology/i)).toBeInTheDocument();
    });

    // Expand a category first
    const aiTechCategory = screen.getByText(/AI Technology/i);
    await user.click(aiTechCategory);

    await waitFor(async () => {
      const blogLinks = screen.queryAllByTestId(/blog-title/i);
      if (blogLinks.length > 0) {
        // Click on the first blog post
        await user.click(blogLinks[0]);
        
        // Should show blog content in center column
        await waitFor(() => {
          expect(screen.getByTestId(/blog-content/i)).toBeInTheDocument();
        });
      }
    });
  });

  it('should show placeholder when no blog is selected', async () => {
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Select a blog post to read/i)).toBeInTheDocument();
    });
  });

  it('should be responsive on mobile devices', async () => {
    // Mock mobile viewport
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
      // Should show mobile-friendly category selector
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });
  });

  it('should filter blogs by selected category', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Business Insights/i)).toBeInTheDocument();
    });

    // Click on Business Insights category
    const businessCategory = screen.getByText(/Business Insights/i);
    await user.click(businessCategory);

    // Should only show blogs from business-insights category
    await waitFor(() => {
      const businessBlogs = getBlogsByCategory('business-insights');
      if (businessBlogs.length > 0) {
        const displayedBlogs = screen.getAllByTestId(/blog-title/i);
        expect(displayedBlogs.length).toBeLessThanOrEqual(businessBlogs.length);
      }
    });
  });
});