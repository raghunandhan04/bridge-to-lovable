import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DynamicBlog from '../DynamicBlog';
import { TestWrapper } from '../../test/utils';
import { supabase } from '../../integrations/supabase/client';

// Mock react-router-dom but keep original exports (so BrowserRouter is available)
vi.mock('react-router-dom', async (importOriginal: any) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(() => vi.fn()),
  };
});

// Mock Supabase
vi.mock('../../integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      }))
    })),
    channel: vi.fn(() => ({
      on: vi.fn(() => ({
        subscribe: vi.fn()
      }))
    })),
    removeChannel: vi.fn()
  }
}));

// Mock scripts
vi.mock('../../scripts/add-featured-articles', () => ({
  addFeaturedArticles: vi.fn(() => Promise.resolve())
}));

// Mock BlogRenderer
vi.mock('../../components/blog/BlogRenderer', () => ({
  default: ({ blog }: any) => (
    <div data-testid="blog-renderer">
      <h1>{blog.title}</h1>
      <p>{blog.content}</p>
      {blog.blog_structure && (
        <div data-testid="structured-content">
          Structured blog content
        </div>
      )}
    </div>
  )
}));

const mockBlogs = [
  {
    id: '1',
    title: 'Featured AI Article',
    slug: 'featured-ai-article',
    content: 'Content about AI',
    excerpt: 'AI excerpt',
    category: 'ai-technology',
    status: 'published',
    featured: true,
    featured_image_url: 'ai-featured.jpg',
    created_at: '2024-01-01T00:00:00Z',
    blog_structure: {
      title: 'Featured AI Article',
      blocks: [
        {
          id: 'block-1',
          type: 'hero',
          content: {
            text: 'AI is transforming the world'
          }
        }
      ]
    }
  },
  {
    id: '2',
    title: 'Business Insights',
    slug: 'business-insights',
    content: 'Business content',
    excerpt: 'Business excerpt',
    category: 'business-insights',
    status: 'published',
    featured: true,
    featured_image_url: 'business-featured.jpg',
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id: '3',
    title: 'Industry Trends',
    slug: 'industry-trends',
    content: 'Industry content',
    excerpt: 'Industry excerpt',
    category: 'industry-trends',
    status: 'published',
    featured: false,
    featured_image_url: 'industry.jpg',
    created_at: '2024-01-03T00:00:00Z'
  },
  {
    id: '4',
    title: 'Product Updates',
    slug: 'product-updates',
    content: 'Product content',
    excerpt: 'Product excerpt',
    category: 'product-updates',
    status: 'published',
    featured: true,
    featured_image_url: 'product.jpg',
    created_at: '2024-01-04T00:00:00Z'
  }
];

