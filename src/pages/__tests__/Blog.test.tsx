import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import Blog from '../Blog';
import { render, screen, waitFor, TestWrapper } from '../../test/utils';

// Helpers to control viewport across tests
const setViewportWidth = (width: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  window.dispatchEvent(new Event('resize'));
};

describe('Blog Page Integration Tests', () => {
  const DEFAULT_WIDTH = 1024; // Desktop
  beforeEach(() => {
    setViewportWidth(DEFAULT_WIDTH);
  });
  afterEach(() => {
    setViewportWidth(DEFAULT_WIDTH);
  });

  it('should render loading state initially', () => {
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should display Categories panel on desktop', async () => {
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

  // Wait for categories to appear (allowing for async fetch)
  await screen.findByText(/Categories/i, undefined, { timeout: 5000 });
  // Expect default category labels to render (may exist in multiple places)
  expect(screen.getAllByText(/General/i).length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText(/Technology/i).length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText(/Artificial Intelligence/i).length).toBeGreaterThanOrEqual(1);
  expect(screen.getAllByText(/Business/i).length).toBeGreaterThanOrEqual(1);
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
    });
  });

  it('should load blog content when a featured article is clicked', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    // Wait for featured list and click the first article
    await waitFor(() => {
      expect(screen.getByText(/Featured Articles/i)).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole('button');
    // Click one of the featured article buttons (there are multiple buttons on the page;
    // pick the last ones which belong to featured list typically)
    await user.click(buttons[buttons.length - 1]);

    // Placeholder should disappear after selecting a blog
    await waitFor(() => {
      expect(screen.queryByText(/Select a blog to read/i)).not.toBeInTheDocument();
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
    await screen.findByText(/Categories/i);

    // Click a featured article to load content
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[buttons.length - 1]);

    await waitFor(() => {
      expect(screen.queryByText(/Select a blog to read/i)).not.toBeInTheDocument();
    });
  });

  it('should show placeholder when no blog is selected', async () => {
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Select a blog to read/i)).toBeInTheDocument();
    });
  });

  it('should be responsive on mobile devices', async () => {
    // Mock mobile viewport
    setViewportWidth(640);

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
});