import React, { useMemo, useRef, useState, useCallback, useEffect } from 'react';
import ReactQuill from 'react-quill';
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
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Type,
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
  Trash2
} from 'lucide-react';

interface AdvancedRichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  height?: string;
}

const AdvancedRichTextEditor: React.FC<AdvancedRichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing your amazing content...",
  className,
  height = "400px"
}) => {
  console.log('AdvancedRichTextEditor rendering'); // Debug log

  const quillRef = useRef<ReactQuill>(null);
  // State must be declared before being referenced anywhere (including dependency arrays)
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  useEffect(() => {
    const editor = quillRef.current?.getEditor?.();
    const root: HTMLElement | undefined = editor?.root;
    if (root) {
      root.setAttribute('role', 'textbox');
      root.setAttribute('aria-label', 'Content');
    }
    // Run once on mount; no dependency on isPreviewMode is required for accessibility attrs
  }, []);
  
  // Table dialog state
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  
  // Chart dialog state
  const [showChartDialog, setShowChartDialog] = useState(false);
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'line'>('pie');
  const [chartData, setChartData] = useState({
    labels: ['Data 1', 'Data 2', 'Data 3'],
    data: [30, 40, 30]
  });

  // Enhanced toolbar configuration
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }, { 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'align': [] }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        ['clean']
      ]
    },
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: false
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
  }, [onChange]);

  // Generate table HTML
  const generateTableHtml = (rows: number, cols: number) => {
    let tableHtml = '<table style="width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #e5e7eb;">';
    
    // Create header row
    tableHtml += '<tr>';
    for (let j = 0; j < cols; j++) {
      tableHtml += `<th style="border: 1px solid #e5e7eb; padding: 12px; background-color: #f9fafb; font-weight: 600;">Header ${j + 1}</th>`;
    }
    tableHtml += '</tr>';
    
    // Create data rows
    for (let i = 1; i < rows; i++) {
      tableHtml += '<tr>';
      for (let j = 0; j < cols; j++) {
        tableHtml += `<td style="border: 1px solid #e5e7eb; padding: 12px;">Cell ${i + 1}-${j + 1}</td>`;
      }
      tableHtml += '</tr>';
    }
    
    tableHtml += '</table>';
    return tableHtml;
  };

  // Generate chart HTML
  const generateChartHtml = (data: typeof chartData) => {
    const chartId = `chart-${Date.now()}`;
    const maxValue = Math.max(...data.data);
    
    if (chartType === 'pie') {
      const total = data.data.reduce((sum, val) => sum + val, 0);
      let currentAngle = 0;
      const segments = data.data.map((value, index) => {
        const percentage = (value / total) * 100;
        const angle = (value / total) * 360;
        const x1 = 50 + 40 * Math.cos((currentAngle - 90) * Math.PI / 180);
        const y1 = 50 + 40 * Math.sin((currentAngle - 90) * Math.PI / 180);
        const x2 = 50 + 40 * Math.cos((currentAngle + angle - 90) * Math.PI / 180);
        const y2 = 50 + 40 * Math.sin((currentAngle + angle - 90) * Math.PI / 180);
        const largeArc = angle > 180 ? 1 : 0;
        
        const path = `M 50,50 L ${x1},${y1} A 40,40 0 ${largeArc},1 ${x2},${y2} z`;
        const color = `hsl(${(index * 360 / data.data.length)}, 70%, 60%)`;
        
        currentAngle += angle;
        return `<path d="${path}" fill="${color}" stroke="white" stroke-width="2"/>`;
      }).join('');
      
      return `
        <div class="chart-container" style="margin: 20px 0; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb;">
          <h3 style="text-align: center; margin-bottom: 15px; font-weight: 600;">Pie Chart</h3>
          <div style="display: flex; align-items: center; justify-content: center; gap: 20px;">
            <svg width="200" height="200" viewBox="0 0 100 100">
              ${segments}
            </svg>
            <div style="display: flex; flex-direction: column; gap: 8px;">
              ${data.labels.map((label, i) => `
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 16px; height: 16px; background: hsl(${(i * 360 / data.data.length)}, 70%, 60%); border-radius: 2px;"></div>
                  <span style="font-size: 14px;">${label}: ${data.data[i]}</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      `;
    } else if (chartType === 'bar') {
      const bars = data.data.map((value, index) => {
        const height = (value / maxValue) * 150;
        const x = index * 60 + 30;
        const color = `hsl(${(index * 360 / data.data.length)}, 70%, 60%)`;
        
        return `
          <rect x="${x}" y="${170 - height}" width="40" height="${height}" fill="${color}" rx="2"/>
          <text x="${x + 20}" y="185" text-anchor="middle" style="font-size: 12px; fill: #666;">${data.labels[index]}</text>
          <text x="${x + 20}" y="${165 - height}" text-anchor="middle" style="font-size: 11px; fill: #333;">${value}</text>
        `;
      }).join('');
      
      return `
        <div class="chart-container" style="margin: 20px 0; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb;">
          <h3 style="text-align: center; margin-bottom: 15px; font-weight: 600;">Bar Chart</h3>
          <svg width="${Math.max(300, data.data.length * 60 + 60)}" height="200" style="display: block; margin: 0 auto;">
            ${bars}
          </svg>
        </div>
      `;
    } else {
      // Line chart
      const points = data.data.map((value, index) => {
        const x = (index / (data.data.length - 1)) * 250 + 25;
        const y = 150 - (value / maxValue) * 120;
        return `${x},${y}`;
      }).join(' ');
      
      const dots = data.data.map((value, index) => {
        const x = (index / (data.data.length - 1)) * 250 + 25;
        const y = 150 - (value / maxValue) * 120;
        return `<circle cx="${x}" cy="${y}" r="4" fill="hsl(220, 70%, 60%)" stroke="white" stroke-width="2"/>`;
      }).join('');
      
      return `
        <div class="chart-container" style="margin: 20px 0; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb;">
          <h3 style="text-align: center; margin-bottom: 15px; font-weight: 600;">Line Chart</h3>
          <svg width="300" height="180" style="display: block; margin: 0 auto;">
            <polyline points="${points}" fill="none" stroke="hsl(220, 70%, 60%)" stroke-width="3"/>
            ${dots}
            ${data.labels.map((label, i) => {
              const x = (i / (data.data.length - 1)) * 250 + 25;
              return `<text x="${x}" y="170" text-anchor="middle" style="font-size: 12px; fill: #666;">${label}</text>`;
            }).join('')}
          </svg>
        </div>
      `;
    }
  };

  // Insert table
  const insertTable = () => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const tableHtml = generateTableHtml(tableRows, tableCols);
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      quill.clipboard.dangerouslyPasteHTML(index, tableHtml);
      setShowTableDialog(false);
    }
  };

  // Insert chart
  const insertChart = () => {
    const quill = quillRef.current?.getEditor();
    if (quill) {
      const chartHtml = generateChartHtml(chartData);
      const range = quill.getSelection();
      const index = range ? range.index : quill.getLength();
      quill.clipboard.dangerouslyPasteHTML(index, chartHtml);
      setShowChartDialog(false);
    }
  };

  // Update chart data
  const updateDataPoint = (index: number, type: 'label' | 'value', value: string) => {
    setChartData(prev => {
      const newData = { ...prev };
      if (type === 'label') {
        newData.labels[index] = value;
      } else {
        newData.data[index] = parseInt(value) || 0;
      }
      return newData;
    });
  };

  // Add data point
  const addDataPoint = () => {
    setChartData(prev => ({
      labels: [...prev.labels, `Data ${prev.labels.length + 1}`],
      data: [...prev.data, 0]
    }));
  };

  // Remove data point
  const removeDataPoint = (index: number) => {
    setChartData(prev => ({
      labels: prev.labels.filter((_, i) => i !== index),
      data: prev.data.filter((_, i) => i !== index)
    }));
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
      "advanced-rich-text-editor",
      isFullscreen && "fixed inset-0 z-50 bg-background p-4",
      className
    )}>
      <Card className="border border-muted shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/5 to-primary/10 border-b">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <span className="text-sm font-semibold">Advanced Rich Text Editor</span>
                  <Badge variant="secondary" className="text-xs ml-2">
                    Enhanced
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
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
              
              <div className="flex items-center space-x-1">
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
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="h-8"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </Button>
                
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

        {/* Enhanced Toolbar */}
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
              {/* Table Button */}
              <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <Table className="w-4 h-4 mr-1" />
                    Table
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Insert Table</DialogTitle>
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
              
              {/* Chart Button */}
              <Dialog open={showChartDialog} onOpenChange={setShowChartDialog}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <BarChart3 className="w-4 h-4 mr-1" />
                    Chart
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Insert Chart</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div>
                      <Label>Chart Type</Label>
                      <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pie">
                            <div className="flex items-center gap-2">
                              <PieChart className="w-4 h-4" />
                              Pie Chart
                            </div>
                          </SelectItem>
                          <SelectItem value="bar">
                            <div className="flex items-center gap-2">
                              <BarChart3 className="w-4 h-4" />
                              Bar Chart
                            </div>
                          </SelectItem>
                          <SelectItem value="line">
                            <div className="flex items-center gap-2">
                              <LineChart className="w-4 h-4" />
                              Line Chart
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <Label>Data Points</Label>
                        <Button variant="outline" size="sm" onClick={addDataPoint}>
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
                    
                    <div>
                      <Label>Preview</Label>
                      <div className="border rounded-lg p-4 bg-muted/10">
                        <div dangerouslySetInnerHTML={{ __html: generateChartHtml(chartData) }} />
                      </div>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowChartDialog(false)}>
                        Cancel
                      </Button>
                      <Button onClick={insertChart}>
                        Insert Chart
                      </Button>
                    </div>
                  </div>
                </DialogContent>
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

        {/* Editor Content */}
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
                aria-label="Content"
                value={value}
                onChange={handleChange}
                modules={modules}
                formats={formats}
                placeholder={placeholder}
                className="border-none h-full"
                data-testid="quill-editor"
              />
            </div>
          )}
        </div>

        {/* Footer */}
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
              <span>Tables & Charts available</span>
            </div>
            
            <div className="flex items-center space-x-2">
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

export default AdvancedRichTextEditor;