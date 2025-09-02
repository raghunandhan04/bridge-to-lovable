import { describe, test, expect } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import userEvent from '@testing-library/user-event';
import Navigation from '@/components/Navigation';

describe('Navigation', () => {
  test('renders logo and primary links', () => {
    renderWithProviders(<Navigation />);
    expect(screen.getByText('Hibiz.ai')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Pricing' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact Us' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enterprise Quote' })).toBeInTheDocument();
  });

  test('toggles mobile menu', async () => {
    renderWithProviders(<Navigation />);
    const user = userEvent.setup();
    const toggle = screen.getByRole('button', { name: /toggle menu/i });
    await user.click(toggle);
    // Mobile menu renders additional links like "View All Products"
    expect(screen.getByRole('link', { name: /View All Products/i })).toBeInTheDocument();
  });
});
