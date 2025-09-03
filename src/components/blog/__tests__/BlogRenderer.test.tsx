import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import BlogRenderer from '../BlogRenderer';
import { TestWrapper } from '../../../test/utils';

describe('BlogRenderer Component', () => {
  const mockBlogBasic = {
    title: 'Test Blog Post',
    content: '<p>This is test content</p>',
    excerpt: 'Test excerpt',
    featured_image_url: 'https://test-image.jpg',
    created_at: '2024-01-01T00:00:00Z',
    category: 'technology'
  };

  const mockBlogWithStructure = {
    ...mockBlogBasic,
    blog_structure: {
      title: 'Structured Blog Post',
      featuredImage: 'https://structured-featured.jpg',
      author: 'Test Author',
      date: '2024-01-01',
      blocks: [
        {
          id: 'block-1',
          type: 'left-image-right-text' as const,
          content: {
            text: 'This text appears on the right side',
            imageUrl: 'https://left-image.jpg',
            width: 100,
            alignment: 'center' as const,
            fontSize: 'base' as const,
            fontWeight: 'normal' as const,
            textColor: '#333333'
          }
        },
        {
          id: 'block-2',
          type: 'right-image-left-text' as const,
          content: {
            text: 'This text appears on the left side',
            imageUrl: 'https://right-image.jpg',
            width: 100,
            alignment: 'left' as const,
            fontSize: 'lg' as const,
            fontWeight: 'medium' as const,
            textColor: '#000000'
          }
        },
        {
          id: 'block-3',
          type: 'full-width-image' as const,
          content: {
            imageUrl: 'https://full-width-image.jpg',
            caption: 'Full width image caption',
            width: 100,
            alignment: 'center' as const
          }
        },
        {
          id: 'block-4',
          type: 'full-width-text' as const,
          content: {
            text: 'Full width text content that spans the entire article width',
            width: 100,
            alignment: 'center' as const,
            fontSize: 'xl' as const,
            fontWeight: 'bold' as const,
            textColor: '#111111'
          }
        },
        {
          id: 'block-5',
          type: 'image-caption' as const,
          content: {
            imageUrl: 'https://caption-image.jpg',
            caption: 'Image with caption below',
            width: 75,
            alignment: 'center' as const
          }
        },
        {
          id: 'block-6',
          type: 'video-embed' as const,
          content: {
            videoUrl: 'https://www.youtube.com/embed/testVideo',
            width: 90,
            alignment: 'center' as const
          }
        },
        {
          id: 'block-7',
          type: 'table' as const,
          content: {
            tableData: {
              headers: ['Product', 'Price', 'Stock'],
              rows: [
                ['Widget A', '$19.99', '50'],
                ['Widget B', '$24.99', '25'],
                ['Widget C', '$29.99', '10']
              ]
            },
            alignment: 'center' as const
          }
        },
        {
          id: 'block-8',
          type: 'chart' as const,
          content: {
            chartData: {
              type: 'bar' as const,
              title: 'Sales Data',
              labels: ['Q1', 'Q2', 'Q3', 'Q4'],
              data: [100, 150, 120, 200]
            },
            alignment: 'center' as const
          }
        }
      ]
    }
  };

  it('renders classic blog content when no structure provided', () => {
    render(
      <TestWrapper>
        <BlogRenderer blog={mockBlogBasic} />
      </TestWrapper>
    );

    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
    expect(screen.getByText('Test excerpt')).toBeInTheDocument();
    expect(screen.getByText('technology')).toBeInTheDocument();
    
    const featuredImage = screen.getByAltText('Test Blog Post');
    expect(featuredImage).toBeInTheDocument();
    expect(featuredImage).toHaveAttribute('src', 'https://test-image.jpg');
  });

  it('renders structured blog content', () => {
    render(
      <TestWrapper>
        <BlogRenderer blog={mockBlogWithStructure} />
      </TestWrapper>
    );

    expect(screen.getByText('Structured Blog Post')).toBeInTheDocument();
    expect(screen.getByText('By Test Author')).toBeInTheDocument();
    expect(screen.getByText('technology')).toBeInTheDocument();
    
    // Check featured image
    const featuredImage = screen.getByAltText('Structured Blog Post');
    expect(featuredImage).toBeInTheDocument();
    expect(featuredImage).toHaveAttribute('src', 'https://structured-featured.jpg');
  });

  it('renders left-image-right-text layout correctly', () => {
    render(
      <TestWrapper>
        <BlogRenderer blog={mockBlogWithStructure} />
      </TestWrapper>
    );

    expect(screen.getByText('This text appears on the right side')).toBeInTheDocument();
    
  const leftImages = screen.getAllByRole('img');
  const leftImage = leftImages.find(i => i.getAttribute('src') === 'https://left-image.jpg');
  expect(leftImage).toBeDefined();
  });

  it('renders right-image-left-text layout correctly', () => {
    render(
      <TestWrapper>
        <BlogRenderer blog={mockBlogWithStructure} />
      </TestWrapper>
    );

    expect(screen.getByText('This text appears on the left side')).toBeInTheDocument();
    
  const rightImages = screen.getAllByRole('img');
  const rightImage = rightImages.find(i => i.getAttribute('src') === 'https://right-image.jpg');
  expect(rightImage).toBeDefined();
  });

  it('renders full-width-image with caption', () => {
    render(
      <TestWrapper>
        <BlogRenderer blog={mockBlogWithStructure} />
      </TestWrapper>
    );

  const fullWidthImages = screen.getAllByRole('img');
  const fullWidthImage = fullWidthImages.find(i => i.getAttribute('src') === 'https://full-width-image.jpg');
  expect(fullWidthImage).toBeDefined();
    expect(screen.getByText('Full width image caption')).toBeInTheDocument();
  });

  it('renders full-width-text content', () => {
    render(
      <TestWrapper>
        <BlogRenderer blog={mockBlogWithStructure} />
      </TestWrapper>
    );

    expect(screen.getByText('Full width text content that spans the entire article width')).toBeInTheDocument();
  });

  it('renders image-caption layout', () => {
    render(
      <TestWrapper>
        <BlogRenderer blog={mockBlogWithStructure} />
      </TestWrapper>
    );

  const captionImages = screen.getAllByRole('img');
  const captionImage = captionImages.find(i => i.getAttribute('src') === 'https://caption-image.jpg');
  expect(captionImage).toBeDefined();
    expect(screen.getByText('Image with caption below')).toBeInTheDocument();
  });

  it('renders video embed', () => {
    render(
      <TestWrapper>
        <BlogRenderer blog={mockBlogWithStructure} />
      </TestWrapper>
    );

  const iframes = screen.getAllByTitle('https://www.youtube.com/embed/testVideo');
  expect(iframes[0]).toHaveAttribute('src', 'https://www.youtube.com/embed/testVideo');
  });

  it('renders table with headers and data', () => {
    render(
      <TestWrapper>
        <BlogRenderer blog={mockBlogWithStructure} />
      </TestWrapper>
    );

    // Check table headers
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Stock')).toBeInTheDocument();

    // Check table data
    expect(screen.getByText('Widget A')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('renders bar chart with title and data', () => {
    render(
      <TestWrapper>
        <BlogRenderer blog={mockBlogWithStructure} />
      </TestWrapper>
    );

    expect(screen.getByText('Sales Data')).toBeInTheDocument();
  });

  it('applies custom styling from content properties', () => {
    const customStyledBlog = {
      ...mockBlogBasic,
      blog_structure: {
        title: 'Custom Styled Blog',
        featuredImage: '',
        author: 'Author',
        date: '2024-01-01',
        blocks: [
          {
            id: 'styled-block',
            type: 'full-width-text' as const,
            content: {
              text: 'Custom styled text',
              width: 50,
              alignment: 'right' as const,
              fontSize: 'xl' as const,
              fontWeight: 'bold' as const,
              textColor: '#ff0000',
              hasBorder: true,
              hasShadow: true
            }
          }
        ]
      }
    };

    render(
      <TestWrapper>
        <BlogRenderer blog={customStyledBlog} />
      </TestWrapper>
    );

    const styledText = screen.getByText('Custom styled text');
    expect(styledText).toBeInTheDocument();
    expect(styledText).toHaveStyle({ color: '#ff0000' });
  });

  it('handles pie chart rendering', () => {
    const pieChartBlog = {
      ...mockBlogBasic,
      blog_structure: {
        title: 'Pie Chart Blog',
        featuredImage: '',
        author: 'Author',
        date: '2024-01-01',
        blocks: [
          {
            id: 'pie-chart-block',
            type: 'chart' as const,
            content: {
              chartData: {
                type: 'pie' as const,
                title: 'Market Share',
                labels: ['Company A', 'Company B', 'Company C'],
                data: [40, 35, 25]
              }
            }
          }
        ]
      }
    };

    render(
      <TestWrapper>
        <BlogRenderer blog={pieChartBlog} />
      </TestWrapper>
    );

    expect(screen.getByText('Market Share')).toBeInTheDocument();
    expect(screen.getByText('Company A: 40')).toBeInTheDocument();
    expect(screen.getByText('Company B: 35')).toBeInTheDocument();
    expect(screen.getByText('Company C: 25')).toBeInTheDocument();
  });

  it('handles line chart rendering', () => {
    const lineChartBlog = {
      ...mockBlogBasic,
      blog_structure: {
        title: 'Line Chart Blog',
        featuredImage: '',
        author: 'Author',
        date: '2024-01-01',
        blocks: [
          {
            id: 'line-chart-block',
            type: 'chart' as const,
            content: {
              chartData: {
                type: 'line' as const,
                title: 'Growth Trend',
                labels: ['Jan', 'Feb', 'Mar', 'Apr'],
                data: [10, 25, 45, 60]
              }
            }
          }
        ]
      }
    };

    render(
      <TestWrapper>
        <BlogRenderer blog={lineChartBlog} />
      </TestWrapper>
    );

    expect(screen.getByText('Growth Trend')).toBeInTheDocument();
  });

  it('handles missing table data gracefully', () => {
    const emptyTableBlog = {
      ...mockBlogBasic,
      blog_structure: {
        title: 'Empty Table Blog',
        featuredImage: '',
        author: 'Author',
        date: '2024-01-01',
        blocks: [
          {
            id: 'empty-table-block',
            type: 'table' as const,
            content: {
              alignment: 'center' as const
            }
          }
        ]
      }
    };

    render(
      <TestWrapper>
        <BlogRenderer blog={emptyTableBlog} />
      </TestWrapper>
    );

    // Should not crash and should not render table
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('handles missing chart data gracefully', () => {
    const emptyChartBlog = {
      ...mockBlogBasic,
      blog_structure: {
        title: 'Empty Chart Blog',
        featuredImage: '',
        author: 'Author',
        date: '2024-01-01',
        blocks: [
          {
            id: 'empty-chart-block',
            type: 'chart' as const,
            content: {
              alignment: 'center' as const
            }
          }
        ]
      }
    };

    render(
      <TestWrapper>
        <BlogRenderer blog={emptyChartBlog} />
      </TestWrapper>
    );

    // Should not crash and should not render chart
    expect(screen.queryByText('Sales Data')).not.toBeInTheDocument();
  });

  it('renders publication date correctly', () => {
    render(
      <TestWrapper>
        <BlogRenderer blog={mockBlogWithStructure} />
      </TestWrapper>
    );

    expect(screen.getByText('January 1, 2024')).toBeInTheDocument();
  });

  it('applies custom className prop', () => {
    const { container } = render(
      <TestWrapper>
        <BlogRenderer blog={mockBlogBasic} className="custom-blog-class" />
      </TestWrapper>
    );

    const article = container.querySelector('article');
    expect(article).toHaveClass('custom-blog-class');
  });
});