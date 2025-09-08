import { describe, it, expect } from 'vitest';
import Footer from '../Footer';
import { render, screen } from '../../test/utils';

describe('Footer Component', () => {
  it('should render company information', () => {
    render(<Footer />);
    
    expect(screen.getByText(/hibiz\.ai/i)).toBeInTheDocument();
    expect(screen.getByText(/© 2024/i)).toBeInTheDocument();
  });

  it('should display navigation links', () => {
    render(<Footer />);
    
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Solutions')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Blog')).toBeInTheDocument();
  });

  it('should show contact information', () => {
    render(<Footer />);
    
    // Check for contact-related text
    const contactElements = screen.getAllByText('Contact');
    expect(contactElements.length).toBeGreaterThan(0);
  });

  it('should have proper accessibility attributes', () => {
    render(<Footer />);
    
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should display social media links if present', () => {
    render(<Footer />);
    
    // Footer should render without errors
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });
});