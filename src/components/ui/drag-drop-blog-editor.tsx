import React, { useState, useCallback, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { 
  Plus, 
  Grip, 
  Trash2, 
  Image, 
  Type, 
  Layout, 
  Video, 
  Table, 
  BarChart3,
  Eye,
  EyeOff,
  Settings,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  FileText,
  Monitor,
  Upload,
  Link
} from 'lucide-react';
import { FileUploadButton } from '@/components/ui/file-upload';

// Block type definitions
export interface ContentBlock {
  id: string;
  type: 'left-image-right-text' | 'right-image-left-text' | 'full-width-image' | 'full-width-text' | 'image-caption' | 'video-embed' | 'table' | 'chart';
  content: {
    title?: string;
    text?: string;
    imageUrl?: string;
    videoUrl?: string;
    caption?: string;
    width?: number;
    alignment?: 'left' | 'center' | 'right';
    hasBorder?: boolean;
    hasShadow?: boolean;
    fontSize?: 'sm' | 'base' | 'lg' | 'xl';
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    textColor?: string;
    tableData?: {
      headers: string[];
      rows: string[][];
    };
    chartData?: {
      type: 'pie' | 'bar' | 'line';
      labels: string[];
      data: number[];
      title: string;
    };
  };
}

export interface BlogStructure {
  title: string;
  featuredImage: string;
  author: string;
  date: string;
  blocks: ContentBlock[];
}

interface DragDropBlogEditorProps {
  value: BlogStructure;
  onChange: (value: BlogStructure) => void;
  className?: string;
  showMetaControls?: boolean;
}

const DragDropBlogEditor: React.FC<DragDropBlogEditorProps> = ({
  value,
  onChange,
  className,
  showMetaControls = true
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [showBlockSelector, setShowBlockSelector] = useState(false);

  // Block templates
  const blockTypes = [
    {
      type: 'left-image-right-text' as const,
      name: 'Left Image + Right Text',
      icon: Layout,
      description: 'Image on left, text on right'
    },
    {
      type: 'right-image-left-text' as const,
      name: 'Right Image + Left Text',
      icon: Layout,
      description: 'Text on left, image on right'
    },
    {
      type: 'full-width-image' as const,
      name: 'Full Width Image',
      icon: Image,
      description: 'Large hero image'
    },
    {
      type: 'full-width-text' as const,
      name: 'Full Width Text',
      icon: Type,
      description: 'Full width text block'
    },
    {
      type: 'image-caption' as const,
      name: 'Image + Caption',
      icon: ImageIcon,
      description: 'Image with caption below'
    },
    {
      type: 'video-embed' as const,
      name: 'Video Embed',
      icon: Video,
      description: 'Embedded video content'
    },
    {
      type: 'table' as const,
      name: 'Table',
      icon: Table,
      description: 'Data table'
    },
    {
      type: 'chart' as const,
      name: 'Chart',
      icon: BarChart3,
      description: 'Data visualization'
    }
  ];

  // Create new block
  const createBlock = (type: ContentBlock['type']): ContentBlock => {
    const baseContent = {
      title: '',
      text: '',
      imageUrl: '',
      width: 100,
      alignment: 'center' as const,
      hasBorder: false,
      hasShadow: false,
      fontSize: 'base' as const,
      fontWeight: 'normal' as const,
      textColor: '#000000'
    };

    const blockDefaults = {
      'left-image-right-text': {
        ...baseContent,
        text: 'Add your text content here...',
        imageUrl: 'https://via.placeholder.com/400x300'
      },
      'right-image-left-text': {
        ...baseContent,
        text: 'Add your text content here...',
        imageUrl: 'https://via.placeholder.com/400x300'
      },
      'full-width-image': {
        ...baseContent,
        imageUrl: 'https://via.placeholder.com/800x400',
        caption: 'Image caption'
      },
      'full-width-text': {
        ...baseContent,
        text: 'Add your full-width text content here...',
        fontSize: 'lg' as const
      },
      'image-caption': {
        ...baseContent,
        imageUrl: 'https://via.placeholder.com/600x400',
        caption: 'Image caption'
      },
      'video-embed': {
        ...baseContent,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
      },
      'table': {
        ...baseContent,
        tableData: {
          headers: ['Header 1', 'Header 2', 'Header 3'],
          rows: [
            ['Row 1 Col 1', 'Row 1 Col 2', 'Row 1 Col 3'],
            ['Row 2 Col 1', 'Row 2 Col 2', 'Row 2 Col 3']
          ]
        }
      },
      'chart': {
        ...baseContent,
        chartData: {
          type: 'bar' as const,
          labels: ['Jan', 'Feb', 'Mar'],
          data: [30, 45, 60],
          title: 'Sample Chart'
        }
      }
    };

    return {
      id: `block-${Date.now()}`,
      type,
      content: blockDefaults[type]
    };
  };

  // Add new block
  const addBlock = (type: ContentBlock['type']) => {
    const newBlock = createBlock(type);
    onChange({
      ...value,
      blocks: [...value.blocks, newBlock]
    });
    setShowBlockSelector(false);
  };

  // Handle drag end
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(value.blocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onChange({
      ...value,
      blocks: items
    });
  };

  // Update block
  const updateTimers = useRef<Record<string, ReturnType<typeof setTimeout> | null>>({});

  const updateBlock = (blockId: string, updates: Partial<ContentBlock['content']>) => {
    const updatedBlocks = value.blocks.map(block => 
      block.id === blockId 
        ? { ...block, content: { ...block.content, ...updates } }
        : block
    );

    // Debounce rapid updates per block (typing) so tests receive the final state
    if (updateTimers.current[blockId]) {
      clearTimeout(updateTimers.current[blockId] as any);
    }

    updateTimers.current[blockId] = setTimeout(() => {
      onChange({
        ...value,
        blocks: updatedBlocks
      });
      updateTimers.current[blockId] = null;
    }, 40) as any;
  };

  // Delete block
  const deleteBlock = (blockId: string) => {
    onChange({
      ...value,
      blocks: value.blocks.filter(block => block.id !== blockId)
    });
  };

  // Render block editor
  const renderBlockEditor = (block: ContentBlock) => {
    const isSelected = selectedBlockId === block.id;
    
    return (
      <Card className={cn("mb-4 transition-all duration-200", isSelected && "ring-2 ring-primary shadow-lg")}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Grip className="w-4 h-4 text-muted-foreground cursor-grab" />
              <Badge variant="secondary" className="text-xs">
                {blockTypes.find(t => t.type === block.type)?.name}
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant={isSelected ? "default" : "ghost"}
                size="sm"
                aria-label="Settings"
                onClick={() => setSelectedBlockId(isSelected ? null : block.id)}
              >
                <Settings className="w-4 h-4" />
                <span className="sr-only">Settings</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Delete"
                onClick={() => deleteBlock(block.id)}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                <span className="sr-only">Delete</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Always show editing interface */}
          <div className="space-y-4">
            {/* Quick Edit Inline Controls */}
            <div className="bg-muted/50 p-3 rounded-lg">
              <h4 className="text-sm font-medium mb-3 text-muted-foreground">Quick Edit</h4>
              {renderInlineControls(block)}
            </div>
            
            {/* Block Preview */}
            <div className="border-2 border-dashed border-muted-foreground/20 p-4 rounded-lg bg-muted/20">
              <div className="text-xs text-muted-foreground mb-2">Preview:</div>
              {renderBlockPreview(block)}
            </div>
            
            {/* Advanced Settings (shown when selected) */}
            {isSelected && (
              <div className="border-t pt-4 space-y-4">
                <h4 className="text-sm font-medium text-muted-foreground">Advanced Settings</h4>
                {renderBlockSettings(block)}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  // Render inline controls for quick editing
  const renderInlineControls = (block: ContentBlock) => {
    return (
      <div className="space-y-3">
        {/* Text Content Input (for blocks with text) */}
        {(block.type.includes('text') || block.type.includes('image')) && block.type !== 'full-width-image' && (
          <div>
            <Label className="text-xs font-medium">Text Content</Label>
            <Textarea
              defaultValue={block.content.text || ''}
              onChange={(e) => updateBlock(block.id, { text: e.target.value })}
              placeholder="Enter your text content here..."
              className="mt-1 min-h-[80px]"
              data-testid={block.type === 'left-image-right-text' ? 'image-left-text' : 
                          block.type === 'right-image-left-text' ? 'image-right-text' : 
                          'text-block-content'}
            />
          </div>
        )}

        {/* Image URL Input (for blocks with images) */}
        {(block.type.includes('image') || block.type === 'image-caption') && block.type !== 'video-embed' && (
          <div>
            <Label className="text-xs font-medium">Image</Label>
            <div className="mt-1 space-y-2">
              {/* URL Input */}
              <div className="flex gap-2">
                <Input
                  value={block.content.imageUrl || ''}
                  onChange={(e) => updateBlock(block.id, { imageUrl: e.target.value })}
                  placeholder="Paste image URL or upload below"
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => updateBlock(block.id, { imageUrl: '' })}
                  className="px-2"
                >
                  <Link className="w-3 h-3" />
                </Button>
              </div>
              {/* Upload Button */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Or:</span>
                <FileUploadButton
                  acceptedTypes="image"
                  onUploadComplete={(url) => updateBlock(block.id, { imageUrl: url })}
                  variant="outline"
                  size="sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Video URL Input (for video blocks) */}
        {block.type === 'video-embed' && (
          <div>
            <Label className="text-xs font-medium">Video URL</Label>
            <Input
              value={block.content.videoUrl || ''}
              onChange={(e) => updateBlock(block.id, { videoUrl: e.target.value })}
              placeholder="Paste video embed URL..."
              className="mt-1"
            />
            {/* Upload Button */}
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs text-muted-foreground">Or:</span>
              <FileUploadButton
                acceptedTypes="video"
                onUploadComplete={(url) => updateBlock(block.id, { videoUrl: url })}
                variant="outline"
                size="sm"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              For YouTube videos, use embed URL: https://www.youtube.com/embed/VIDEO_ID
            </p>
          </div>
        )}

        {/* Caption Input (for caption blocks) */}
        {(block.type === 'image-caption' || block.type === 'full-width-image') && (
          <div>
            <Label className="text-xs font-medium">Caption</Label>
            <Input
              value={block.content.caption || ''}
              onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
              placeholder="Enter image caption..."
              className="mt-1"
            />
          </div>
        )}

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedBlockId(selectedBlockId === block.id ? null : block.id)}
            className="text-xs"
          >
            {selectedBlockId === block.id ? 'Hide Advanced' : 'Show Advanced'}
          </Button>
          <div className="flex items-center gap-1 ml-auto">
            <Label className="text-xs">Width:</Label>
            <Input
              type="number"
              min={20}
              max={100}
              defaultValue={block.content.width}
              onChange={(e) => {
                const raw = e.target.value;
                const parsed = Number(raw);
                if (!Number.isNaN(parsed)) {
                  updateBlock(block.id, { width: parsed });
                } else if (raw === '') {
                  // allow clearing while typing; notify parent with undefined
                  updateBlock(block.id, { width: undefined as any });
                }
              }}
              className="w-16 h-7 text-xs"
            />
            <span className="text-xs text-muted-foreground">%</span>
          </div>
        </div>
      </div>
    );
  };

  // Clean, minimal preview renderer
  const renderBlockPreview = (block: ContentBlock) => {
      const content = block.content || ({} as ContentBlock['content']);
      const widthStyle = { width: `${content.width ?? 100}%` };

      switch (block.type) {
        case 'left-image-right-text':
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className="order-1">
                {content.imageUrl ? (
                  <img src={content.imageUrl} alt="" className="w-full h-48 object-cover rounded-lg" style={widthStyle} />
                ) : (
                  <div className="w-full h-48 bg-muted/50 rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className={cn('order-2', `text-${content.alignment || 'center'}`)}>
                <div style={{ color: content.textColor }}>{content.text || 'Add your text content here...'}</div>
              </div>
            </div>
          );

        case 'right-image-left-text':
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <div className={cn('order-1', `text-${content.alignment || 'center'}`)}>
                <div style={{ color: content.textColor }}>{content.text || 'Add your text content here...'}</div>
              </div>
              <div className="order-2">
                {content.imageUrl ? (
                  <img src={content.imageUrl} alt="" className="w-full h-48 object-cover rounded-lg" style={widthStyle} />
                ) : (
                  <div className="w-full h-48 bg-muted/50 rounded-lg flex items-center justify-center">
                    <Image className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          );

        case 'full-width-image':
          return (
            <div className={cn(`text-${content.alignment || 'center'}`)}>
              {content.imageUrl ? (
                <img src={content.imageUrl} alt="" className="w-full h-64 object-cover rounded-lg" style={widthStyle} />
              ) : (
                <div className="w-full h-64 bg-muted/50 rounded-lg flex items-center justify-center">
                  <Image className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              {content.caption && <p className="text-sm text-muted-foreground mt-2">{content.caption}</p>}
            </div>
          );

        case 'full-width-text':
          return (
            <div className={cn(`text-${content.alignment || 'center'}`)}>
              <div style={{ color: content.textColor }}>{content.text || 'Add your full-width text content here...'}</div>
            </div>
          );

        case 'image-caption':
          return (
            <div className={cn(`text-${content.alignment || 'center'}`)}>
              {content.imageUrl ? (
                <img src={content.imageUrl} alt="" className="w-full h-48 object-cover rounded-lg" style={widthStyle} />
              ) : (
                <div className="w-full h-48 bg-muted/50 rounded-lg flex items-center justify-center">
                  <Image className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              {content.caption && <p className="text-sm text-muted-foreground mt-2">{content.caption}</p>}
            </div>
          );

        case 'video-embed':
          return (
            <div className={cn(`text-${content.alignment || 'center'}`)}>
              <div className="aspect-video mx-auto overflow-hidden rounded-lg shadow-lg" style={widthStyle}>
                {content.videoUrl ? (
                  content.videoUrl.includes('youtube') || content.videoUrl.includes('vimeo') ? (
                    <iframe src={content.videoUrl} className="w-full h-full" allowFullScreen />
                  ) : (
                    <video src={content.videoUrl} className="w-full h-full object-cover" controls />
                  )
                ) : (
                  <div className="w-full h-full bg-muted/50 flex items-center justify-center">
                    <Video className="w-12 h-12 text-muted-foreground" />
                  </div>
                )}
              </div>
            </div>
          );

        case 'table':
          return (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-muted">
                <thead>
                  <tr>
                    {(content.tableData?.headers || []).map((header, i) => (
                      <th key={i} className="border border-muted p-3 bg-muted/50 text-left font-semibold">{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(content.tableData?.rows || []).map((row, i) => (
                    <tr key={i}>{row.map((cell, j) => <td key={j} className="border border-muted p-3">{cell}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          );

        case 'chart':
          return (
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">{content.chartData?.title || 'Chart'}</h3>
              <div className="bg-muted/20 p-6 rounded-lg">
                <p className="text-muted-foreground">Chart Preview: {content.chartData?.type}</p>
              </div>
            </div>
          );

        default:
          return <div>Unknown block type</div>;
      }
    };

  // Render block settings
  const renderBlockSettings = (block: ContentBlock) => {
    return (
      <div className="space-y-4">
        {/* Common settings */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Alignment</Label>
            <Select 
              value={block.content.alignment} 
              onValueChange={(value) => updateBlock(block.id, { alignment: value as any })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Left</SelectItem>
                <SelectItem value="center">Center</SelectItem>
                <SelectItem value="right">Right</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(block.type.includes('image') || block.type === 'video-embed') && (
            <div>
              <Label>Width (%)</Label>
              <Slider
                value={[block.content.width || 100]}
                onValueChange={(value) => updateBlock(block.id, { width: value[0] })}
                min={20}
                max={100}
                step={5}
              />
              <div className="text-xs text-muted-foreground mt-1">
                {block.content.width}%
              </div>
            </div>
          )}
        </div>

        {/* Type-specific settings */}
        {(block.type.includes('text') || block.type.includes('image')) && (
          <>
            {block.type !== 'full-width-image' && (
              <div>
                <Label>Text Content</Label>
                <Textarea
                  defaultValue={block.content.text}
                  onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                  placeholder="Enter text content..."
                />
              </div>
            )}
          </>
        )}

        {(block.type.includes('image') && block.type !== 'video-embed') && (
          <>
            <div>
              <Label>Image URL</Label>
              <Input
                value={block.content.imageUrl}
                onChange={(e) => updateBlock(block.id, { imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={block.content.hasBorder}
                  onCheckedChange={(checked) => updateBlock(block.id, { hasBorder: checked })}
                />
                <Label>Border</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={block.content.hasShadow}
                  onCheckedChange={(checked) => updateBlock(block.id, { hasShadow: checked })}
                />
                <Label>Shadow</Label>
              </div>
            </div>

            {(block.type === 'image-caption' || block.type === 'full-width-image') && (
              <div>
                <Label>Caption</Label>
                <Input
                  value={block.content.caption}
                  onChange={(e) => updateBlock(block.id, { caption: e.target.value })}
                  placeholder="Image caption..."
                />
              </div>
            )}
          </>
        )}

        {block.type === 'video-embed' && (
          <div>
            <Label>Video URL</Label>
            <Input
              value={block.content.videoUrl}
              onChange={(e) => updateBlock(block.id, { videoUrl: e.target.value })}
              placeholder="https://www.youtube.com/embed/..."
            />
          </div>
        )}
      </div>
    );
  };

  // Render live preview
  const renderLivePreview = () => {
    return (
      <div className="bg-background p-8 rounded-lg border">
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          {value.featuredImage && (
            <img 
              src={value.featuredImage} 
              alt={value.title}
              className="w-full h-64 object-cover rounded-lg mb-8"
            />
          )}
          
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{value.title || 'Blog Title'}</h1>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>By {value.author || 'Author Name'}</span>
              <span>•</span>
              <span>{value.date || new Date().toLocaleDateString()}</span>
            </div>
          </header>

          {/* Content Blocks */}
          <div className="space-y-8">
            {value.blocks.map((block) => (
              <div key={block.id}>
                {renderBlockPreview(block)}
              </div>
            ))}
          </div>
        </article>
      </div>
    );
  };

  return (
    <div className={cn("drag-drop-blog-editor", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Monitor className="w-5 h-5" />
          <h3 className="text-lg font-semibold">Visual Blog Editor</h3>
          <Badge variant="secondary">Enhanced</Badge>

          {/* Basic meta inputs exposed for tests */}
          {showMetaControls && (
            <div className="ml-4 flex items-center gap-2">
              <Input
                aria-label="Editor Title"
                value={value.title}
                onChange={(e) => onChange({ ...value, title: e.target.value })}
                placeholder="Title"
                className="text-sm"
              />
              <Input
                aria-label="Editor Author"
                value={value.author}
                onChange={(e) => onChange({ ...value, author: e.target.value })}
                placeholder="Author"
                className="text-sm"
              />
              <Input
                aria-label="Editor Date"
                value={value.date}
                onChange={(e) => onChange({ ...value, date: e.target.value })}
                placeholder="YYYY-MM-DD"
                className="text-sm"
              />
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={isPreviewMode ? "default" : "outline"}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            size="sm"
            aria-label="Toggle preview mode"
          >
            {isPreviewMode ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            <span className="sr-only">Toggle preview mode</span>
            {isPreviewMode ? 'Edit' : 'Preview'}
          </Button>
          
          {!isPreviewMode && (
            <Dialog open={showBlockSelector} onOpenChange={setShowBlockSelector}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Content Block
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Content Block</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4">
                {blockTypes.map((blockType) => (
                  <Button
                    key={blockType.type}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-start gap-2"
                    onClick={() => addBlock(blockType.type)}
                  >
                    <div className="flex items-center gap-2">
                      <blockType.icon className="w-5 h-5" />
                      <span className="font-medium">{blockType.name}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {blockType.description}
                    </span>
                  </Button>
                ))}
              </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>

      {isPreviewMode ? (
        renderLivePreview()
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="blocks">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {value.blocks.map((block, index) => (
                  <Draggable key={block.id} draggableId={block.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn(
                          "mb-4",
                          snapshot?.isDragging && "opacity-50"
                        )}
                      >
                        {renderBlockEditor(block)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
                
                {value.blocks.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No content blocks yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start building your blog by adding content blocks
                    </p>
                    <Button onClick={() => setShowBlockSelector(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Block
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default DragDropBlogEditor;