import { describe, test, expect, vi } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import Layout from '@/components/Layout';
import Footer from '@/components/Footer';

describe('Layout', () => {
  test('renders Navigation, children, and Footer', () => {
    renderWithProviders(
      <Layout>
        <div>Child Content</div>
      </Layout>
    );
    // Logo text appears in both Nav and Footer; ensure at least one
    expect(screen.getAllByText('Hibiz.ai').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Child Content')).toBeInTheDocument();
    // Footer quick link sample
    expect(screen.getByRole('link', { name: 'Documentation' })).toBeInTheDocument();
  });
});

describe('Footer', () => {
  test('shows company and quick links', () => {
    renderWithProviders(<Footer />);
    expect(screen.getByText('Hibiz.ai')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Products' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Solutions' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pricing' })).toBeInTheDocument();
  });
});
