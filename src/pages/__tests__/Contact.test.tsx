import { describe, it, expect } from 'vitest';
import { renderWithProviders, screen } from '@/test/utils';
import Contact from '@/pages/Contact';

describe('Contact page (smoke)', () => {
  it('renders header and form fields', async () => {
    renderWithProviders(<Contact />);

    expect(screen.getByRole('heading', { name: /get in touch/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send message/i })).toBeInTheDocument();
  });
});
