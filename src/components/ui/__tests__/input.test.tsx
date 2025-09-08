import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Input } from '../input';
import { render, screen } from '../../../test/utils';

describe('Input Component', () => {
  it('should render input with default props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass('flex');
  });

  it('should handle different input types', () => {
    const { rerender } = render(<Input type="email" data-testid="email-input" />);
    expect(screen.getByTestId('email-input')).toHaveAttribute('type', 'email');

    rerender(<Input type="password" data-testid="password-input" />);
    expect(screen.getByTestId('password-input')).toHaveAttribute('type', 'password');

    rerender(<Input type="number" data-testid="number-input" />);
    expect(screen.getByTestId('number-input')).toHaveAttribute('type', 'number');
  });

  it('should handle user input correctly', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    
    render(<Input placeholder="Type here" onChange={mockOnChange} />);
    const input = screen.getByPlaceholderText('Type here');
    
    await user.type(input, 'Hello World');
    expect(mockOnChange).toHaveBeenCalled();
    expect(input).toHaveValue('Hello World');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText('Disabled input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('disabled:cursor-not-allowed');
  });

  it('should apply custom className', () => {
    render(<Input className="custom-input-class" data-testid="custom-input" />);
    const input = screen.getByTestId('custom-input');
    expect(input).toHaveClass('custom-input-class');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<Input ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('should handle focus and blur events', async () => {
    const user = userEvent.setup();
    const mockOnFocus = vi.fn();
    const mockOnBlur = vi.fn();
    
    render(
      <Input 
        placeholder="Focus test" 
        onFocus={mockOnFocus} 
        onBlur={mockOnBlur} 
      />
    );
    
    const input = screen.getByPlaceholderText('Focus test');
    
    await user.click(input);
    expect(mockOnFocus).toHaveBeenCalled();
    
    await user.tab();
    expect(mockOnBlur).toHaveBeenCalled();
  });
});