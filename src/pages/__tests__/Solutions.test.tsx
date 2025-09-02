import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import Solutions from '@/pages/Solutions';

describe('Solutions page (smoke)', () => {
  it('renders header and category sections', async () => {
    renderWithProviders(<Solutions />);

    expect(screen.getByRole('heading', { name: /ai solutions for every business/i })).toBeInTheDocument();
    // Ensure some industry/use case text appears
  const categories = await screen.findAllByText(/Retail & E-commerce|Healthcare|Logistics & Supply Chain|Financial Services|Marketing Automation|Sales Enhancement/i);
  expect(categories.length).toBeGreaterThan(0);
  });
});
