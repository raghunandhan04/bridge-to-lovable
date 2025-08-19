import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Zap,
  Table,
  BarChart3,
  PieChart,
  LineChart,
  Plus,
  Trash2,
  Edit3,
  Settings
} from 'lucide-react';

// Register Quill modules for tables (conditional registration to prevent errors)
let TableBetter;
try {
  TableBetter = require('quill-better-table');
  if (TableBetter && TableBetter.TableModule) {
    Quill.register('modules/better-table', TableBetter.TableModule);
  }
} catch (error) {
  console.warn('Failed to load quill-better-table:', error);
}

interface AdvancedRichTextEditorProps {
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

interface ChartData {
  type: 'pie' | 'bar' | 'line';
  title: string;
  labels: string[];
  data: number[];
  colors?: string[];
}

const AdvancedRichTextEditor: React.FC<AdvancedRichTextEditorProps> = ({
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
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [showChartDialog, setShowChartDialog] = useState(false);
  
  // Table creation state
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  
  // Chart creation state
  const [chartData, setChartData] = useState<ChartData>({
    type: 'pie',
    title: 'Sample Chart',
    labels: ['Label 1', 'Label 2', 'Label 3'],
    data: [10, 20, 30],
    colors: ['#3b82f6', '#ef4444', '#10b981']
  });

  // Enhanced toolbar configuration with tables and charts
  const modules = useMemo(() => ({
    'better-table': {
      operationMenu: {
        items: {
          unmergeCells: {
            text: 'Another unmerge cells name'
          }
        },
        color: {
          colors: ['green', 'red', 'yellow', 'blue', 'white'],
          text: 'Background Colors:'
        }
      }
    },
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
        
        // Custom additions
        ['insertTable', 'insertChart'],
        
        // Utilities
        ['clean', 'undo', 'redo']
      ],
      handlers: {
        'undo': function() {
          this.quill.history.undo();
        },
        'redo': function() {
          this.quill.history.redo();
        },
        'insertTable': () => {
          setShowTableDialog(true);
        },
        'insertChart': () => {
          setShowChartDialog(true);
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
    'link', 'image', 'video', 'blockquote', 'code-block',
    'table', 'table-cell-line', 'table-cell'
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

  // Insert table
  const insertTable = () => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const tableModule = quill.getModule('better-table');
      tableModule.insertTable(tableRows, tableCols);
      setShowTableDialog(false);
    }
  };

  // Insert chart
  const insertChart = () => {
    const chartHtml = generateChartHtml(chartData);
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const range = quill.getSelection();
      quill.insertEmbed(range?.index || 0, 'chart', chartHtml);
      setShowChartDialog(false);
    }
  };

  // Generate chart HTML
  const generateChartHtml = (data: ChartData) => {
    const chartId = `chart-${Math.random().toString(36).substr(2, 9)}`;
    
    return `
      <div class="chart-container" style="width: 100%; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb;">
        <h3 style="text-align: center; margin-bottom: 20px; color: #374151;">${data.title}</h3>
        <div class="chart-placeholder" data-chart-type="${data.type}" data-chart-data='${JSON.stringify(data)}' style="height: 300px; display: flex; align-items: center; justify-content: center; background: #ffffff; border-radius: 4px; border: 2px dashed #d1d5db;">
          <div style="text-align: center; color: #6b7280;">
            <div style="font-size: 48px; margin-bottom: 10px;">📊</div>
            <div>${data.type.toUpperCase()} Chart: ${data.title}</div>
            <div style="font-size: 12px; margin-top: 5px;">Data: ${data.labels.join(', ')}</div>
          </div>
        </div>
      </div>
    `;
  };

  // Update chart data
  const updateChartData = (field: keyof ChartData, value: any) => {
    setChartData(prev => ({ ...prev, [field]: value }));
  };

  // Add new data point to chart
  const addDataPoint = () => {
    setChartData(prev => ({
      ...prev,
      labels: [...prev.labels, `Label ${prev.labels.length + 1}`],
      data: [...prev.data, 0]
    }));
  };

  // Remove data point from chart
  const removeDataPoint = (index: number) => {
    setChartData(prev => ({
      ...prev,
      labels: prev.labels.filter((_, i) => i !== index),
      data: prev.data.filter((_, i) => i !== index)
    }));
  };

  // Update individual data point
  const updateDataPoint = (index: number, field: 'label' | 'value', value: string | number) => {
    setChartData(prev => {
      const newData = { ...prev };
      if (field === 'label') {
        newData.labels[index] = value as string;
      } else {
        newData.data[index] = Number(value);
      }
      return newData;
    });
  };

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

  // Enhanced quick action buttons
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
    { icon: Table, action: () => setShowTableDialog(true), label: 'Insert Table' },
    { icon: BarChart3, action: () => setShowChartDialog(true), label: 'Insert Chart' },
  ];

  const editorStyle = {
    height: isFullscreen ? 'calc(100vh - 250px)' : height
  };

  return (
    <div className={cn(
      "advanced-rich-text-editor",
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
                  <span className="text-sm font-semibold">Advanced Editor</span>
                  <div className="flex items-center space-x-1 mt-0.5">
                    <Badge variant="secondary" className="text-xs">
                      Tables
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      Charts
                    </Badge>
                    {autoSave && (
                      <Badge variant="secondary" className="text-xs">
                        Auto-save
                      </Badge>
                    )}
                  </div>
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
                {quickActions.slice(0, 8).map((action, index) => (
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
                <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Table className="w-4 h-4 mr-1" />
                      Table
                    </Button>
                  </DialogTrigger>
                </Dialog>
                
                <Dialog open={showChartDialog} onOpenChange={setShowChartDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Chart
                    </Button>
                  </DialogTrigger>
                </Dialog>
                
                <Separator orientation="vertical" className="h-6" />
                
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
                .ql-better-table {
                  border-collapse: collapse;
                  width: 100%;
                }
                .ql-better-table td, .ql-better-table th {
                  border: 1px solid hsl(var(--border));
                  padding: 8px;
                }
                .chart-container {
                  margin: 20px 0;
                  padding: 20px;
                  border: 1px solid hsl(var(--border));
                  border-radius: 8px;
                  background: hsl(var(--muted)/0.1);
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
                <span>Advanced Editor Ready</span>
              </div>
              <Separator orientation="vertical" className="h-3" />
              <span>Ctrl+S to save</span>
              <span>•</span>
              <span>Tables & Charts enabled</span>
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

      {/* Table Insert Dialog */}
      <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Table className="w-5 h-5" />
              <span>Insert Table</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rows">Rows</Label>
                <Input
                  id="rows"
                  type="number"
                  min="1"
                  max="20"
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                />
              </div>
              <div>
                <Label htmlFor="cols">Columns</Label>
                <Input
                  id="cols"
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowTableDialog(false)}>
                Cancel
              </Button>
              <Button onClick={insertTable}>
                Insert Table
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Chart Insert Dialog */}
      <Dialog open={showChartDialog} onOpenChange={setShowChartDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <BarChart3 className="w-5 h-5" />
              <span>Insert Chart</span>
            </DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="config" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            <TabsContent value="config" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="chart-type">Chart Type</Label>
                  <Select value={chartData.type} onValueChange={(value: 'pie' | 'bar' | 'line') => updateChartData('type', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pie">
                        <div className="flex items-center space-x-2">
                          <PieChart className="w-4 h-4" />
                          <span>Pie Chart</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="bar">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="w-4 h-4" />
                          <span>Bar Chart</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="line">
                        <div className="flex items-center space-x-2">
                          <LineChart className="w-4 h-4" />
                          <span>Line Chart</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="chart-title">Chart Title</Label>
                  <Input
                    id="chart-title"
                    value={chartData.title}
                    onChange={(e) => updateChartData('title', e.target.value)}
                    placeholder="Enter chart title"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label>Data Points</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addDataPoint}
                    className="h-8"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {chartData.labels.map((label, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={label}
                        onChange={(e) => updateDataPoint(index, 'label', e.target.value)}
                        placeholder={`Label ${index + 1}`}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={chartData.data[index]}
                        onChange={(e) => updateDataPoint(index, 'value', e.target.value)}
                        placeholder="Value"
                        className="w-24"
                      />
                      {chartData.labels.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeDataPoint(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="preview">
              <div className="border rounded-lg p-4 bg-muted/10">
                <div dangerouslySetInnerHTML={{ __html: generateChartHtml(chartData) }} />
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowChartDialog(false)}>
              Cancel
            </Button>
            <Button onClick={insertChart}>
              Insert Chart
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdvancedRichTextEditor;