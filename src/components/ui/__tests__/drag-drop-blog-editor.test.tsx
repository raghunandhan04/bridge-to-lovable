import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DragDropBlogEditor, { BlogStructure, ContentBlock } from '../drag-drop-blog-editor';

// Polyfill for JSDOM pointer events
beforeAll(() => {
  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }
});
import { TestWrapper } from '../../../test/utils';

// Mock DragDropContext
vi.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children, onDragEnd }: any) => (
    <div data-testid="drag-drop-context" onClick={() => onDragEnd({ destination: null })}>
      {children}
    </div>
  ),
  Droppable: ({ children }: any) => (
    <div data-testid="droppable">
      {children({ innerRef: vi.fn(), droppableProps: {}, placeholder: null }, {})}
    </div>
  ),
  Draggable: ({ children }: any) => (
    <div data-testid="draggable">
      {children({ innerRef: vi.fn(), draggableProps: {}, dragHandleProps: {} }, {})}
    </div>
  )
}));

// Mock FileUploadButton
vi.mock('../file-upload', () => ({
  FileUploadButton: ({ onUploadComplete, children }: any) => (
    <button 
      data-testid="file-upload-button" 
      onClick={() => onUploadComplete('https://test-image.jpg')}
    >
      {children || 'Upload File'}
    </button>
  )
}));

