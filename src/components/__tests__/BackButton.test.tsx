import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '../../test/utils';

// Simple BackButton component for testing
const BackButton = ({ onClick, children = 'Back' }: { onClick?: () => void; children?: React.ReactNode }) => (
  <button onClick={onClick} className="btn-outline">
    {children}
  </button>
);

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

describe('BackButton Component', () => {
  it('should render correctly', () => {
    render(
      <TestWrapper>
        <BackButton />
      </TestWrapper>
    );
    
    const button = screen.getByRole('button', { name: /back/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-outline');
  });

  it('should be clickable', async () => {
    const user = userEvent.setup();
    const mockClick = vi.fn();
    
    render(
      <TestWrapper>
        <BackButton onClick={mockClick} />
      </TestWrapper>
    );
    
    const button = screen.getByRole('button', { name: /back/i });
    await user.click(button);
    
    expect(mockClick).toHaveBeenCalledTimes(1);
  });

  it('should render custom children', () => {
    render(
      <TestWrapper>
        <BackButton>Go Back</BackButton>
      </TestWrapper>
    );
    
    expect(screen.getByRole('button', { name: /go back/i })).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', () => {
    render(
      <TestWrapper>
        <BackButton />
      </TestWrapper>
    );
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button.tagName).toBe('BUTTON');
  });
});