describe('DynamicBlog Component', () => {
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

  it('renders blog listing with categories', async () => {
    render(
      <TestWrapper>
        <DynamicBlog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Blog')).toBeInTheDocument();
      expect(screen.getByText('Discover insights, trends, and innovations in AI and technology')).toBeInTheDocument();
      expect(screen.getByText('Categories')).toBeInTheDocument();
    });
  });

  it('displays featured articles in sidebar', async () => {
    render(
      <TestWrapper>
        <DynamicBlog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Featured Articles')).toBeInTheDocument();
  expect(screen.getAllByText('Featured AI Article').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Business Insights').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Product Updates').length).toBeGreaterThan(0);
    });
  });

  it('filters blogs by category', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <DynamicBlog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('All Articles (4)')).toBeInTheDocument();
    });

    // Click on a specific category
    const categoryButton = screen.getByText('ai-technology (1)');
    await user.click(categoryButton);

    await waitFor(() => {
      expect(screen.getByText('ai-technology Articles')).toBeInTheDocument();
  expect(screen.getAllByText('Featured AI Article').length).toBeGreaterThan(0);
    });
  });

  it('displays blog cards with metadata', async () => {
    render(
      <TestWrapper>
        <DynamicBlog />
      </TestWrapper>
    );

    await waitFor(() => {
      // Check blog cards
  expect(screen.getAllByText('Featured AI Article').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Business Insights').length).toBeGreaterThan(0);
      expect(screen.getByText('Industry Trends')).toBeInTheDocument();
      
      // Check categories are displayed
  expect(screen.getAllByText('ai-technology').length).toBeGreaterThan(0);
  expect(screen.getAllByText('business-insights').length).toBeGreaterThan(0);
  expect(screen.getAllByText('industry-trends').length).toBeGreaterThan(0);
    });
  });

  it('opens blog in reading view when clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <DynamicBlog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getAllByText('Featured AI Article').length).toBeGreaterThan(0);
    });

    // Click on blog card
  const titleElems = screen.getAllByText('Featured AI Article');
  const blogTitleElem = titleElems.find(el => el.className && el.className.includes('text-xl')) || titleElems[0];
  const blogCard = blogTitleElem?.closest('[role="generic"]') || blogTitleElem?.closest('div');
    if (blogCard) {
      await user.click(blogCard);

      await waitFor(() => {
        expect(screen.getByText('Back to Blogs')).toBeInTheDocument();
        expect(screen.getByText('Download PDF')).toBeInTheDocument();
        expect(screen.getByTestId('blog-renderer')).toBeInTheDocument();
      });
    }
  });

  it('returns to blog listing from reading view', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <DynamicBlog />
      </TestWrapper>
    );

    // First click on a blog
    await waitFor(() => {
      expect(screen.getAllByText('Featured AI Article').length).toBeGreaterThan(0);
    });

  const titleElems = screen.getAllByText('Featured AI Article');
  const blogTitleElem = titleElems.find(el => el.className && el.className.includes('text-xl')) || titleElems[0];
  const blogCard = blogTitleElem?.closest('[role="generic"]') || blogTitleElem?.closest('div');
    if (blogCard) {
      await user.click(blogCard);

      await waitFor(() => {
        expect(screen.getByText('Back to Blogs')).toBeInTheDocument();
      });

      // Click back to blogs
      const backButton = screen.getByText('Back to Blogs');
      await user.click(backButton);

      await waitFor(() => {
        expect(screen.getByText('Blog')).toBeInTheDocument();
        expect(screen.queryByText('Back to Blogs')).not.toBeInTheDocument();
      });
    }
  });

  it('handles PDF download functionality', async () => {
    const user = userEvent.setup();
    
    // Mock window.open
    const mockOpen = vi.fn();
    window.open = mockOpen;
    
    render(
      <TestWrapper>
        <DynamicBlog />
      </TestWrapper>
    );

    // Click on blog and then download
    await waitFor(() => {
      expect(screen.getAllByText('Featured AI Article').length).toBeGreaterThan(0);
    });

  const titleElems = screen.getAllByText('Featured AI Article');
  const blogTitleElem = titleElems.find(el => el.className && el.className.includes('text-xl')) || titleElems[0];
  const blogCard = blogTitleElem?.closest('[role="generic"]') || blogTitleElem?.closest('div');
    if (blogCard) {
      await user.click(blogCard);

      await waitFor(() => {
        const downloadButton = screen.getByText('Download PDF');
        expect(downloadButton).toBeInTheDocument();
      });

      const downloadButton = screen.getByText('Download PDF');
      await user.click(downloadButton);

      expect(mockOpen).toHaveBeenCalledWith('', '_blank');
    }
  });

  it('renders structured blog content in reading view', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <DynamicBlog />
      </TestWrapper>
    );

    // Select a blog with structured content
    await waitFor(() => {
      expect(screen.getAllByText('Featured AI Article').length).toBeGreaterThan(0);
    });

  const titleElems = screen.getAllByText('Featured AI Article');
  const blogTitleElem = titleElems.find(el => el.className && el.className.includes('text-xl')) || titleElems[0];
  const blogCard = blogTitleElem?.closest('[role="generic"]') || blogTitleElem?.closest('div');
    if (blogCard) {
      await user.click(blogCard);

      await waitFor(() => {
        expect(screen.getByTestId('blog-renderer')).toBeInTheDocument();
        expect(screen.getByTestId('structured-content')).toBeInTheDocument();
      });
    }
  });

  it('displays featured article images', async () => {
    render(
      <TestWrapper>
        <DynamicBlog />
      </TestWrapper>
    );

    await waitFor(() => {
      const featuredImages = screen.getAllByRole('img');
      expect(featuredImages.length).toBeGreaterThan(0);
      
      // Check specific featured images
      const aiImage = screen.getByAltText('Featured AI Article');
      expect(aiImage).toHaveAttribute('src', 'ai-featured.jpg');
      
      const businessImage = screen.getByAltText('Business Insights');
      expect(businessImage).toHaveAttribute('src', 'business-featured.jpg');
    });
  });

  it('shows correct blog count per category', async () => {
    render(
      <TestWrapper>
        <DynamicBlog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('All Articles (4)')).toBeInTheDocument();
      expect(screen.getByText('ai-technology (1)')).toBeInTheDocument();
      expect(screen.getByText('business-insights (1)')).toBeInTheDocument();
      expect(screen.getByText('industry-trends (1)')).toBeInTheDocument();
      expect(screen.getByText('product-updates (1)')).toBeInTheDocument();
    });
  });

  it('handles loading state', () => {
    (supabase.from as Mock).mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => new Promise(resolve => {
            // Never resolve to test loading state
          }))
        }))
      }))
    }));

    render(
      <TestWrapper>
        <DynamicBlog />
      </TestWrapper>
    );

    expect(screen.getByText('Loading blogs...')).toBeInTheDocument();
  });

  it('handles empty featured articles', async () => {
    (supabase.from as Mock).mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ 
            data: mockBlogs.map(blog => ({ ...blog, featured: false })), 
            error: null 
          }))
        }))
      }))
    }));

    render(
      <TestWrapper>
        <DynamicBlog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('No featured articles available.')).toBeInTheDocument();
    });
  });

  it('generates PDF with structured content', async () => {
    const user = userEvent.setup();
    
    // Mock window.open and document methods
    const mockDocument = {
      write: vi.fn(),
      close: vi.fn()
    };
    const mockWindow = {
      document: mockDocument,
      onload: null,
      print: vi.fn()
    };
    window.open = vi.fn(() => mockWindow as any);
    
    render(
      <TestWrapper>
        <DynamicBlog />
      </TestWrapper>
    );

    // Click blog with structured content
    await waitFor(() => {
      expect(screen.getAllByText('Featured AI Article').length).toBeGreaterThan(0);
    });

    const titleElems = screen.getAllByText('Featured AI Article');
    const blogTitleElem = titleElems.find(el => el.className && el.className.includes('text-xl')) || titleElems[0];
    const blogCard = blogTitleElem?.closest('[role="generic"]') || blogTitleElem?.closest('div');
    if (blogCard) {
      await user.click(blogCard);

      const downloadButton = await screen.findByText('Download PDF');
      await user.click(downloadButton);

      expect(window.open).toHaveBeenCalledWith('', '_blank');
      expect(mockDocument.write).toHaveBeenCalledWith(
        expect.stringContaining('Featured AI Article')
      );
    }
  });

  it('automatically adds featured articles if less than 3', async () => {
    const { addFeaturedArticles } = await import('../../scripts/add-featured-articles');
    
    // Mock fewer than 3 featured articles
    (supabase.from as Mock).mockImplementation(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ 
            data: mockBlogs.slice(0, 2).map(blog => ({ ...blog, featured: false })), 
            error: null 
          }))
        }))
      }))
    }));

    render(
      <TestWrapper>
        <DynamicBlog />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(addFeaturedArticles).toHaveBeenCalled();
    });
  });
});