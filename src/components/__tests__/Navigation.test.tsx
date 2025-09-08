import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import Navigation from '../Navigation';
import { render, screen } from '../../test/utils';

describe('Navigation Component', () => {
  it('should render navigation with logo', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Hibiz.ai')).toBeInTheDocument();
  });

  it('should display product and solution dropdowns', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Solutions')).toBeInTheDocument();
  });

  it('should render navigation links correctly', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Blog')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('Docs')).toBeInTheDocument();
  });

  it('should display mobile menu button', () => {
    render(<Navigation />);
    
    const mobileMenuButton = screen.getByRole('button', { name: /toggle menu/i });
    expect(mobileMenuButton).toBeInTheDocument();
  });

  it('should show enterprise quote button', () => {
    render(<Navigation />);
    
    expect(screen.getByText('Enterprise Quote')).toBeInTheDocument();
  });

  it('should be accessible with proper navigation structure', () => {
    render(<Navigation />);
    
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });
});