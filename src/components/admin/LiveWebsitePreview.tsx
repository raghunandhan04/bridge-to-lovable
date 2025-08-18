import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useContentSections } from '@/hooks/useContentSections';
import { Monitor, Smartphone, Tablet, Edit, Save, X, Home, FileText, Phone, DollarSign, Package, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import all page components
import HomePage from '@/pages/Home';
import ProductsPage from '@/pages/Products';
import SolutionsPage from '@/pages/Solutions';
import PricingPage from '@/pages/Pricing';
import ContactPage from '@/pages/Contact';
import BlogPage from '@/pages/Blog';
import DocsPage from '@/pages/Docs';
import EnterprisePage from '@/pages/Enterprise';

interface ContentSection {
  id: string;
  section_key: string;
  title: string;
  content: string;
  image_url: string;
  data: any;
  section_type: string;
  page_path: string;
  display_order: number;
  visible: boolean;
}

interface EditableElement {
  sectionId: string;
  field: string;
  value: string;
  element: HTMLElement;
}

const LiveWebsitePreview = () => {
  const [currentPage, setCurrentPage] = useState('/');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingElement, setEditingElement] = useState<EditableElement | null>(null);
  const [editValue, setEditValue] = useState('');
  const [isTextarea, setIsTextarea] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { sections, refetch } = useContentSections();

  const pages = [
    { path: '/', name: 'Home', icon: Home, component: HomePage },
    { path: '/products', name: 'Products', icon: Package, component: ProductsPage },
    { path: '/solutions', name: 'Solutions', icon: Settings, component: SolutionsPage },
    { path: '/pricing', name: 'Pricing', icon: DollarSign, component: PricingPage },
    { path: '/contact', name: 'Contact', icon: Phone, component: ContactPage },
    { path: '/blog', name: 'Blog', icon: FileText, component: BlogPage },
    { path: '/docs', name: 'Docs', icon: FileText, component: DocsPage },
    { path: '/enterprise', name: 'Enterprise', icon: Settings, component: EnterprisePage },
  ];

  const deviceSizes = {
    desktop: 'w-full max-w-none',
    tablet: 'w-[768px] max-w-[768px]',
    mobile: 'w-[375px] max-w-[375px]'
  };

  useEffect(() => {
    if (isEditMode && previewRef.current) {
      attachEditListeners();
    }
    return () => {
      if (previewRef.current) {
        removeEditListeners();
      }
    };
  }, [isEditMode, currentPage, sections]);

  const attachEditListeners = () => {
    if (!previewRef.current) return;

    // First, handle existing sections with data-section-id
    const existingSections = previewRef.current.querySelectorAll('[data-section-id]');
    existingSections.forEach((element) => {
      const htmlElement = element as HTMLElement;
      attachElementListener(htmlElement);
    });

    // Then, add data attributes to common editable elements that don't have them
    const textElements = previewRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6, p:not([data-section-id])');
    textElements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      
      // Skip if already has data attributes or is inside a section that has them
      if (htmlElement.closest('[data-section-id]')) return;
      
      // Add temporary data attributes for editing
      htmlElement.setAttribute('data-temp-edit', 'true');
      htmlElement.setAttribute('data-temp-id', `temp-${index}`);
      htmlElement.setAttribute('data-field', htmlElement.tagName.toLowerCase().startsWith('h') ? 'title' : 'content');
      
      attachElementListener(htmlElement);
    });
  };

  const attachElementListener = (htmlElement: HTMLElement) => {
    htmlElement.style.cursor = 'pointer';
    htmlElement.style.outline = '2px dashed transparent';
    htmlElement.style.transition = 'outline-color 0.2s ease';
    
    const handleClick = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      handleElementClick(htmlElement);
    };

    const handleMouseEnter = () => {
      htmlElement.style.outlineColor = 'hsl(var(--primary))';
      htmlElement.style.backgroundColor = 'hsl(var(--primary) / 0.1)';
    };

    const handleMouseLeave = () => {
      htmlElement.style.outlineColor = 'transparent';
      htmlElement.style.backgroundColor = 'transparent';
    };

    htmlElement.addEventListener('click', handleClick);
    htmlElement.addEventListener('mouseenter', handleMouseEnter);
    htmlElement.addEventListener('mouseleave', handleMouseLeave);
    
    // Store event listeners for cleanup
    (htmlElement as any)._editListeners = {
      click: handleClick,
      mouseenter: handleMouseEnter,
      mouseleave: handleMouseLeave
    };
  };

  const removeEditListeners = () => {
    if (!previewRef.current) return;

    const allEditableElements = previewRef.current.querySelectorAll('[data-section-id], [data-temp-edit]');
    
    allEditableElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      const listeners = (htmlElement as any)._editListeners;
      
      if (listeners) {
        htmlElement.removeEventListener('click', listeners.click);
        htmlElement.removeEventListener('mouseenter', listeners.mouseenter);
        htmlElement.removeEventListener('mouseleave', listeners.mouseleave);
        delete (htmlElement as any)._editListeners;
      }

      htmlElement.style.cursor = '';
      htmlElement.style.outline = '';
      htmlElement.style.backgroundColor = '';
      
      // Remove temporary attributes
      if (htmlElement.hasAttribute('data-temp-edit')) {
        htmlElement.removeAttribute('data-temp-edit');
        htmlElement.removeAttribute('data-temp-id');
        htmlElement.removeAttribute('data-field');
      }
    });
  };

  const handleElementClick = (element: HTMLElement) => {
    const sectionId = element.getAttribute('data-section-id');
    const tempId = element.getAttribute('data-temp-id');
    const field = element.getAttribute('data-field') || 'content';
    
    let value = '';
    let actualSectionId = sectionId;

    if (sectionId) {
      // Existing section
      const section = sections.find(s => s.id === sectionId);
      if (!section) return;

      if (field === 'title') {
        value = section.title;
      } else if (field === 'content') {
        value = section.content;
      } else if (field.startsWith('data.')) {
        const dataKey = field.replace('data.', '');
        value = section.data?.[dataKey] || '';
      }
    } else if (tempId) {
      // Temporary element - get current text content
      value = element.textContent || '';
      
      // For temporary elements, we'll create a new section if saved
      actualSectionId = tempId;
    }

    if (!value && !tempId) return;

    // Check if content is long enough to warrant a textarea
    const shouldUseTextarea = value.length > 100 || value.includes('\n') || field === 'content';

    setEditingElement({ sectionId: actualSectionId, field, value, element });
    setEditValue(value);
    setIsTextarea(shouldUseTextarea);
  };

  const handleSaveEdit = async () => {
    if (!editingElement) return;

    try {
      // For all content (static or CMS), just update the text in place permanently
      const elementToUpdate = editingElement.element.querySelector('[data-editable-text]') || editingElement.element;
      if (elementToUpdate) {
        elementToUpdate.textContent = editValue;
      }

      // If this is an existing CMS section, update it in the database
      if (!editingElement.sectionId.startsWith('temp-')) {
        const section = sections.find(s => s.id === editingElement.sectionId);
        if (section) {
          let updateData: any = {};

          if (editingElement.field === 'title') {
            updateData.title = editValue;
          } else if (editingElement.field === 'content') {
            updateData.content = editValue;
          } else if (editingElement.field.startsWith('data.')) {
            const dataKey = editingElement.field.replace('data.', '');
            updateData.data = {
              ...section.data,
              [dataKey]: editValue
            };
          }

          const { error } = await supabase
            .from('content_sections')
            .update(updateData)
            .eq('id', editingElement.sectionId);

          if (error) throw error;
          
          toast({
            title: "CMS Content Updated",
            description: "Changes saved successfully to the database.",
          });
          refetch(); // Refresh data
        }
      } else {
        toast({
          title: "Content Updated",
          description: "Your changes have been saved in place.",
        });
      }

      setEditingElement(null);
    } catch (error) {
      console.error('Error updating content:', error);
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getCurrentPageComponent = () => {
    const page = pages.find(p => p.path === currentPage);
    if (!page) return null;

    const Component = page.component;
    return <Component />;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Page:</span>
          <div className="flex flex-wrap gap-1">
            {pages.map((page) => {
              const Icon = page.icon;
              return (
                <Button
                  key={page.path}
                  variant={currentPage === page.path ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page.path)}
                  className="flex items-center gap-1"
                >
                  <Icon className="w-3 h-3" />
                  {page.name}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Device:</span>
          <div className="flex gap-1">
            <Button
              variant={deviceView === 'desktop' ? "default" : "outline"}
              size="sm"
              onClick={() => setDeviceView('desktop')}
            >
              <Monitor className="w-3 h-3" />
            </Button>
            <Button
              variant={deviceView === 'tablet' ? "default" : "outline"}
              size="sm"
              onClick={() => setDeviceView('tablet')}
            >
              <Tablet className="w-3 h-3" />
            </Button>
            <Button
              variant={deviceView === 'mobile' ? "default" : "outline"}
              size="sm"
              onClick={() => setDeviceView('mobile')}
            >
              <Smartphone className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <Button
          variant={isEditMode ? "destructive" : "default"}
          onClick={() => setIsEditMode(!isEditMode)}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          {isEditMode ? 'Exit Edit Mode' : 'Enable Live Editing'}
        </Button>
      </div>

      {/* Edit Mode Banner */}
      {isEditMode && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm">
            <Edit className="w-4 h-4" />
            <span className="font-medium">Live Edit Mode Active</span>
            <Badge variant="secondary">Click any text or section to edit</Badge>
          </div>
        </div>
      )}

      {/* Preview Container */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="w-5 h-5" />
            Live Website Preview - {pages.find(p => p.path === currentPage)?.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="bg-gray-100 p-4 min-h-[600px] overflow-auto">
            <div className={cn(
              "mx-auto bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300",
              deviceSizes[deviceView]
            )}>
              <div
                ref={previewRef}
                className="min-h-[600px] overflow-hidden"
                style={{
                  transform: deviceView === 'mobile' ? 'scale(1)' : 'scale(1)',
                  transformOrigin: 'top center'
                }}
              >
                {getCurrentPageComponent()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingElement} onOpenChange={() => setEditingElement(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Edit Content
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Field: {editingElement?.field}
              </label>
              {isTextarea ? (
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  rows={6}
                  className="w-full"
                />
              ) : (
                <Input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="w-full"
                />
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveEdit} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
              <Button variant="outline" onClick={() => setEditingElement(null)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LiveWebsitePreview;