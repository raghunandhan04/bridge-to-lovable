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
      <Card className="border-none shadow-lg">
        {/* Header with actions */}
        <div className="flex items-center justify-between p-3 border-b bg-muted/50">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Enhanced Editor</span>
            {autoSave && (
              <Badge variant="secondary" className="text-xs">
                Auto-save enabled
              </Badge>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {showWordCount && (
              <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                <span>{wordCount} words</span>
                <span>{charCount} characters</span>
              </div>
            )}
            
            <Separator orientation="vertical" className="h-4" />
            
            {showPreview && (
              <Button
                variant={isPreviewMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsPreviewMode(!isPreviewMode)}
              >
                {isPreviewMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFullscreen(!isFullscreen)}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </Button>
            
            {onSave && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSave(value)}
              >
                <Save className="w-4 h-4" />
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={exportAsHTML}
            >
              <Download className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Quick Actions Bar */}
        {showToolbar && (
          <div className="flex items-center space-x-1 p-2 border-b bg-background/50">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={action.action}
                title={action.label}
                className="h-8 w-8 p-0"
              >
                <action.icon className="w-3.5 h-3.5" />
              </Button>
            ))}
            
            <Separator orientation="vertical" className="h-6 mx-2" />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => quillRef.current?.getEditor().format('header', 1)}
              className="h-8 px-2 text-xs"
            >
              H1
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => quillRef.current?.getEditor().format('header', 2)}
              className="h-8 px-2 text-xs"
            >
              H2
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => quillRef.current?.getEditor().format('header', 3)}
              className="h-8 px-2 text-xs"
            >
              H3
            </Button>
          </div>
        )}

        {/* Editor Content */}
        <div className="relative">
          {isPreviewMode ? (
            <div 
              className="p-4 prose prose-sm max-w-none"
              style={{ minHeight: height }}
              dangerouslySetInnerHTML={{ __html: value }}
            />
          ) : (
            <div style={editorStyle}>
              <ReactQuill
                ref={quillRef}
                theme="snow"
                value={value}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                className="border-none"
                style={{ height: '100%' }}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-3 border-t bg-muted/30 text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Press Ctrl+S to save</span>
            <span>Press Ctrl+Z to undo</span>
            <span>Press Ctrl+Y to redo</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={exportAsText}
              className="h-6 px-2 text-xs"
            >
              <FileText className="w-3 h-3 mr-1" />
              Export TXT
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EnhancedRichTextEditor;