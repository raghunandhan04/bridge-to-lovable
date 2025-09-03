import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from '../Blog';
import { TestWrapper } from '../../test/utils';
import { supabase } from '../../integrations/supabase/client';

// Mock Supabase
vi.mock('../../integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    }))
  }
}));

// Mock BlogRenderer
vi.mock('../../components/blog/BlogRenderer', () => ({
  default: ({ blog }: any) => (
    <div data-testid="blog-renderer">
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>
      {blog.blog_structure && (
        <div data-testid="structured-content">
          {blog.blog_structure.blocks.map((block: any, index: number) => (
            <div key={index} data-testid={`block-${block.type}`}>
              {block.content.text || block.content.caption || 'Block content'}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}));

const mockBlogs = [
  {
    id: '1',
    title: 'AI Technology Advances',
    slug: 'ai-technology-advances',
    content: 'Content about AI technology advances',
    excerpt: 'Latest developments in AI technology',
    category: 'ai',
    status: 'published',
    featured: true,
    featured_image_url: 'ai-image.jpg',
    created_at: '2024-01-01T00:00:00Z',
    blog_structure: {
      title: 'AI Technology Advances',
      blocks: [
        {
          id: 'block-1',
          type: 'left-image-right-text',
          content: {
            text: 'AI is transforming industries',
            imageUrl: 'ai-image.jpg'
          }
        },
        {
          id: 'block-2',
          type: 'full-width-text',
          content: {
            text: 'Machine learning algorithms are becoming more sophisticated'
          }
        }
      ]
    }
  },
  {
    id: '2',
    title: 'Business Innovation Strategies',
    slug: 'business-innovation-strategies',
    content: 'Content about business innovation',
    excerpt: 'How businesses can innovate effectively',
    category: 'business',
    status: 'published',
    featured: false,
    featured_image_url: 'business-image.jpg',
    created_at: '2024-01-02T00:00:00Z',
    blog_structure: {
      title: 'Business Innovation Strategies',
      blocks: [
        {
          id: 'block-3',
          type: 'right-image-left-text',
          content: {
            text: 'Innovation drives business success',
            imageUrl: 'business-image.jpg'
          }
        },
        {
          id: 'block-4',
          type: 'table',
          content: {
            tableData: {
              headers: ['Strategy', 'Impact', 'Timeline'],
              rows: [
                ['Digital Transformation', 'High', '6-12 months'],
                ['Process Optimization', 'Medium', '3-6 months']
              ]
            }
          }
        }
      ]
    }
  },
  {
    id: '3',
    title: 'Technology Trends 2024',
    slug: 'technology-trends-2024',
    content: 'Content about technology trends',
    excerpt: 'Top technology trends for 2024',
    category: 'technology',
    status: 'published',
    featured: true,
    featured_image_url: 'tech-image.jpg',
    created_at: '2024-01-03T00:00:00Z',
    blog_structure: {
      title: 'Technology Trends 2024',
      blocks: [
        {
          id: 'block-5',
          type: 'full-width-image',
          content: {
            imageUrl: 'tech-trends-image.jpg',
            caption: 'Technology landscape in 2024'
          }
        },
        {
          id: 'block-6',
          type: 'chart',
          content: {
            chartData: {
              type: 'bar',
              title: 'Technology Adoption Rates',
              labels: ['AI', 'IoT', 'Blockchain', 'Cloud'],
              data: [85, 70, 45, 95]
            }
          }
        }
      ]
    }
  },
  {
    id: '4',
    title: 'General Industry Updates',
    slug: 'general-industry-updates',
    content: 'General content about industry updates',
    excerpt: 'Recent updates across industries',
    category: 'general',
    status: 'published',
    featured: false,
    featured_image_url: 'general-image.jpg',
    created_at: '2024-01-04T00:00:00Z',
    blog_structure: {
      title: 'General Industry Updates',
      blocks: [
        {
          id: 'block-7',
          type: 'video-embed',
          content: {
            videoUrl: 'https://youtube.com/embed/test'
          }
        },
        {
          id: 'block-8',
          type: 'image-caption',
          content: {
            imageUrl: 'industry-image.jpg',
            caption: 'Industry transformation overview'
          }
        }
      ]
    }
  }
];

describe('Blog Page Enhanced Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.from as Mock).mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockBlogs, error: null }))
        }))
      }))
    }));
  });

  it('loads and displays all blog categories', async () => {
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

  await waitFor(() => {
      expect(screen.getByText('Categories')).toBeInTheDocument();
      expect(screen.getByText(/General \(1\)/)).toBeInTheDocument();
      expect(screen.getByText(/Technology \(1\)/)).toBeInTheDocument();
      expect(screen.getByText(/Artificial Intelligence \(1\)/)).toBeInTheDocument();
      expect(screen.getByText(/Business \(1\)/)).toBeInTheDocument();
    });
  });

  it('displays featured articles from each category', async () => {
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

  await waitFor(() => {
      expect(screen.getByText('Featured Articles')).toBeInTheDocument();
      expect(screen.getAllByText('AI Technology Advances').length).toBeGreaterThan(0);
      expect(screen.getByText('Technology Trends 2024')).toBeInTheDocument();
    });
  });

  it('expands category to show blog list', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

  await waitFor(() => {
      expect(screen.getByText(/Artificial Intelligence \(1\)/)).toBeInTheDocument();
    });

    // Click to expand AI category
    const aiCategoryButton = screen.getByText(/Artificial Intelligence \(1\)/);
    await user.click(aiCategoryButton);

    await waitFor(() => {
      expect(screen.getAllByText('AI Technology Advances').length).toBeGreaterThan(0);
    });
  });

  it('renders structured blog content when selected', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Artificial Intelligence \(1\)/)).toBeInTheDocument();
    });

    // Expand AI category and select blog
    const aiCategoryButton = screen.getByText(/Artificial Intelligence \(1\)/);
    await user.click(aiCategoryButton);

    await waitFor(() => {
      expect(screen.getAllByText('AI Technology Advances').length).toBeGreaterThan(0);
    });

    const elems = screen.getAllByText('AI Technology Advances');
    const blogButton = elems.find(e => !e.closest('[data-testid="blog-renderer"]')) || elems[0];
    await user.click(blogButton);

  await waitFor(() => {
      expect(screen.getByTestId('blog-renderer')).toBeInTheDocument();
      expect(screen.getByTestId('structured-content')).toBeInTheDocument();
      expect(screen.getByTestId('block-left-image-right-text')).toBeInTheDocument();
      expect(screen.getByTestId('block-full-width-text')).toBeInTheDocument();
    });
  });

  it('displays different layout types correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    // Select business blog with right-image-left-text layout
  await waitFor(() => {
      expect(screen.getByText(/Business \(1\)/)).toBeInTheDocument();
    });

    const businessCategoryButton = screen.getByText(/Business \(1\)/);
    await user.click(businessCategoryButton);

    await waitFor(() => {
      expect(screen.getByText('Business Innovation Strategies')).toBeInTheDocument();
    });
    const businessBlog = screen.getByText('Business Innovation Strategies');
    await user.click(businessBlog);

  await waitFor(() => {
      expect(screen.getByTestId('block-right-image-left-text')).toBeInTheDocument();
      expect(screen.getByTestId('block-table')).toBeInTheDocument();
    });
  });

  it('renders chart and full-width image layouts', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    // Select technology blog with chart
  await waitFor(() => {
      expect(screen.getByText(/Technology \(1\)/)).toBeInTheDocument();
    });

    const techCategoryButton = screen.getByText(/Technology \(1\)/);
    await user.click(techCategoryButton);

    await waitFor(() => {
      expect(screen.getAllByText('Technology Trends 2024').length).toBeGreaterThan(0);
    });
    const techElems = screen.getAllByText('Technology Trends 2024');
    const techBlogBtn = techElems.find(e => !e.closest('[data-testid="blog-renderer"]')) || techElems[0];
    await user.click(techBlogBtn);

  await waitFor(() => {
      expect(screen.getByTestId('block-full-width-image')).toBeInTheDocument();
      expect(screen.getByTestId('block-chart')).toBeInTheDocument();
    });
  });

  it('renders video and image-caption layouts', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    // Select general blog with video and image-caption
  await waitFor(() => {
      expect(screen.getByText(/General \(1\)/)).toBeInTheDocument();
    });

    const generalCategoryButton = screen.getByText(/General \(1\)/);
    await user.click(generalCategoryButton);

    await waitFor(() => {
      expect(screen.getByText('General Industry Updates')).toBeInTheDocument();
    });
    const generalBlog = screen.getByText('General Industry Updates');
    await user.click(generalBlog);

  await waitFor(() => {
      expect(screen.getByTestId('block-video-embed')).toBeInTheDocument();
      expect(screen.getByTestId('block-image-caption')).toBeInTheDocument();
    });
  });

  it('handles mobile responsive behavior', async () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 640,
    });
    window.dispatchEvent(new Event('resize'));

    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

  await waitFor(() => {
      // Should show mobile-friendly category selector
      expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    // Reset viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    window.dispatchEvent(new Event('resize'));
  });

  it('loads blog from featured articles sidebar', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

  await waitFor(() => {
      expect(screen.getByText('Featured Articles')).toBeInTheDocument();
    });

    // Click featured article
    const featuredButtons = screen.getAllByText('AI Technology Advances');
    const featuredButton = featuredButtons.find(button => 
      button.closest('[data-testid]')?.getAttribute('data-testid') !== 'blog-renderer'
    );
    
    if (featuredButton) {
      await user.click(featuredButton);

      await waitFor(() => {
        expect(screen.getByTestId('blog-renderer')).toBeInTheDocument();
        expect(screen.getByTestId('structured-content')).toBeInTheDocument();
      });
    }
  });

  it('handles blog selection state correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    // Initially shows placeholder
    await waitFor(() => {
      expect(screen.getByText('Select a blog to read')).toBeInTheDocument();
    });

    // Select a blog
  await waitFor(() => {
      expect(screen.getByText(/Artificial Intelligence \(1\)/)).toBeInTheDocument();
    });

    const aiCategoryButton = screen.getByText(/Artificial Intelligence \(1\)/);
    await user.click(aiCategoryButton);

    await waitFor(() => {
      expect(screen.getAllByText('AI Technology Advances').length).toBeGreaterThan(0);
    });
    const blogElems = screen.getAllByText('AI Technology Advances');
    const blogButton = blogElems.find(e => !e.closest('[data-testid="blog-renderer"]')) || blogElems[0];
    await user.click(blogButton);

    // Placeholder should be gone
  await waitFor(() => {
      expect(screen.queryByText('Select a blog to read')).not.toBeInTheDocument();
      expect(screen.getByTestId('blog-renderer')).toBeInTheDocument();
    });
  });

  it('handles error state gracefully', async () => {
    (supabase.from as Mock).mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Database error' } }))
        }))
      }))
    }));

    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

  await waitFor(() => {
      expect(screen.getByText('Categories')).toBeInTheDocument();
    });

    // Should handle error gracefully and show empty state
    await waitFor(() => {
      expect(screen.getByText('Select a blog to read')).toBeInTheDocument();
    });
  });

  it('shows proper blog metadata and formatting', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <Blog />
      </TestWrapper>
    );

    // Expand category and select blog
    await waitFor(() => {
      expect(screen.getByText(/Artificial Intelligence \(1\)/)).toBeInTheDocument();
    });

    const aiCategoryButton = screen.getByText(/Artificial Intelligence \(1\)/);
    await user.click(aiCategoryButton);

    await waitFor(() => {
      expect(screen.getAllByText('AI Technology Advances').length).toBeGreaterThan(0);
    });
    const aiBlogElems = screen.getAllByText('AI Technology Advances');
    const aiBlogButton = aiBlogElems.find(e => !e.closest('[data-testid="blog-renderer"]')) || aiBlogElems[0];
    await user.click(aiBlogButton);

    await waitFor(() => {
      // Check that blog metadata is displayed
      expect(screen.getAllByText('Artificial Intelligence').length).toBeGreaterThan(0);
      expect(screen.getAllByText('1/1/2024').length).toBeGreaterThan(0);
    });
  });
});