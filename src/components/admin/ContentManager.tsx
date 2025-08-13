import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileUpload } from './FileUpload';

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

const ContentManager: React.FC<ContentManagerProps> = ({ userRole }) => {
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<ContentSection | null>(null);
  const [selectedPage, setSelectedPage] = useState<string>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
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

  const pages = Array.from(new Set(contentSections.map(section => section.page_path)));
  const filteredSections = selectedPage === 'all' 
    ? contentSections 
    : contentSections.filter(section => section.page_path === selectedPage);

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
  }, []);

  const fetchContentSections = async () => {
    try {
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .order('page_path', { ascending: true })
        .order('display_order', { ascending: true });

      if (error) throw error;
      setContentSections(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch content sections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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

      setEditingSection(null);
      setShowCreateForm(false);
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
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
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

  if (loading) return <div>Loading content sections...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <Dialog open={showCreateForm || !!editingSection} onOpenChange={(open) => {
          if (!open) {
            setShowCreateForm(false);
            setEditingSection(null);
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              New Content Section
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingSection ? 'Edit Content Section' : 'Create New Content Section'}</DialogTitle>
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
                      <SelectItem value="pricing">Pricing</SelectItem>
                      <SelectItem value="testimonial">Testimonial</SelectItem>
                      <SelectItem value="cta">Call to Action</SelectItem>
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
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  placeholder="Or upload a file below"
                />
                <div className="mt-4">
                  <FileUpload 
                    onFileUploaded={(url) => setFormData({...formData, image_url: url})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="data">Additional Data (JSON)</Label>
                <Textarea
                  id="data"
                  value={formData.data}
                  onChange={(e) => setFormData({...formData, data: e.target.value})}
                  rows={4}
                  className="font-mono"
                  placeholder='{"key": "value"}'
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setEditingSection(null);
                  setShowCreateForm(false);
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  {editingSection ? 'Update' : 'Create'} Section
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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

      <div className="grid gap-4">
        {filteredSections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {section.page_path} • {section.section_type} • Order: {section.display_order}
                  </p>
                  <p className="text-xs text-muted-foreground">Key: {section.section_key}</p>
                </div>
                <div className="flex space-x-2">
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
              <p className="text-sm text-muted-foreground">{section.content?.substring(0, 150)}...</p>
              {section.image_url && (
                <div className="mt-2">
                  <img src={section.image_url} alt={section.title} className="w-20 h-20 object-cover rounded" />
                </div>
              )}
              {!section.visible && (
                <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                  Hidden
                </span>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentManager;