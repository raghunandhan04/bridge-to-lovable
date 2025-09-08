import { describe, it, expect } from 'vitest';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../card';
import { render, screen } from '../../../test/utils';

describe('Card Components', () => {
  it('should render Card component correctly', () => {
    render(
      <Card data-testid="card">
        <CardContent>Card content</CardContent>
      </Card>
    );
    
    const card = screen.getByTestId('card');
    expect(card).toBeInTheDocument();
    expect(card).toHaveClass('rounded-lg', 'border');
  });

  it('should render CardHeader with title and description', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card description</CardDescription>
        </CardHeader>
      </Card>
    );
    
    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card description')).toBeInTheDocument();
  });

  it('should render CardContent with custom content', () => {
    render(
      <Card>
        <CardContent>
          <p>Custom card content</p>
        </CardContent>
      </Card>
    );
    
    expect(screen.getByText('Custom card content')).toBeInTheDocument();
  });

  it('should render CardFooter with actions', () => {
    render(
      <Card>
        <CardFooter>
          <button>Action Button</button>
        </CardFooter>
      </Card>
    );
    
    expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
  });

  it('should apply custom className to Card', () => {
    render(
      <Card className="custom-card-class" data-testid="custom-card">
        <CardContent>Content</CardContent>
      </Card>
    );
    
    const card = screen.getByTestId('custom-card');
    expect(card).toHaveClass('custom-card-class');
  });

  it('should render complete card structure', () => {
    render(
      <Card data-testid="complete-card">
        <CardHeader>
          <CardTitle>Complete Card</CardTitle>
          <CardDescription>This is a complete card example</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main card content goes here</p>
        </CardContent>
        <CardFooter>
          <button>Primary Action</button>
          <button>Secondary Action</button>
        </CardFooter>
      </Card>
    );
    
    expect(screen.getByText('Complete Card')).toBeInTheDocument();
    expect(screen.getByText('This is a complete card example')).toBeInTheDocument();
    expect(screen.getByText('Main card content goes here')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Primary Action' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Secondary Action' })).toBeInTheDocument();
  });
});