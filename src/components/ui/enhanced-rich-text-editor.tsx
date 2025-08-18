import React, { useMemo, useRef, useState, useCallback } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  Image, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Type,
  Palette,
  Undo,
  Redo,
  Eye,
  EyeOff,
  Maximize,
  Minimize,
  Save,
  Download,
  FileText,
  Zap
} from 'lucide-react';

interface EnhancedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  showToolbar?: boolean;
  showWordCount?: boolean;
  showPreview?: boolean;
  autoSave?: boolean;
  onSave?: (content: string) => void;
  height?: string;
}

const EnhancedRichTextEditor: React.FC<EnhancedRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your amazing content...",
  className,
  showToolbar = true,
  showWordCount = true,
  showPreview = true,
  autoSave = false,
  onSave,
  height = "400px"
}) => {
  const quillRef = useRef<ReactQuill>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  // Enhanced toolbar configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        // Text formatting
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
        
        // Font styling
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        
        // Paragraph formatting
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
        
        // Content blocks
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        
        // Advanced features
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'direction': 'rtl' }],
        
        // Utilities
        ['clean', 'undo', 'redo']
      ],
      handlers: {
        'undo': function() {
          this.quill.history.undo();
        },
        'redo': function() {
          this.quill.history.redo();
        }
      }
    },
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: false
    },
    clipboard: {
      matchVisual: false,
    }
  }), []);

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script', 'align', 'direction',
    'list', 'bullet', 'indent',
    'link', 'image', 'video', 'blockquote', 'code-block'
  ];

  // Handle content change
  const handleChange = useCallback((content: string, delta: any, source: any, editor: any) => {
    onChange(content);
    
    // Update word and character count
    const text = editor.getText();
    const words = text.trim().split(/\s+/).filter((word: string) => word.length > 0);
    setWordCount(words.length);
    setCharCount(text.length);

    // Auto-save functionality
    if (autoSave && onSave && source === 'user') {
      const timeoutId = setTimeout(() => {
        onSave(content);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [onChange, autoSave, onSave]);

  // Export content as HTML
  const exportAsHTML = () => {
    const blob = new Blob([value], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'content.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Export content as plain text
  const exportAsText = () => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const text = quill.getText();
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'content.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  // Quick action buttons
  const quickActions = [
    { icon: Bold, action: () => quillRef.current?.getEditor().format('bold', true), label: 'Bold' },
    { icon: Italic, action: () => quillRef.current?.getEditor().format('italic', true), label: 'Italic' },
    { icon: Underline, action: () => quillRef.current?.getEditor().format('underline', true), label: 'Underline' },
    { icon: Link, action: () => {
      const url = prompt('Enter URL:');
      if (url) quillRef.current?.getEditor().format('link', url);
    }, label: 'Link' },
    { icon: List, action: () => quillRef.current?.getEditor().format('list', 'bullet'), label: 'Bullet List' },
    { icon: ListOrdered, action: () => quillRef.current?.getEditor().format('list', 'ordered'), label: 'Numbered List' },
    { icon: Quote, action: () => quillRef.current?.getEditor().format('blockquote', true), label: 'Quote' },
    { icon: Code, action: () => quillRef.current?.getEditor().format('code-block', true), label: 'Code Block' },
  ];

  const editorStyle = {
    height: isFullscreen ? 'calc(100vh - 200px)' : height
  };

  return (
    <div className={cn(
      "enhanced-rich-text-editor",
      isFullscreen && "fixed inset-0 z-50 bg-background p-4",
      className
    )}>
      <Card className="border border-muted shadow-lg overflow-hidden">
        {/* Enhanced Header with gradient */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-semibold">Rich Text Editor</span>
                  {autoSave && (
                    <Badge variant="secondary" className="text-xs ml-2">
                      Auto-save
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {showWordCount && (
                <div className="flex items-center space-x-4 text-sm text-muted-foreground bg-background/50 px-3 py-1 rounded-lg">
                  <div className="flex items-center space-x-1">
                    <Type className="w-3 h-3" />
                    <span className="font-medium">{wordCount}</span>
                    <span className="text-xs">words</span>
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                  <div className="flex items-center space-x-1">
                    <span className="font-medium">{charCount}</span>
                    <span className="text-xs">chars</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                {showPreview && (
                  <Button
                    variant={isPreviewMode ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                    className="h-8"
                  >
                    {isPreviewMode ? (
                      <>
                        <EyeOff className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Edit</span>
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-1" />
                        <span className="hidden sm:inline">Preview</span>
                      </>
                    )}
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="h-8"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>
                
                {onSave && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSave(value)}
                    className="h-8 text-primary hover:text-primary/80"
                  >
                    <Save className="w-4 h-4" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={exportAsHTML}
                  title="Export as HTML"
                  className="h-8"
                >
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Quick Actions Bar */}
        {showToolbar && (
          <div className="bg-muted/30 border-b">
            <div className="flex items-center justify-between p-3">
              <div className="flex items-center space-x-1">
                <span className="text-xs font-medium text-muted-foreground mr-3">Quick Actions:</span>
                {quickActions.slice(0, 6).map((action, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={action.action}
                    title={action.label}
                    className="h-8 w-8 p-0 hover:bg-primary/10 hover:text-primary"
                  >
                    <action.icon className="w-3.5 h-3.5" />
                  </Button>
                ))}
                
                <Separator orientation="vertical" className="h-6 mx-2" />
                
                <div className="flex items-center space-x-1">
                  {[1, 2, 3].map((level) => (
                    <Button
                      key={level}
                      variant="ghost"
                      size="sm"
                      onClick={() => quillRef.current?.getEditor().format('header', level)}
                      className="h-8 px-2 text-xs font-medium hover:bg-primary/10"
                    >
                      H{level}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (quillRef.current?.getEditor() as any)?.history?.undo()}
                  title="Undo (Ctrl+Z)"
                  className="h-8 w-8 p-0"
                >
                  <Undo className="w-3.5 h-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => (quillRef.current?.getEditor() as any)?.history?.redo()}
                  title="Redo (Ctrl+Y)"
                  className="h-8 w-8 p-0"
                >
                  <Redo className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Editor Content with enhanced styling */}
        <div className="relative bg-background">
          {isPreviewMode ? (
            <div className="p-6">
              <div className="max-w-none prose prose-sm dark:prose-invert">
                <div 
                  style={{ minHeight: height }}
                  dangerouslySetInnerHTML={{ __html: value || '<p className="text-muted-foreground italic">Start writing to see preview...</p>' }}
                />
              </div>
            </div>
          ) : (
            <div style={editorStyle} className="overflow-hidden">
              <style>{`
                .ql-editor {
                  padding: 1.5rem !important;
                  font-size: 14px !important;
                  line-height: 1.6 !important;
                  color: hsl(var(--foreground)) !important;
                }
                .ql-editor.ql-blank::before {
                  color: hsl(var(--muted-foreground)) !important;
                  font-style: italic !important;
                }
                .ql-toolbar {
                  border: none !important;
                  border-bottom: 1px solid hsl(var(--border)) !important;
                  background: hsl(var(--muted)/0.3) !important;
                }
                .ql-formats {
                  margin-right: 15px !important;
                }
                .ql-picker-label {
                  color: hsl(var(--foreground)) !important;
                }
                .ql-stroke {
                  stroke: hsl(var(--foreground)) !important;
                }
                .ql-fill {
                  fill: hsl(var(--foreground)) !important;
                }
                .ql-active .ql-stroke {
                  stroke: hsl(var(--primary)) !important;
                }
                .ql-active .ql-fill {
                  fill: hsl(var(--primary)) !important;
                }
              `}</style>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                className="border-none h-full"
              />
            </div>
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="bg-muted/20 border-t">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Ready to write</span>
              </div>
              <Separator orientation="vertical" className="h-3" />
              <span>Ctrl+S to save</span>
              <span>•</span>
              <span>Ctrl+Z/Y for undo/redo</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={exportAsText}
                className="h-6 px-2 text-xs hover:bg-muted"
              >
                <FileText className="w-3 h-3 mr-1" />
                Export TXT
              </Button>
              <Separator orientation="vertical" className="h-4" />
              <div className="text-xs text-muted-foreground">
                {isPreviewMode ? 'Preview Mode' : 'Edit Mode'}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedRichTextEditor;