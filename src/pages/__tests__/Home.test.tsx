import { describe, it, expect, vi } from 'vitest';
import Home from '../Home';
import { render, screen, waitFor } from '../../test/utils';

// Mock the useContentSections hook
vi.mock('../../hooks/useContentSections', () => ({
  useContentSections: () => ({
    sections: [],
    loading: false,
    error: null,
    getSectionsByType: vi.fn(() => []),
    getSectionByKey: vi.fn(() => undefined),
    refetch: vi.fn()
  })
}));

describe('Home Page', () => {
  it('should render hero section with rotating slogans', async () => {
    render(<Home />);
    
    // Wait for hero content to load
    await waitFor(() => {
      const heroHeading = screen.getByRole('heading', { level: 1 });
      expect(heroHeading).toBeInTheDocument();
    });
    
    // Check for one of the rotating slogans
    const slogans = [
      'Transforming Business with AI Innovation',
      'Automate, Analyze, Accelerate Growth',
      'Your Partner in Digital Transformation',
      'AI Solutions for Modern Enterprises'
    ];
    
    const foundSlogan = slogans.some(slogan => 
      screen.queryByText(slogan) !== null
    );
    expect(foundSlogan).toBe(true);
  });

  it('should display call-to-action buttons', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Get Started')).toBeInTheDocument();
      expect(screen.getByText('Explore Solutions')).toBeInTheDocument();
    });
  });

  it('should show features section', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Why Choose Hibiz.ai?')).toBeInTheDocument();
      expect(screen.getByText('AI Automation')).toBeInTheDocument();
      expect(screen.getByText('Cloud Solutions')).toBeInTheDocument();
      expect(screen.getByText('Advanced Analytics')).toBeInTheDocument();
      expect(screen.getByText('Machine Learning')).toBeInTheDocument();
    });
  });

  it('should display stats section', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('500+')).toBeInTheDocument();
      expect(screen.getByText('Enterprise Clients')).toBeInTheDocument();
      expect(screen.getByText('99.9%')).toBeInTheDocument();
      expect(screen.getByText('Uptime Guarantee')).toBeInTheDocument();
    });
  });

  it('should have proper page structure with headings', async () => {
    render(<Home />);
    
    await waitFor(() => {
      const headings = screen.getAllByRole('heading');
      expect(headings.length).toBeGreaterThan(0);
      
      // Should have an h1 for SEO
      const h1 = screen.getByRole('heading', { level: 1 });
      expect(h1).toBeInTheDocument();
    });
  });

  it('should render CTA section', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Ready to Transform Your Business?')).toBeInTheDocument();
      expect(screen.getByText('Start Your AI Journey')).toBeInTheDocument();
      expect(screen.getByText('View Pricing')).toBeInTheDocument();
    });
  });
});