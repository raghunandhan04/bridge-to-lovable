import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';
import Contact from '../Contact';
import { render, screen, waitFor } from '../../test/utils';

// Mock the toast hook
const mockToast = vi.fn();
vi.mock('../../hooks/use-toast', () => ({
  useToast: () => ({
    toast: mockToast
  })
}));

describe('Contact Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render contact form', () => {
    render(<Contact />);
    
    expect(screen.getByRole('heading', { name: /get in touch/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    render(<Contact />);
    
    await user.type(screen.getByLabelText(/full name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
    await user.type(screen.getByLabelText(/company/i), 'Acme Inc');
    await user.type(screen.getByLabelText(/message/i), 'Hello, this is a test message.');
    
    const submitButton = screen.getByRole('button', { name: /send message/i });
    await user.click(submitButton);
    
    expect(mockToast).toHaveBeenCalledWith({
      title: 'Message Sent!',
      description: "Thank you for contacting us. We'll get back to you within 24 hours."
    });
  });

  it('should display contact information', () => {
    render(<Contact />);
    
    expect(screen.getByText('Email Us')).toBeInTheDocument();
    expect(screen.getByText('hello@hibiz.ai')).toBeInTheDocument();
    expect(screen.getByText('Call Us')).toBeInTheDocument();
    expect(screen.getByText('+1 (555) 123-4567')).toBeInTheDocument();
    expect(screen.getByText('Visit Us')).toBeInTheDocument();
  });

  it('should show social media links', () => {
    render(<Contact />);
    
    expect(screen.getByText('Follow Us')).toBeInTheDocument();
    // Social media icons should be present
    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks.length).toBeGreaterThan(0);
  });

  it('should be accessible with proper form labels', () => {
    render(<Contact />);
    
    const nameInput = screen.getByLabelText(/full name/i);
    expect(nameInput).toHaveAttribute('type', 'text');
    expect(nameInput).toHaveAttribute('required');
    
    const emailInput = screen.getByLabelText(/email address/i);
    expect(emailInput).toHaveAttribute('type', 'email');
    expect(emailInput).toHaveAttribute('required');
    
    const messageInput = screen.getByLabelText(/message/i);
    expect(messageInput.tagName).toBe('TEXTAREA');
    expect(messageInput).toHaveAttribute('required');
  });

  it('should display CTA section', () => {
    render(<Contact />);
    
    expect(screen.getByText('Ready to Start Your AI Journey?')).toBeInTheDocument();
    expect(screen.getByText('View Pricing')).toBeInTheDocument();
    expect(screen.getByText('Enterprise Solutions')).toBeInTheDocument();
  });
});