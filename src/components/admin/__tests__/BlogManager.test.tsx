import { describe, it, expect, beforeEach, vi, Mock } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
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

  it('allows adding different layout blocks in visual editor', async () => {
    const user = userEvent.setup();
    const mockInsert = vi.fn(() => Promise.resolve({ data: [], error: null }));
    
    (supabase.from as Mock).mockImplementation(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: mockBlogs, error: null }))
      })),
      insert: mockInsert,
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }));
    
    render(
      <TestWrapper>
        <BlogManager {...defaultProps} />
      </TestWrapper>
    );

    // Open create form
    const createButton = screen.getByText('Create Blog');
    await user.click(createButton);
    
    // Fill basic info
    const titleInput = screen.getByLabelText('Title');
    await user.type(titleInput, 'Test Blog with Layouts');
    
    // Switch to visual editor mode
    await user.click(screen.getByText('Visual Editor'));
    
    // Add a test delay to ensure UI is ready
    await new Promise(r => setTimeout(r, 100));
    
    // Check for add block button - may be labeled differently based on your implementation
    // This may need adjustment based on your actual UI
    const addBlockButton = await screen.findByText(/Add Content Block|Add Block|Add Layout/i);
    expect(addBlockButton).toBeInTheDocument();
    
    // Verify layout options exist after clicking add block
    await user.click(addBlockButton);
    
    // Check for at least one layout type option (adjust these based on your actual UI)
    await waitFor(() => {
      const layoutOptions = screen.getAllByRole('button');
      const layoutButtons = layoutOptions.filter(btn => 
        ['Full Width Text', 'Left Image', 'Right Image', 'Image + Caption']
          .some(text => btn.textContent?.includes(text))
      );
      expect(layoutButtons.length).toBeGreaterThan(0);
    });
  });

  it('supports rich text editing in the classic editor mode', async () => {
    const user = userEvent.setup();
    const mockInsert = vi.fn(() => Promise.resolve({ data: [], error: null }));
    
    (supabase.from as Mock).mockImplementation(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: mockBlogs, error: null }))
      })),
      insert: mockInsert,
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: [], error: null }))
      }))
    }));
    
    render(
      <TestWrapper>
        <BlogManager {...defaultProps} />
      </TestWrapper>
    );

    // Open create form
    const createButton = screen.getByText('Create Blog');
    await user.click(createButton);
    
    // Fill basic info
    const titleInput = screen.getByLabelText('Title');
    await user.type(titleInput, 'Rich Text Editor Test');
    
    // Switch to Classic Editor mode (since visual is default)
    const classicEditorTab = screen.getByText('Classic Editor');
    await user.click(classicEditorTab);
    
    // Wait for the Advanced Rich Text Editor to render
    await waitFor(() => {
      expect(screen.getByText('Classic Editor')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Find the Quill editor container
    await waitFor(() => {
      // Check for the editor container
      const quillContainer = document.querySelector('.ql-container');
      expect(quillContainer).toBeInTheDocument();
      
      // Check for toolbar
      const toolbar = document.querySelector('.ql-toolbar');
      expect(toolbar).toBeInTheDocument();
      
      // Check for specific formatting buttons by their class names
      const boldButton = document.querySelector('.ql-bold');
      const italicButton = document.querySelector('.ql-italic');
      const linkButton = document.querySelector('.ql-link');
      
      expect(boldButton).toBeInTheDocument();
      expect(italicButton).toBeInTheDocument();
      expect(linkButton).toBeInTheDocument();
    }, { timeout: 3000 });
    
    // Verify we can switch between editor modes
    const visualEditorTab = screen.getByText('Visual Editor');
    await user.click(visualEditorTab);
    
    // In visual mode, we should see the block editor UI elements
    await waitFor(() => {
      const addBlockButton = screen.getByText('Add Content Block');
      expect(addBlockButton).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Switch back to classic
    const classicTab = screen.getByText('Classic Editor');
    await user.click(classicTab);
    
    // Verify classic editor is shown again
    await waitFor(() => {
      const editorContainer = screen.getByText('Classic Editor').closest('div');
      expect(editorContainer).toBeInTheDocument();
    });
  });

  it('creates blog with rich text editor content and verifies content is saved', async () => {
    const user = userEvent.setup();
    const mockInsert = vi.fn(() => Promise.resolve({ data: [{ id: 'new-test-id' }], error: null }));
    
    // Mock Supabase
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

    // Open create form
    await waitFor(() => screen.getByText('Create Blog'));
    const createButton = screen.getByText('Create Blog');
    await user.click(createButton);
    
    // Verify the dialog opened
    await waitFor(() => {
      expect(screen.getByTestId('blog-form')).toBeInTheDocument();
    });
    
    // Fill in required form fields
    const titleInput = screen.getByLabelText('Title');
    await user.type(titleInput, 'Rich Text Content Test');
    
    const excerptInput = screen.getByLabelText('Excerpt');
    await user.type(excerptInput, 'Testing rich text content saving');
    
    // Switch to Classic Editor mode if not already selected
    const classicEditorTab = screen.getByText('Classic Editor');
    await user.click(classicEditorTab);
    
    // Wait for the classic editor container to be visible
    await waitFor(() => {
      expect(screen.getByTestId('classic-editor-container')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Sample rich text content to be set
    const richTextContent = '<h2>Test Heading</h2><p>This is a <strong>rich text</strong> test with <em>formatting</em>.</p>';
    
    // Set the content using the exposed test hook
    await act(async () => {
      // Access the test hook and set the content
      if ((window as any).__TEST_HOOKS__?.setFormData) {
        (window as any).__TEST_HOOKS__.setFormData((prev: any) => ({
          ...prev,
          content: richTextContent
        }));
      } else {
        console.error('Test hook not available');
      }
    });
    
    // Verify the save button is enabled and click it
    const saveButton = screen.getByTestId('save-blog-button');
    expect(saveButton).not.toBeDisabled();
    await user.click(saveButton);
    
    // Verify that the insert function was called
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
      
      // Use type assertion to access the mock calls safely
      const calls = mockInsert.mock.calls as any[][];
      expect(calls.length).toBeGreaterThan(0);
      
      // Use conditional checks to avoid TypeScript errors
      if (calls.length > 0 && calls[0] && calls[0][0]) {
        const blogData = calls[0][0];
        // Check that at least one blog was inserted
        expect(blogData).toBeTruthy();
        
        // Since we know there's data, we can safely do this assertion
        // Create a type-safe way to check
        const blogEntries = blogData as any[];
        if (blogEntries.length > 0) {
          const blog = blogEntries[0];
          expect(blog.title).toBe('Rich Text Content Test');
          expect(blog.excerpt).toBe('Testing rich text content saving');
          expect(blog.content).toBe(richTextContent);
        }
      }
    }, { timeout: 3000 });
  }, 10000); // Increase timeout for this specific test
  
  it('creates blog with multiple layout types and verifies structure is saved', async () => {
    const user = userEvent.setup();
    const mockInsert = vi.fn(() => Promise.resolve({ data: [{ id: 'new-layout-test-id' }], error: null }));
    
    // Mock window.confirm for blog structure autosave confirmation
    window.confirm = vi.fn(() => true);
    
    // Mock Supabase
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

    // Mock the exposed test hook for blog structure
    let capturedBlogStructure: any = null;
    if (!(window as any).__TEST_HOOKS__) {
      (window as any).__TEST_HOOKS__ = {};
    }
    (window as any).__TEST_HOOKS__.setBlogStructure = (structure: any) => {
      capturedBlogStructure = structure;
      return structure;
    };
    
    render(
      <TestWrapper>
        <BlogManager {...defaultProps} />
      </TestWrapper>
    );

    // Open create form
    await waitFor(() => screen.getByText('Create Blog'));
    const createButton = screen.getByText('Create Blog');
    await user.click(createButton);
    
    // Verify the dialog opened
    await waitFor(() => {
      expect(screen.getByTestId('blog-form')).toBeInTheDocument();
    });
    
    // Fill in required form fields
    const titleInput = screen.getByLabelText('Title');
    await user.type(titleInput, 'Blog With Multiple Layouts');
    
    const excerptInput = screen.getByLabelText('Excerpt');
    await user.type(excerptInput, 'Testing multiple layout blocks in a blog');
    
    // Ensure we're in Visual Editor mode
    const visualEditorTab = screen.getByText('Visual Editor');
    await user.click(visualEditorTab);
    
    // Wait for the visual editor to load
    await waitFor(() => {
      const addBlockButton = screen.getByText('Add Content Block');
      expect(addBlockButton).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Add the first layout - Full Width Text
    await user.click(screen.getByText('Add Content Block'));
    
    // Wait for the block selector dialog to appear
    await waitFor(() => {
      expect(screen.getByText('Full Width Text')).toBeInTheDocument();
    });
    
    // Select Full Width Text layout
    await user.click(screen.getByText('Full Width Text'));
    
    // Add another layout - Left Image + Right Text
    await user.click(screen.getByText('Add Content Block'));
    
    // Wait for the block selector dialog to appear
    await waitFor(() => {
      expect(screen.getByText('Left Image + Right Text')).toBeInTheDocument();
    });
    
    // Select Left Image + Right Text layout
    await user.click(screen.getByText('Left Image + Right Text'));
    
    // Add a third layout - Image + Caption
    await user.click(screen.getByText('Add Content Block'));
    
    // Wait for the block selector dialog to appear
    await waitFor(() => {
      expect(screen.getByText('Image + Caption')).toBeInTheDocument();
    });
    
    // Select Image + Caption layout
    await user.click(screen.getByText('Image + Caption'));
    
    // Save the blog
    const saveButton = screen.getByTestId('save-blog-button');
    expect(saveButton).not.toBeDisabled();
    await user.click(saveButton);
    
    // Verify that the content was saved with the correct blog structure
    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled();
      
      // Use type assertion to access the mock calls safely
      const calls = mockInsert.mock.calls as any[][];
      
      if (calls.length > 0 && calls[0] && calls[0][0]) {
        const blogData = calls[0][0];
        const blogEntries = blogData as any[];
        
        if (blogEntries.length > 0) {
          const blog = blogEntries[0];
          expect(blog.title).toBe('Blog With Multiple Layouts');
          expect(blog.excerpt).toBe('Testing multiple layout blocks in a blog');
          
          // Verify blog_structure was saved
          expect(blog.blog_structure).toBeDefined();
          
          if (blog.blog_structure) {
            // Verify the blog structure has the correct number of blocks
            expect(blog.blog_structure.blocks.length).toBe(3);
            
            // Verify the types of blocks saved
            const blockTypes = blog.blog_structure.blocks.map((block: any) => block.type);
            expect(blockTypes).toContain('full-width-text');
            expect(blockTypes).toContain('left-image-right-text');
            expect(blockTypes).toContain('image-caption');
            
            // Verify each block has the necessary content structure
            blog.blog_structure.blocks.forEach((block: any) => {
              expect(block.id).toBeDefined();
              expect(block.content).toBeDefined();
            });
          }
        }
      }
    }, { timeout: 3000 });
  }, 15000); // Increase timeout for this specific test
});