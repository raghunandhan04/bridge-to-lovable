import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '@/test/utils';
import { DynamicSection } from '../DynamicSection';

const baseSection = {
  id: 's1',
  section_key: 'key-1',
  title: 'Section Title',
  content: 'Some content goes here',
  image_url: '',
  data: {},
  section_type: 'text' as const,
  page_path: '/',
  display_order: 1,
  visible: true,
};

describe('DynamicSection', () => {
  it('renders text section with title and content', () => {
    renderWithProviders(<DynamicSection section={baseSection} />);
    expect(screen.getByText('Section Title')).toBeInTheDocument();
    expect(screen.getByText('Some content goes here')).toBeInTheDocument();
  });

  it('renders feature section with features list', () => {
    const section = {
      ...baseSection,
      id: 's2',
      section_type: 'feature' as const,
      data: {
        features: [
          { title: 'Feature A', description: 'Desc A' },
          { title: 'Feature B', description: 'Desc B' },
        ],
      },
    };
    renderWithProviders(<DynamicSection section={section} />);
    expect(screen.getByRole('heading', { name: 'Section Title' })).toBeInTheDocument();
    expect(screen.getByText('Some content goes here')).toBeInTheDocument();
    expect(screen.getByText('Feature A')).toBeInTheDocument();
    expect(screen.getByText('Feature B')).toBeInTheDocument();
  });

  it('renders hero section and admin controls when isAdmin=true', () => {
    const section = {
      ...baseSection,
      id: 's3',
      section_type: 'hero' as const,
      data: { buttons: [{ text: 'Get Started', link: '/contact', style: 'primary' }] },
    };
    renderWithProviders(<DynamicSection section={section} isAdmin />);
    // Title in hero
    expect(screen.getByRole('heading', { level: 1, name: 'Section Title' })).toBeInTheDocument();
    // CTA button
    expect(screen.getByRole('button', { name: 'Get Started' })).toBeInTheDocument();
  });
});
