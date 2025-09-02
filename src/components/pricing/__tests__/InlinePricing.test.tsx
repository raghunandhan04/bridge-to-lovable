import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/test/utils';
import { InlinePricing } from '../InlinePricing';

describe('InlinePricing', () => {
  it('returns null for unknown key', () => {
    const { container } = render(<InlinePricing itemKey="unknown-key" type="product" />);
    expect(container.firstChild).toBeNull();
  });

  it('toggles pricing section on button click', async () => {
    const user = userEvent.setup();
    render(<InlinePricing itemKey="smartcrm" type="product" />);

    // Button exists
    const toggle = screen.getByRole('button', { name: /view pricing plans/i });
    expect(toggle).toBeInTheDocument();

    // Initially collapsed
    expect(screen.queryByText(/smartcrm pricing/i)).not.toBeInTheDocument();

    // Expand
    await user.click(toggle);
    expect(await screen.findByText(/smartcrm pricing/i)).toBeInTheDocument();

    // Collapse
    await user.click(toggle);
    expect(screen.queryByText(/smartcrm pricing/i)).not.toBeInTheDocument();
  });
});
