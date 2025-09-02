import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import EditableSection from '../EditableSection';

describe('EditableSection', () => {
  it('renders children with data attributes', () => {
    renderWithProviders(
      <EditableSection sectionId="sec-123" field="title" className="my-class">
        Hello World
      </EditableSection>
    );

    const root = screen.getByText('Hello World').closest('[data-section-id]');
    expect(root).toBeTruthy();
    expect(root).toHaveAttribute('data-section-id', 'sec-123');
    expect(root).toHaveAttribute('data-field', 'title');
  });
});
