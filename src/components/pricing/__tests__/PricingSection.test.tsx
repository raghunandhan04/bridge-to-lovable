import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/test/utils';
import { PricingSection } from '../PricingSection';
import { productPricing } from '@/data/pricingData';

describe('PricingSection', () => {
  const pricingData = productPricing['smartcrm'];

  it('renders plan cards and default annual pricing', () => {
    render(<PricingSection pricingData={pricingData} />);
    // Heading
    expect(screen.getByText(/smartcrm pricing/i)).toBeInTheDocument();
    // Plans present
    expect(screen.getByText(/starter/i)).toBeInTheDocument();
    expect(screen.getByText(/professional/i)).toBeInTheDocument();
    expect(screen.getByText(/enterprise/i)).toBeInTheDocument();
  // Annual badge and per-card notes may both say Save 20%; ensure at least one is present
  expect(screen.getAllByText(/save 20%/i).length).toBeGreaterThan(0);
  });

  it('toggles to monthly pricing with switch', async () => {
    const user = userEvent.setup();
    render(<PricingSection pricingData={pricingData} />);
    // Switch from annual (default) to monthly
    const switchEl = screen.getByRole('switch');
    await user.click(switchEl);
    // Badge disappears in monthly mode
    expect(screen.queryByText(/save 20%/i)).not.toBeInTheDocument();
  });

  it('shows correct CTA text based on plan type', () => {
    render(<PricingSection pricingData={pricingData} />);
    // Starter and Professional have prices -> Get Started
    const ctas = screen.getAllByRole('button');
    expect(ctas.some(b => /get started/i.test(b.textContent || ''))).toBe(true);
    // Enterprise is custom -> Contact Sales
    expect(ctas.some(b => /contact sales/i.test(b.textContent || ''))).toBe(true);
  });
});