describe('DragDropBlogEditor Component', () => {
  const mockBlogStructure: BlogStructure = {
    title: 'Test Blog',
    featuredImage: 'https://test-featured.jpg',
    author: 'Test Author',
    date: '2024-01-01',
    blocks: []
  };

  const mockOnChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders editor with header information', () => {
    render(
      <TestWrapper>
        <DragDropBlogEditor value={mockBlogStructure} onChange={mockOnChange} />
      </TestWrapper>
    );

    expect(screen.getByDisplayValue('Test Blog')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Author')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2024-01-01')).toBeInTheDocument();
  });

  it('displays block type selector', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <DragDropBlogEditor value={mockBlogStructure} onChange={mockOnChange} />
      </TestWrapper>
    );

    const addBlockButton = screen.getByText('Add Content Block');
    await user.click(addBlockButton);

    await waitFor(() => {
      expect(screen.getByText('Left Image + Right Text')).toBeInTheDocument();
      expect(screen.getByText('Right Image + Left Text')).toBeInTheDocument();
      expect(screen.getByText('Full Width Image')).toBeInTheDocument();
      expect(screen.getByText('Full Width Text')).toBeInTheDocument();
      expect(screen.getByText('Image + Caption')).toBeInTheDocument();
      expect(screen.getByText('Video Embed')).toBeInTheDocument();
      expect(screen.getByText('Table')).toBeInTheDocument();
      expect(screen.getByText('Chart')).toBeInTheDocument();
    });
  });

  it('creates left-image-right-text block', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <DragDropBlogEditor value={mockBlogStructure} onChange={mockOnChange} />
      </TestWrapper>
    );

    const addBlockButton = screen.getByText('Add Content Block');
    await user.click(addBlockButton);

    const leftImageRightTextButton = screen.getByText('Left Image + Right Text');
    await user.click(leftImageRightTextButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockBlogStructure,
        blocks: [
          expect.objectContaining({
            type: 'left-image-right-text',
            content: expect.objectContaining({
              text: 'Add your text content here...',
              imageUrl: 'https://via.placeholder.com/400x300'
            })
          })
        ]
      });
    });
  });

  it('creates right-image-left-text block', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <DragDropBlogEditor value={mockBlogStructure} onChange={mockOnChange} />
      </TestWrapper>
    );

    const addBlockButton = screen.getByText('Add Content Block');
    await user.click(addBlockButton);

    const rightImageLeftTextButton = screen.getByText('Right Image + Left Text');
    await user.click(rightImageLeftTextButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockBlogStructure,
        blocks: [
          expect.objectContaining({
            type: 'right-image-left-text',
            content: expect.objectContaining({
              text: 'Add your text content here...',
              imageUrl: 'https://via.placeholder.com/400x300'
            })
          })
        ]
      });
    });
  });

  it('creates full-width-image block', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <DragDropBlogEditor value={mockBlogStructure} onChange={mockOnChange} />
      </TestWrapper>
    );

    const addBlockButton = screen.getByText('Add Content Block');
    await user.click(addBlockButton);

    const fullWidthImageButton = screen.getByText('Full Width Image');
    await user.click(fullWidthImageButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockBlogStructure,
        blocks: [
          expect.objectContaining({
            type: 'full-width-image',
            content: expect.objectContaining({
              imageUrl: 'https://via.placeholder.com/800x400',
              caption: 'Image caption'
            })
          })
        ]
      });
    });
  });

  it('creates table block with default data', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <DragDropBlogEditor value={mockBlogStructure} onChange={mockOnChange} />
      </TestWrapper>
    );

    const addBlockButton = screen.getByText('Add Content Block');
    await user.click(addBlockButton);

    const tableButton = screen.getByText('Table');
    await user.click(tableButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockBlogStructure,
        blocks: [
          expect.objectContaining({
            type: 'table',
            content: expect.objectContaining({
              tableData: {
                headers: ['Header 1', 'Header 2', 'Header 3'],
                rows: [
                  ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
                  ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
                ]
              }
            })
          })
        ]
      });
    });
  });

  it('creates chart block with default data', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <DragDropBlogEditor value={mockBlogStructure} onChange={mockOnChange} />
      </TestWrapper>
    );

    const addBlockButton = screen.getByText('Add Content Block');
    await user.click(addBlockButton);

    const chartButton = screen.getByText('Chart');
    await user.click(chartButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockBlogStructure,
        blocks: [
          expect.objectContaining({
            type: 'chart',
            content: expect.objectContaining({
              chartData: {
                type: 'bar',
                labels: ['Jan', 'Feb', 'Mar'],
                data: [30, 45, 60],
                title: 'Sample Chart'
              }
            })
          })
        ]
      });
    });
  });

  it('edits block content inline', async () => {
    const user = userEvent.setup();
    const blogWithBlock: BlogStructure = {
      ...mockBlogStructure,
      blocks: [
        {
          id: 'test-block-1',
          type: 'full-width-text',
          content: {
            text: 'Original text content',
            width: 100,
            alignment: 'center',
            fontSize: 'base',
            fontWeight: 'normal',
            textColor: '#000000'
          }
        }
      ]
    };
    
    render(
      <TestWrapper>
        <DragDropBlogEditor value={blogWithBlock} onChange={mockOnChange} />
      </TestWrapper>
    );

    // Find and edit the text content
    const textArea = screen.getByDisplayValue('Original text content');
    await user.clear(textArea);
    await user.type(textArea, 'Updated text content');

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        ...blogWithBlock,
        blocks: [
          expect.objectContaining({
            content: expect.objectContaining({
              text: 'Updated text content'
            })
          })
        ]
      });
    });
  });

  it('updates image URL through upload', async () => {
    const user = userEvent.setup();
    const blogWithImageBlock: BlogStructure = {
      ...mockBlogStructure,
      blocks: [
        {
          id: 'test-block-1',
          type: 'left-image-right-text',
          content: {
            text: 'Test text',
            imageUrl: 'original-image.jpg',
            width: 100,
            alignment: 'center'
          }
        }
      ]
    };
    
    render(
      <TestWrapper>
        <DragDropBlogEditor value={blogWithImageBlock} onChange={mockOnChange} />
      </TestWrapper>
    );

    // Click the file upload button
    const uploadButton = screen.getByTestId('file-upload-button');
    await user.click(uploadButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        ...blogWithImageBlock,
        blocks: [
          expect.objectContaining({
            content: expect.objectContaining({
              imageUrl: 'https://test-image.jpg'
            })
          })
        ]
      });
    });
  });

  it('deletes block when delete button is clicked', async () => {
    const user = userEvent.setup();
    const blogWithBlock: BlogStructure = {
      ...mockBlogStructure,
      blocks: [
        {
          id: 'test-block-1',
          type: 'full-width-text',
          content: {
            text: 'Text to delete',
            width: 100,
            alignment: 'center'
          }
        }
      ]
    };
    
    render(
      <TestWrapper>
        <DragDropBlogEditor value={blogWithBlock} onChange={mockOnChange} />
      </TestWrapper>
    );

    // Find and click delete button
    const deleteButton = screen.getByRole('button', { name: /delete/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        ...blogWithBlock,
        blocks: []
      });
    });
  });

  it('toggles preview mode', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <DragDropBlogEditor value={mockBlogStructure} onChange={mockOnChange} />
      </TestWrapper>
    );

    const previewButton = screen.getByLabelText('Toggle preview mode');
    await user.click(previewButton);

    // In preview mode, editing controls should be hidden
    expect(screen.queryByText('Add Content Block')).not.toBeInTheDocument();
  });

  it('shows advanced settings when block is selected', async () => {
    const user = userEvent.setup();
    const blogWithBlock: BlogStructure = {
      ...mockBlogStructure,
      blocks: [
        {
          id: 'test-block-1',
          type: 'full-width-text',
          content: {
            text: 'Test content',
            width: 100,
            alignment: 'center',
            fontSize: 'base',
            fontWeight: 'normal'
          }
        }
      ]
    };
    
    render(
      <TestWrapper>
        <DragDropBlogEditor value={blogWithBlock} onChange={mockOnChange} />
      </TestWrapper>
    );

    // Click the settings button to show advanced settings
    const settingsButton = screen.getByRole('button', { name: /settings/i });
    await user.click(settingsButton);

    await waitFor(() => {
      expect(screen.getByText('Advanced Settings')).toBeInTheDocument();
    });
  });

  it('updates block width through advanced settings', async () => {
    const user = userEvent.setup();
    const blogWithBlock: BlogStructure = {
      ...mockBlogStructure,
      blocks: [
        {
          id: 'test-block-1',
          type: 'full-width-image',
          content: {
            imageUrl: 'test-image.jpg',
            width: 100,
            alignment: 'center'
          }
        }
      ]
    };
    
    render(
      <TestWrapper>
        <DragDropBlogEditor value={blogWithBlock} onChange={mockOnChange} />
      </TestWrapper>
    );

    // Find width input and update it
    const widthInput = screen.getByDisplayValue('100');
    await user.clear(widthInput);
    await user.type(widthInput, '75');

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        ...blogWithBlock,
        blocks: [
          expect.objectContaining({
            content: expect.objectContaining({
              width: 75
            })
          })
        ]
      });
    });
  });

  it('renders video embed block correctly', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <DragDropBlogEditor value={mockBlogStructure} onChange={mockOnChange} />
      </TestWrapper>
    );

    const addBlockButton = screen.getByText('Add Content Block');
    await user.click(addBlockButton);

    const videoButton = screen.getByText('Video Embed');
    await user.click(videoButton);

    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith({
        ...mockBlogStructure,
        blocks: [
          expect.objectContaining({
            type: 'video-embed',
            content: expect.objectContaining({
              videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
            })
          })
        ]
      });
    });
  });
});