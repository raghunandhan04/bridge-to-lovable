import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogManager from '../BlogManager';
import { TestWrapper } from '../../../test/utils';
import { supabase } from '../../../integrations/supabase/client';

// Mock Supabase
vi.mock('../../../integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ data: [], error: null }))
        }))
      })),
      insert: vi.fn(() => Promise.resolve({ data: [], error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null }))
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
vi.mock('../../../scripts/migrate-static-blogs', () => ({
  migrateStaticBlogs: vi.fn(() => Promise.resolve())
}));

vi.mock('../../../scripts/add-featured-articles', () => ({
  addFeaturedArticles: vi.fn(() => Promise.resolve())
}));

const mockBlogs = [
  {
    id: '1',
    title: 'Test Blog 1',
    slug: 'test-blog-1',
    content: 'Test content',
    excerpt: 'Test excerpt',
    category: 'technology',
    status: 'published',
    featured: true,
    featured_image_url: 'test-image.jpg',
    created_at: '2024-01-01T00:00:00Z',
    blog_structure: {
      title: 'Test Blog 1',
      featuredImage: 'test-image.jpg',
      author: 'Admin',
      date: '2024-01-01',
      blocks: [
        {
          id: 'block-1',
          type: 'left-image-right-text',
          content: {
            text: 'Test text content',
            imageUrl: 'test-image.jpg',
            width: 100,
            alignment: 'center'
          }
        }
      ]
    }
  },
  {
    id: '2',
    title: 'Test Blog 2',
    slug: 'test-blog-2',
    content: 'Test content 2',
    excerpt: 'Test excerpt 2',
    category: 'business',
    status: 'draft',
    featured: false,
    featured_image_url: '',
    created_at: '2024-01-02T00:00:00Z'
  }
];

