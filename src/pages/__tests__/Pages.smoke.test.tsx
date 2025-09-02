import { describe, test, expect, vi, beforeAll } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import Home from '@/pages/Home';
import Pricing from '@/pages/Pricing';
import Products from '@/pages/Products';
import Solutions from '@/pages/Solutions';
import Contact from '@/pages/Contact';
import Docs from '@/pages/Docs';
import Enterprise from '@/pages/Enterprise';
import NotFound from '@/pages/NotFound';

// Stub scrollTo to avoid jsdom errors
beforeAll(() => {
  // jsdom doesn't implement scrollTo; stub it for tests
  // @ts-ignore
  window.scrollTo = vi.fn();
});

describe('Home page', () => {
  test('renders hero and CTAs', () => {
    renderWithProviders(<Home />);
    expect(
      screen.getByRole('heading', { level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore solutions/i })).toBeInTheDocument();
  });
});

describe('Pricing page', () => {
  test('shows category selection cards', () => {
    renderWithProviders(<Pricing />);
    expect(screen.getByRole('heading', { name: /Find the Perfect Plan/i })).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Solutions')).toBeInTheDocument();
  });
});

describe('Products page', () => {
  test('lists fallback products', () => {
    renderWithProviders(<Products />);
    expect(screen.getByRole('heading', { name: /Our AI-Powered Products/i })).toBeInTheDocument();
    expect(screen.getByText(/SmartCRM/)).toBeInTheDocument();
    expect(screen.getByText(/Predictive Sales AI/)).toBeInTheDocument();
  });
});

describe('Solutions page', () => {
  test('renders solutions header and links', () => {
    renderWithProviders(<Solutions />);
    expect(screen.getByRole('heading', { name: /AI Solutions for Every Business/i })).toBeInTheDocument();
    // One of the nav buttons
    expect(screen.getByRole('button', { name: 'Products' })).toBeInTheDocument();
  });
});

describe('Contact page', () => {
  test('shows contact form fields', () => {
    renderWithProviders(<Contact />);
    expect(screen.getByRole('heading', { name: /Get in Touch/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Send Message/i })).toBeInTheDocument();
  });
});

describe('Docs page', () => {
  test('shows documentation title and sidebar', () => {
    renderWithProviders(<Docs />);
    expect(screen.getByRole('heading', { level: 1, name: /Documentation/i })).toBeInTheDocument();
    expect(screen.getByText('Getting Started')).toBeInTheDocument();
  });
});

describe('Enterprise page', () => {
  test('shows enterprise form and features', () => {
    renderWithProviders(<Enterprise />);
    expect(screen.getByRole('heading', { name: /Custom Solutions for Large Teams/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Name/i)).toBeInTheDocument();
  });
});

describe('NotFound page', () => {
  test('renders 404 content', () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Return to Home/i })).toBeInTheDocument();
  });
});
