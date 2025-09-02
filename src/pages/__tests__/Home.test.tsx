import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import Home from '@/pages/Home';

describe('Home page (smoke)', () => {
  it('renders hero slogan and CTAs', async () => {
    renderWithProviders(<Home />);

    // Slogan rotates, so just assert one of the known slogans appears eventually
    const anySlogan = await screen.findByText(/AI Solutions for Modern Enterprises|Automate, Analyze, Accelerate Growth|Transforming Business with AI Innovation|Your Partner in Digital Transformation/i);
    expect(anySlogan).toBeInTheDocument();

    // Primary CTAs
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /explore solutions/i })).toBeInTheDocument();
  });
});
