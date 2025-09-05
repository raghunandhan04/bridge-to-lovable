import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash, Eye, Layout, Zap, BarChart3, Target, GripVertical, Monitor } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileUpload } from './FileUpload';
import { DynamicSection } from '@/components/dynamic/DynamicSection';

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
  created_at: string;
}

interface ContentManagerProps {
  userRole: string;
}

interface SectionTemplate {
  type: string;
  name: string;
  icon: React.ReactNode;
  defaultData: Partial<ContentSection>;
  description: string;
}

interface PageTemplate {
  path: string;
  name: string;
  sections: SectionTemplate[];
}

const ContentManager: React.FC<ContentManagerProps> = ({ userRole }) => {
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [selectedPage, setSelectedPage] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showTemplateDialog, setShowTemplateDialog] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<SectionTemplate | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewSection, setPreviewSection] = useState<ContentSection | null>(null);
  const [formData, setFormData] = useState({
    section_key: '',
    title: '',
    content: '',
    image_url: '',
    data: '{}',
    section_type: 'text',
    page_path: '/',
    display_order: 0,
    visible: true
  });
  const { toast } = useToast();

  // Page templates with predefined sections
  const pageTemplates: PageTemplate[] = [
    {
      path: '/',
      name: 'Home Page',
      sections: [
        {
          type: 'hero',
          name: 'Hero Section',
          icon: <Zap className="w-5 h-5" />,
          description: 'Main hero banner with title, subtitle and call-to-action buttons',
          defaultData: {
            section_type: 'hero',
            title: 'Transforming Business with AI Innovation',
            content: 'Empower your business with cutting-edge AI solutions designed to automate processes, unlock insights, and drive unprecedented growth.',
            section_key: 'home-hero',
            display_order: 1,
            visible: true,
            data: {
              buttons: [
                { text: 'Get Started', link: '/contact', style: 'primary' },
                { text: 'Explore Solutions', link: '/solutions', style: 'outline' }
              ]
            }
          }
        },
        {
          type: 'features',
          name: 'Features Grid',
          icon: <Layout className="w-5 h-5" />,
          description: 'Grid layout showcasing key features with icons and descriptions',
          defaultData: {
            section_type: 'feature',
            title: 'Why Choose Hibiz.ai?',
            content: 'Our comprehensive AI platform delivers measurable results across all business functions',
            section_key: 'home-features',
            display_order: 2,
            visible: true,
            data: {
              features: [
                { title: 'AI Automation', description: 'Streamline workflows with intelligent automation.', icon: 'Zap' },
                { title: 'Cloud Solutions', description: 'Scalable cloud infrastructure for enterprise applications.', icon: 'Cloud' },
                { title: 'Advanced Analytics', description: 'Transform data into actionable insights.', icon: 'BarChart3' },
                { title: 'Machine Learning', description: 'Custom ML models for your business needs.', icon: 'Cpu' }
              ]
            }
          }
        },
        {
          type: 'stats',
          name: 'Statistics Section',
          icon: <BarChart3 className="w-5 h-5" />,
          description: 'Display key metrics and achievements with visual impact',
          defaultData: {
            section_type: 'stats',
            title: 'Our Impact',
            content: 'Proven results that speak for themselves',
            section_key: 'home-stats',
            display_order: 3,
            visible: true,
            data: {
              stats: [
                { number: '500+', label: 'Enterprise Clients' },
                { number: '99.9%', label: 'Uptime Guarantee' },
                { number: '10x', label: 'ROI Improvement' },
                { number: '24/7', label: 'Expert Support' }
              ]
            }
          }
        },
        {
          type: 'testimonial',
          name: 'Testimonial',
          icon: <Target className="w-5 h-5" />,
          description: 'Customer testimonials and reviews',
          defaultData: {
            section_type: 'testimonial',
            title: 'What Our Clients Say',
            content: 'Real feedback from satisfied customers',
            section_key: 'home-testimonial',
            display_order: 4,
            visible: true,
            data: {
              testimonials: [
                { name: 'John Smith', role: 'CEO, TechCorp', content: 'Amazing results with AI automation!', avatar: '' },
                { name: 'Jane Doe', role: 'CTO, DataFirm', content: 'Transformed our business operations completely.', avatar: '' }
              ]
            }
          }
        },
        {
          type: 'cta',
          name: 'Call to Action',
          icon: <Target className="w-5 h-5" />,
          description: 'Final section to drive user conversion',
          defaultData: {
            section_type: 'cta',
            title: 'Ready to Transform Your Business?',
            content: 'Join hundreds of forward-thinking companies already leveraging AI.',
            section_key: 'home-cta',
            display_order: 5,
            visible: true,
            data: {
              buttons: [
                { text: 'Start Your AI Journey', link: '/contact', style: 'primary' },
                { text: 'View Pricing', link: '/pricing', style: 'secondary' }
              ]
            }
          }
        }
      ]
    },
    {
      path: '/pricing',
      name: 'Pricing Page',
      sections: [
        {
          type: 'pricing',
          name: 'Pricing Table',
          icon: <Target className="w-5 h-5" />,
          description: 'Pricing plans and features comparison',
          defaultData: {
            section_type: 'pricing',
            title: 'Choose Your Plan',
            content: 'Flexible pricing options for every business size',
            section_key: 'pricing-table',
            display_order: 1,
            visible: true,
            data: {
              plans: [
                { name: 'Starter', price: '$99', features: ['5 Users', 'Basic AI Tools', 'Email Support'] },
                { name: 'Pro', price: '$299', features: ['25 Users', 'Advanced AI', 'Priority Support'], popular: true },
                { name: 'Enterprise', price: 'Custom', features: ['Unlimited Users', 'Custom AI Models', '24/7 Support'] }
              ]
            }
          }
        }
      ]
    },
    {
      path: '/contact',
      name: 'Contact Page',
      sections: [
        {
          type: 'contact',
          name: 'Contact Form',
          icon: <Layout className="w-5 h-5" />,
          description: 'Contact form with company information',
          defaultData: {
            section_type: 'contact',
            title: 'Get in Touch',
            content: 'Ready to start your AI journey? Contact us today.',
            section_key: 'contact-form',
            display_order: 1,
            visible: true,
            data: {
              email: 'contact@hibiz.ai',
              phone: '+1 (555) 123-4567',
              address: '123 AI Street, Tech City, TC 12345'
            }
          }
        }
      ]
    }
  ];

  const pages = Array.from(new Set(contentSections.map(section => section.page_path)));
  const filteredSections = selectedPage === 'all' 
    ? contentSections 
    : contentSections.filter(section => section.page_path === selectedPage);

  const fetchContentSections = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .order('page_path', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      setContentSections(data || []);
    } catch (error: unknown) {
      console.error('Error fetching content sections:', error);
      toast({
        title: "Error",
        description: "Failed to fetch content sections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchContentSections();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('content-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'content_sections' },
        () => {
          fetchContentSections();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchContentSections]);

  const handleSave = async () => {
    try {
      let parsedData = {};
      try {
        parsedData = JSON.parse(formData.data);
      } catch {
        parsedData = {};
      }

      const sectionData = {
        section_key: formData.section_key,
        title: formData.title,
        content: formData.content,
        image_url: formData.image_url,
        data: parsedData,
        section_type: formData.section_type,
        page_path: formData.page_path,
        display_order: formData.display_order,
        visible: formData.visible
      };

      if (editingSection) {
        const { error } = await supabase
          .from('content_sections')
          .update(sectionData)
          .eq('id', editingSection.id);
        if (error) throw error;
        toast({ title: "Content section updated successfully!" });
      } else {
        const { error } = await supabase
          .from('content_sections')
          .insert([sectionData]);
        if (error) throw error;
        toast({ title: "Content section created successfully!" });
      }

      resetForm();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setEditingSection(null);
    setShowCreateForm(false);
    setShowTemplateDialog(false);
    setSelectedTemplate(null);
    setFormData({
      section_key: '',
      title: '',
      content: '',
      image_url: '',
      data: '{}',
      section_type: 'text',
      page_path: '/',
      display_order: 0,
      visible: true
    });
  };

  const handleCreateFromTemplate = (template: SectionTemplate, pagePath: string) => {
    const newSection = {
      ...template.defaultData,
      page_path: pagePath,
      display_order: contentSections.filter(s => s.page_path === pagePath).length + 1
    };
    
    setFormData({
      section_key: newSection.section_key || '',
      title: newSection.title || '',
      content: newSection.content || '',
      image_url: newSection.image_url || '',
      data: JSON.stringify(newSection.data || {}, null, 2),
      section_type: newSection.section_type || 'text',
      page_path: newSection.page_path || '/',
      display_order: newSection.display_order || 0,
      visible: newSection.visible !== false
    });
    
    setSelectedTemplate(template);
    setShowTemplateDialog(false);
    setShowCreateForm(true);
  };

  const handleEdit = (section: ContentSection) => {
    setEditingSection(section);
    setFormData({
      section_key: section.section_key,
      title: section.title,
      content: section.content || '',
      image_url: section.image_url || '',
      data: JSON.stringify(section.data || {}, null, 2),
      section_type: section.section_type,
      page_path: section.page_path,
      display_order: section.display_order,
      visible: section.visible
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this content section?')) return;

    try {
      const { error } = await supabase
        .from('content_sections')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast({ title: "Content section deleted successfully!" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleReorder = async (draggedId: string, targetId: string, position: 'before' | 'after') => {
    const draggedSection = contentSections.find(s => s.id === draggedId);
    const targetSection = contentSections.find(s => s.id === targetId);
    
    if (!draggedSection || !targetSection) return;

    const samePage = contentSections.filter(s => s.page_path === draggedSection.page_path);
    const newOrder = position === 'before' ? targetSection.display_order : targetSection.display_order + 1;
    
    try {
      // Update dragged section order
      await supabase
        .from('content_sections')
        .update({ display_order: newOrder })
        .eq('id', draggedId);

      // Adjust other sections
      const updates = samePage
        .filter(s => s.id !== draggedId)
        .filter(s => position === 'before' ? s.display_order >= targetSection.display_order : s.display_order > targetSection.display_order)
        .map(s => ({ id: s.id, display_order: s.display_order + 1 }));

      for (const update of updates) {
        await supabase
          .from('content_sections')
          .update({ display_order: update.display_order })
          .eq('id', update.id);
      }

      toast({ title: "Section reordered successfully!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  if (loading) return <div>Loading content sections...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Dynamic Site Editor</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={() => setShowTemplateDialog(true)}
          >
            <Layout className="w-4 h-4 mr-2" />
            Add from Template
          </Button>
          <Button 
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Monitor className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Live Preview'}
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Custom Section
          </Button>
        </div>
      </div>

      {/* Template Selection Dialog */}
      <Dialog open={showTemplateDialog} onOpenChange={setShowTemplateDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Choose a Section Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            {pageTemplates.map((page) => (
              <div key={page.path} className="space-y-4">
                <h3 className="font-semibold text-lg text-primary">{page.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {page.sections.map((template) => (
                    <Card 
                      key={`${page.path}-${template.type}`}
                      className="p-4 cursor-pointer hover:bg-muted/50 transition-colors border-2 hover:border-primary/20"
                      onClick={() => handleCreateFromTemplate(template, page.path)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/10 rounded-md">
                            {template.icon}
                          </div>
                          <div>
                            <h4 className="font-medium">{template.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              For {page.name}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {template.description}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit/Create Dialog */}
      <Dialog open={showCreateForm || !!editingSection} onOpenChange={(open) => {
        if (!open) {
          resetForm();
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingSection ? 'Edit Content Section' : 'Create New Content Section'}
              {selectedTemplate && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({selectedTemplate.name})
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="section_key">Section Key (Unique ID)</Label>
                <Input
                  id="section_key"
                  value={formData.section_key}
                  onChange={(e) => setFormData({...formData, section_key: e.target.value})}
                  placeholder="hero-section-1"
                />
              </div>
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="section_type">Section Type</Label>
                <Select value={formData.section_type} onValueChange={(value) => setFormData({...formData, section_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="hero">Hero</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="solution">Solution</SelectItem>
                    <SelectItem value="stats">Statistics</SelectItem>
                    <SelectItem value="cta">Call to Action</SelectItem>
                    <SelectItem value="pricing">Pricing</SelectItem>
                    <SelectItem value="testimonial">Testimonial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="page_path">Page Path</Label>
                <Select value={formData.page_path} onValueChange={(value) => setFormData({...formData, page_path: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="/">Home</SelectItem>
                    <SelectItem value="/products">Products</SelectItem>
                    <SelectItem value="/solutions">Solutions</SelectItem>
                    <SelectItem value="/products/smartcrm">SmartCRM</SelectItem>
                    <SelectItem value="/products/predictive-sales-ai">Predictive Sales AI</SelectItem>
                    <SelectItem value="/products/chatbot360">ChatBot360</SelectItem>
                    <SelectItem value="/products/ai-email-optimizer">AI Email Optimizer</SelectItem>
                    <SelectItem value="/products/data-intelligence-hub">Data Intelligence Hub</SelectItem>
                    <SelectItem value="/solutions/retail-ecommerce">Retail & E-commerce</SelectItem>
                    <SelectItem value="/solutions/healthcare">Healthcare</SelectItem>
                    <SelectItem value="/solutions/logistics-supply-chain">Logistics & Supply Chain</SelectItem>
                    <SelectItem value="/solutions/financial-services">Financial Services</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="display_order">Display Order</Label>
                <Input
                  id="display_order"
                  type="number"
                  value={formData.display_order}
                  onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                rows={6}
              />
            </div>

            <div>
              <Label htmlFor="image_url">Media URL (Image/Video)</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                placeholder="Enter URL or upload below"
              />
              <div className="mt-4">
                <FileUpload 
                  onFileUploaded={(url) => setFormData({...formData, image_url: url})}
                  acceptedTypes="image/*,video/*"
                />
              </div>
              {formData.image_url && (
                <div className="mt-4 p-3 border rounded-lg">
                  <p className="text-sm font-medium mb-2">Preview:</p>
                  {formData.image_url.includes('youtube.com') || formData.image_url.includes('vimeo.com') ? (
                    <div className="aspect-video w-full max-w-xs">
                      <iframe src={formData.image_url} className="w-full h-full rounded" />
                    </div>
                  ) : (
                    <img src={formData.image_url} alt="Preview" className="w-full max-w-xs h-32 object-cover image-card" />
                  )}
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="data">Additional Data (JSON)</Label>
              <Textarea
                id="data"
                value={formData.data}
                onChange={(e) => setFormData({...formData, data: e.target.value})}
                rows={6}
                className="font-mono text-sm"
                placeholder='{"key": "value"}'
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                {editingSection ? 'Update' : 'Create'} Section
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Page Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Button
          variant={selectedPage === 'all' ? 'default' : 'outline'}
          onClick={() => setSelectedPage('all')}
        >
          All Pages ({contentSections.length})
        </Button>
        {pages.map((page) => (
          <Button
            key={page}
            variant={selectedPage === page ? 'default' : 'outline'}
            onClick={() => setSelectedPage(page)}
          >
            {page === '/' ? 'Home' : page.replace('/', '').replace('-', ' ')} ({contentSections.filter(s => s.page_path === page).length})
          </Button>
        ))}
      </div>

      {/* Content Sections List */}
      <div className="grid gap-4">
        {filteredSections.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No content sections found. Start by adding a new section from templates or create a custom one.</p>
          </Card>
        ) : (
          filteredSections.map((section) => (
            <Card 
              key={section.id} 
              className="hover:shadow-md transition-shadow"
              draggable
              onDragStart={(e) => e.dataTransfer.setData('text/plain', section.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const draggedId = e.dataTransfer.getData('text/plain');
                const rect = e.currentTarget.getBoundingClientRect();
                const midpoint = rect.top + rect.height / 2;
                const position = e.clientY < midpoint ? 'before' : 'after';
                handleReorder(draggedId, section.id, position);
              }}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-3 flex-1">
                    <GripVertical className="w-5 h-5 text-muted-foreground mt-1 cursor-grab" />
                    <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium">{section.page_path}</span>
                      <span>•</span>
                      <span className="capitalize">{section.section_type}</span>
                      <span>•</span>
                      <span>Order: {section.display_order}</span>
                    </div>
                      <p className="text-xs text-muted-foreground font-mono">Key: {section.section_key}</p>
                    </div>
                  </div>
                   <div className="flex space-x-2">
                     <Button 
                       size="sm" 
                       variant="outline" 
                       onClick={() => {
                         setPreviewSection(section);
                         setShowPreview(true);
                       }}
                     >
                       <Eye className="w-4 h-4" />
                     </Button>
                     <Button size="sm" variant="outline" onClick={() => handleEdit(section)}>
                       <Edit className="w-4 h-4" />
                     </Button>
                     <Button size="sm" variant="destructive" onClick={() => handleDelete(section.id)}>
                       <Trash className="w-4 h-4" />
                     </Button>
                   </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{section.content}</p>
                {section.image_url && (
                  <div className="mt-3">
                    <img src={section.image_url} alt={section.title} className="w-20 h-20 object-cover image-card" />
                  </div>
                )}
                <div className="flex items-center gap-2 mt-3">
                  {!section.visible && (
                    <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                      Hidden
                    </span>
                  )}
                  {section.data && Object.keys(section.data).length > 0 && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      Has Custom Data
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Live Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Live Preview{previewSection && ` - ${previewSection.title}`}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {showPreview && previewSection ? (
              <div className="border rounded-lg p-6 bg-background min-h-[400px]">
                <DynamicSection 
                  section={previewSection} 
                />
              </div>
            ) : showPreview && !previewSection ? (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Page Preview - {selectedPage === 'all' ? 'All Pages' : selectedPage}</h3>
                {filteredSections.map((section, index) => (
                  <div key={section.id} className="border rounded-lg p-6 bg-background">
                    <div className="text-xs text-muted-foreground mb-2">
                      Section {index + 1}: {section.section_key}
                    </div>
                    <DynamicSection 
                      section={section} 
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContentManager;