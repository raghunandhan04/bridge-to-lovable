import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { Textarea } from '../textarea';
import { render, screen } from '../../../test/utils';

describe('Textarea Component', () => {
  it('should render textarea with default props', () => {
    render(<Textarea placeholder="Enter message" />);
    const textarea = screen.getByPlaceholderText('Enter message');
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('should handle user input correctly', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    
    render(<Textarea placeholder="Type message" onChange={mockOnChange} />);
    const textarea = screen.getByPlaceholderText('Type message');
    
    await user.type(textarea, 'This is a multiline\nmessage');
    expect(mockOnChange).toHaveBeenCalled();
    expect(textarea).toHaveValue('This is a multiline\nmessage');
  });

  it('should be disabled when disabled prop is true', () => {
    render(<Textarea disabled placeholder="Disabled textarea" />);
    const textarea = screen.getByPlaceholderText('Disabled textarea');
    expect(textarea).toBeDisabled();
  });

  it('should apply custom className', () => {
    render(<Textarea className="custom-textarea-class" data-testid="custom-textarea" />);
    const textarea = screen.getByTestId('custom-textarea');
    expect(textarea).toHaveClass('custom-textarea-class');
  });

  it('should set custom rows', () => {
    render(<Textarea rows={10} data-testid="tall-textarea" />);
    const textarea = screen.getByTestId('tall-textarea');
    expect(textarea).toHaveAttribute('rows', '10');
  });

  it('should forward ref correctly', () => {
    const ref = vi.fn();
    render(<Textarea ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('should handle resize behavior', () => {
    render(<Textarea className="resize-none" data-testid="no-resize-textarea" />);
    const textarea = screen.getByTestId('no-resize-textarea');
    expect(textarea).toHaveClass('resize-none');
  });

  it('should handle focus and blur events', async () => {
    const user = userEvent.setup();
    const mockOnFocus = vi.fn();
    const mockOnBlur = vi.fn();
    
    render(
      <Textarea 
        placeholder="Focus test" 
        onFocus={mockOnFocus} 
        onBlur={mockOnBlur} 
      />
    );
    
    const textarea = screen.getByPlaceholderText('Focus test');
    
    await user.click(textarea);
    expect(mockOnFocus).toHaveBeenCalled();
    
    await user.tab();
    expect(mockOnBlur).toHaveBeenCalled();
  });
});