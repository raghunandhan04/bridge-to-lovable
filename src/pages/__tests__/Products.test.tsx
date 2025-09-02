import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import Products from '@/pages/Products';

describe('Products page (smoke)', () => {
  it('renders header and at least one product card content', async () => {
    renderWithProviders(<Products />);

    expect(screen.getByRole('heading', { name: /our ai-powered products/i })).toBeInTheDocument();
    // Look for known product names text; any one validates rendering
  const candidates = await screen.findAllByText(/SmartCRM|Predictive Sales AI|ChatBot360|AI Email Optimizer|Data Intelligence Hub/i);
  expect(candidates.length).toBeGreaterThan(0);
  });
});