describe('BlogManager Component', () => {
  const defaultProps = {
    userRole: 'admin'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.from as Mock).mockImplementation(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: mockBlogs, error: null }))
      })),
      insert: vi.fn(() => Promise.resolve({ data: [], error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }));
  });

  it('renders blog management header and statistics', async () => {
    render(
      <TestWrapper>
        <BlogManager {...defaultProps} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Blog Management')).toBeInTheDocument();
      expect(screen.getByText('Create, edit, and manage your blog content')).toBeInTheDocument();
    });

    // Check statistics
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // Total blogs
      expect(screen.getByText('1')).toBeInTheDocument(); // Published blogs
      expect(screen.getByText('1')).toBeInTheDocument(); // Draft blogs
    });
  });

  it('displays blogs in table format', async () => {
    render(
      <TestWrapper>
        <BlogManager {...defaultProps} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Blog 1')).toBeInTheDocument();
      expect(screen.getByText('Test Blog 2')).toBeInTheDocument();
      expect(screen.getByText('technology')).toBeInTheDocument();
      expect(screen.getByText('business')).toBeInTheDocument();
    });
  });

  it('filters blogs by search term', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <BlogManager {...defaultProps} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Blog 1')).toBeInTheDocument();
      expect(screen.getByText('Test Blog 2')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search blogs...');
    await user.type(searchInput, 'Blog 1');

    await waitFor(() => {
      expect(screen.getByText('Test Blog 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Blog 2')).not.toBeInTheDocument();
    });
  });

  it('filters blogs by status', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <BlogManager {...defaultProps} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Blog 1')).toBeInTheDocument();
      expect(screen.getByText('Test Blog 2')).toBeInTheDocument();
    });

    // Find status filter dropdown
    const statusFilter = screen.getAllByRole('combobox')[1]; // Second combobox is status filter
    await user.click(statusFilter);
    
    await user.click(screen.getByText('Published'));

    await waitFor(() => {
      expect(screen.getByText('Test Blog 1')).toBeInTheDocument();
      expect(screen.queryByText('Test Blog 2')).not.toBeInTheDocument();
    });
  });

  it('opens create blog form when Create Blog button is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <BlogManager {...defaultProps} />
      </TestWrapper>
    );

  await waitFor(() => screen.getByText('Create Blog'));
  const createButton = screen.getByText('Create Blog');
  await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Create New Blog')).toBeInTheDocument();
      expect(screen.getByLabelText('Title')).toBeInTheDocument();
      expect(screen.getByLabelText('Slug')).toBeInTheDocument();
    });
  });

  it('switches between editor modes', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <BlogManager {...defaultProps} />
      </TestWrapper>
    );

  await waitFor(() => screen.getByText('Create Blog'));
  const createButton = screen.getByText('Create Blog');
  await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Visual Editor')).toBeInTheDocument();
      expect(screen.getByText('Classic Editor')).toBeInTheDocument();
      expect(screen.getByText('Upload Document')).toBeInTheDocument();
    });

    // Switch to classic editor
    await user.click(screen.getByText('Classic Editor'));
    
    await waitFor(() => {
      expect(screen.getByRole('textbox', { name: /content/i })).toBeInTheDocument();
    });
  });

  it('validates required fields when saving', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <BlogManager {...defaultProps} />
      </TestWrapper>
    );

    await waitFor(() => screen.getByText('Create Blog'));
    const createButton = screen.getByText('Create Blog');
    await user.click(createButton);

    // Wait for the form to be fully loaded
    await waitFor(() => screen.getByText('Save Blog'));
    const saveButton = screen.getByText('Save Blog');
    
    // Make sure title is empty by clearing the input field
    const titleInput = screen.getByLabelText('Title');
    await user.clear(titleInput);
    
    // Try to save with empty title - the save button should be disabled now
    await user.click(saveButton);
    
    // Verify that the button is disabled when title is empty
    expect(saveButton).toBeDisabled();
    
    // Type a valid title and verify the button becomes enabled
    await user.type(titleInput, 'Test Title');
    expect(saveButton).not.toBeDisabled();
  });

  it('creates blog with visual editor content', async () => {
    const user = userEvent.setup();
    const mockInsert = vi.fn(() => Promise.resolve({ data: [], error: null }));
    
    (supabase.from as Mock).mockImplementation(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: mockBlogs, error: null }))
      })),
      insert: mockInsert,
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }));
    
    render(
      <TestWrapper>
        <BlogManager {...defaultProps} />
      </TestWrapper>
    );

  await waitFor(() => screen.getByText('Create Blog'));
  const createButton = screen.getByText('Create Blog');
  await user.click(createButton);

    // Fill in form fields
    const titleInput = screen.getByLabelText('Title');
    await user.type(titleInput, 'New Test Blog');

    const excerptInput = screen.getByLabelText('Excerpt');
    await user.type(excerptInput, 'Test excerpt');

    // Ensure we're in visual editor mode
    await user.click(screen.getByText('Visual Editor'));

    const saveButton = screen.getByText('Save Blog');
    await user.click(saveButton);

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          title: 'New Test Blog',
          slug: 'new-test-blog',
          excerpt: 'Test excerpt',
          blog_structure: expect.any(Object)
        })
      ]);
    });
  });

  it('edits existing blog', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <BlogManager {...defaultProps} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Blog 1')).toBeInTheDocument();
    });

  // Find and click edit button for first blog
  await waitFor(() => screen.getAllByLabelText('Edit blog'));
  const editButtons = screen.getAllByLabelText('Edit blog');
  await user.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Edit Blog')).toBeInTheDocument();
      const matches = screen.getAllByDisplayValue('Test Blog 1');
      expect(matches.length).toBeGreaterThanOrEqual(1);
    });
  });

  it('deletes blog with confirmation', async () => {
    const user = userEvent.setup();
    const mockDelete = vi.fn(() => ({
      eq: vi.fn(() => Promise.resolve({ data: [], error: null }))
    }));
    
    // Mock window.confirm
    window.confirm = vi.fn(() => true);
    
    (supabase.from as Mock).mockImplementation(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: mockBlogs, error: null }))
      })),
      insert: vi.fn(() => Promise.resolve({ data: [], error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null }))
      })),
      delete: mockDelete
    }));
    
    render(
      <TestWrapper>
        <BlogManager {...defaultProps} />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Blog 1')).toBeInTheDocument();
    });

    // Find and click delete button for first blog
  await waitFor(() => screen.getAllByLabelText('Delete blog'));
  const deleteButtons = screen.getAllByLabelText('Delete blog');
  await user.click(deleteButtons[0]);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this blog?');
      expect(mockDelete).toHaveBeenCalled();
    });
  });

  it('migrates static blogs', async () => {
    const user = userEvent.setup();
    const { migrateStaticBlogs } = await import('../../../scripts/migrate-static-blogs');
    
    // Mock window.confirm
    window.confirm = vi.fn(() => true);
    
    render(
      <TestWrapper>
        <BlogManager {...defaultProps} />
      </TestWrapper>
    );

    const migrateButton = screen.getByText('Migrate Static Blogs');
    await user.click(migrateButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('This will migrate static blog content to the database. Continue?');
      expect(migrateStaticBlogs).toHaveBeenCalled();
    });
  });

  it('adds featured articles', async () => {
    const user = userEvent.setup();
    const { addFeaturedArticles } = await import('../../../scripts/add-featured-articles');
    
    // Mock window.confirm
    window.confirm = vi.fn(() => true);
    
    render(
      <TestWrapper>
        <BlogManager {...defaultProps} />
      </TestWrapper>
    );

    const featuredButton = screen.getByText('Add Featured Articles');
    await user.click(featuredButton);

    await waitFor(() => {
      expect(window.confirm).toHaveBeenCalledWith('This will add 2 new featured articles to the database. Continue?');
      expect(addFeaturedArticles).toHaveBeenCalled();
    });
  });

  it('prevents non-admin users from performing admin actions', async () => {
    render(
      <TestWrapper>
        <BlogManager userRole="user" />
      </TestWrapper>
    );

    // Should still render but with limited functionality
    await waitFor(() => {
      expect(screen.queryByText('Create Blog')).not.toBeInTheDocument();
      expect(screen.queryByText('Migrate Static Blogs')).not.toBeInTheDocument();
    });
  });
});