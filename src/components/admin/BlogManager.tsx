import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdvancedRichTextEditor from '@/components/ui/advanced-rich-text-editor';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash, 
  Eye, 
  Upload, 
  Search, 
  Filter, 
  Calendar,
  User,
  BookOpen,
  Star,
  Globe,
  FileText,
  Save,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { migrateStaticBlogs } from '@/scripts/migrate-static-blogs';
import { addFeaturedArticles } from '@/scripts/add-featured-articles';

interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  status: string;
  featured: boolean;
  featured_image_url: string;
  created_at: string;
}

interface BlogManagerProps {
  userRole: string;
}

const BlogManager: React.FC<BlogManagerProps> = ({ userRole }) => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    category: 'general',
    status: 'draft',
    featured: false,
    featured_image_url: ''
  });
  const { toast } = useToast();
  const [migrating, setMigrating] = useState(false);
  const [addingFeatured, setAddingFeatured] = useState(false);

  useEffect(() => {
    fetchBlogs();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('blogs-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'blogs' },
        () => {
          fetchBlogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Filter blogs based on search and filters
  useEffect(() => {
    let filtered = blogs;

    if (searchTerm) {
      filtered = filtered.filter(blog => 
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(blog => blog.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(blog => blog.category === categoryFilter);
    }

    setFilteredBlogs(filtered);
  }, [blogs, searchTerm, statusFilter, categoryFilter]);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch blogs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  // Auto-save function
  const autoSave = async (content: string) => {
    if (!editingBlog) return;
    
    setIsAutoSaving(true);
    try {
      const { error } = await supabase
        .from('blogs')
        .update({ content })
        .eq('id', editingBlog.id);
      
      if (!error) {
        setLastSaved(new Date());
      }
    } catch (error) {
      console.log('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const blogData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.title),
      };

      if (editingBlog) {
        const { error } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', editingBlog.id);
        if (error) throw error;
        toast({ 
          title: "Success", 
          description: "Blog updated successfully!" 
        });
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([blogData]);
        if (error) throw error;
        toast({ 
          title: "Success", 
          description: "Blog created successfully!" 
        });
      }

      setEditingBlog(null);
      setShowCreateForm(false);
      resetForm();
      setLastSaved(new Date());
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      category: 'general',
      status: 'draft',
      featured: false,
      featured_image_url: ''
    });
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setShowCreateForm(true);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      content: blog.content,
      excerpt: blog.excerpt || '',
      category: blog.category,
      status: blog.status,
      featured: blog.featured,
      featured_image_url: blog.featured_image_url || ''
    });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this blog?')) return;

    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast({ title: "Blog deleted successfully!" });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleMigrateBlogs = async () => {
    if (!confirm('This will migrate static blog content to the database. Continue?')) return;
    
    setMigrating(true);
    try {
      await migrateStaticBlogs();
      toast({ 
        title: "Migration completed!", 
        description: "Static blogs have been migrated to the database"
      });
      fetchBlogs(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Migration failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setMigrating(false);
    }
  };

  const handleAddFeaturedArticles = async () => {
    if (!confirm('This will add 2 new featured articles to the database. Continue?')) return;
    
    setAddingFeatured(true);
    try {
      await addFeaturedArticles();
      toast({ 
        title: "Featured articles added!", 
        description: "2 new featured articles have been added to the database"
      });
      fetchBlogs(); // Refresh the list
    } catch (error: any) {
      toast({
        title: "Failed to add featured articles",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAddingFeatured(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <span className="ml-2">Loading blogs...</span>
    </div>
  );

  const statusCounts = {
    all: blogs.length,
    draft: blogs.filter(b => b.status === 'draft').length,
    published: blogs.filter(b => b.status === 'published').length,
    archived: blogs.filter(b => b.status === 'archived').length,
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6 rounded-lg border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Blog Management</h2>
            <p className="text-muted-foreground">Create, edit, and manage your blog content</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              <BookOpen className="w-3 h-3" />
              {blogs.length} Total Posts
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Globe className="w-3 h-3" />
              {statusCounts.published} Published
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <FileText className="w-3 h-3" />
              {statusCounts.draft} Drafts
            </Badge>
          </div>
        </div>
      </div>

      {/* Actions and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 space-y-4">
          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status ({statusCounts.all})</SelectItem>
                <SelectItem value="published">Published ({statusCounts.published})</SelectItem>
                <SelectItem value="draft">Draft ({statusCounts.draft})</SelectItem>
                <SelectItem value="archived">Archived ({statusCounts.archived})</SelectItem>
              </SelectContent>
            </Select>

            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="ai">Artificial Intelligence</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>

            <Button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            onClick={handleMigrateBlogs}
            disabled={migrating}
          >
            <Upload className="w-4 h-4 mr-2" />
            {migrating ? 'Migrating...' : 'Migrate Static'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleAddFeaturedArticles}
            disabled={addingFeatured}
          >
            <Star className="w-4 h-4 mr-2" />
            {addingFeatured ? 'Adding...' : 'Add Featured'}
          </Button>
          <Dialog open={showCreateForm || !!editingBlog} onOpenChange={(open) => {
          if (!open) {
            setShowCreateForm(false);
            setEditingBlog(null);
            resetForm();
          }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setShowCreateForm(true)} className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                New Blog Post
              </Button>
            </DialogTrigger>
           <DialogContent className="max-w-6xl w-[95vw] h-[95vh] flex flex-col p-0">
             <DialogHeader className="p-6 pb-4 border-b">
               <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                 <Edit className="w-6 h-6" />
                 {editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}
               </DialogTitle>
               <DialogDescription className="sr-only">
                 {editingBlog ? 'Edit your blog post content, settings, and preview' : 'Create a new blog post with content, settings, and preview'}
               </DialogDescription>
               <div className="flex items-center gap-2 mt-2">
                 {isAutoSaving && (
                   <Badge variant="secondary" className="animate-pulse">
                     <AlertCircle className="w-3 h-3 mr-1" />
                     Auto-saving...
                   </Badge>
                 )}
                 {lastSaved && !isAutoSaving && (
                   <Badge variant="outline" className="text-green-600">
                     <CheckCircle className="w-3 h-3 mr-1" />
                     Saved {lastSaved.toLocaleTimeString()}
                   </Badge>
                 )}
               </div>
             </DialogHeader>
             
             <div className="flex-1 overflow-hidden">
               <Tabs defaultValue="content" className="h-full flex flex-col">
                 <div className="px-6 pt-4">
                   <TabsList className="grid w-full grid-cols-3">
                     <TabsTrigger value="content">Content</TabsTrigger>
                     <TabsTrigger value="settings">Settings</TabsTrigger>
                     <TabsTrigger value="preview">Preview</TabsTrigger>
                   </TabsList>
                 </div>
                 
                 <TabsContent value="content" className="flex-1 overflow-hidden mt-0 pt-4">
                   <ScrollArea className="h-full px-6">
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-6">
                       {/* Main Content - Takes 2/3 of space */}
                       <div className="lg:col-span-2 space-y-6">
                         <div>
                           <Label htmlFor="title" className="text-base font-semibold">Title *</Label>
                           <Input
                             id="title"
                             value={formData.title}
                             onChange={(e) => {
                               setFormData({...formData, title: e.target.value});
                               if (!formData.slug) {
                                 setFormData(prev => ({...prev, slug: generateSlug(e.target.value)}));
                               }
                             }}
                             placeholder="Enter an engaging blog title..."
                             className="text-lg mt-2"
                           />
                         </div>
                         
                         <div>
                           <Label htmlFor="excerpt" className="text-base font-semibold">Excerpt</Label>
                           <p className="text-sm text-muted-foreground mb-2">A brief summary that appears in blog listings</p>
                           <Textarea
                             id="excerpt"
                             value={formData.excerpt}
                             onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                             rows={3}
                             placeholder="Write a compelling excerpt to attract readers..."
                             className="resize-none"
                           />
                           <div className="text-xs text-muted-foreground mt-1">
                             {formData.excerpt.length}/160 characters
                           </div>
                         </div>

                         <div>
                           <Label htmlFor="content" className="text-base font-semibold mb-2 block">Content</Label>
                           <div className="border rounded-lg">
                              <AdvancedRichTextEditor
                                value={formData.content}
                                onChange={(content) => {
                                  setFormData({...formData, content});
                                  if (editingBlog) {
                                    autoSave(content);
                                  }
                                }}
                                placeholder="Start writing your amazing blog content..."
                                height="500px"
                              />
                           </div>
                         </div>
                       </div>

                       {/* Sidebar - Takes 1/3 of space */}
                       <div className="space-y-6">
                         <Card className="p-4">
                           <h3 className="font-semibold mb-4 flex items-center gap-2">
                             <Calendar className="w-4 h-4" />
                             Publication Settings
                           </h3>
                           <div className="space-y-4">
                             <div>
                               <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                               <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                                 <SelectTrigger className="mt-1">
                                   <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                   <SelectItem value="draft">
                                     <div className="flex items-center gap-2">
                                       <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                       Draft
                                     </div>
                                   </SelectItem>
                                   <SelectItem value="published">
                                     <div className="flex items-center gap-2">
                                       <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                       Published
                                     </div>
                                   </SelectItem>
                                   <SelectItem value="archived">
                                     <div className="flex items-center gap-2">
                                       <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                                       Archived
                                     </div>
                                   </SelectItem>
                                 </SelectContent>
                               </Select>
                             </div>

                             <div>
                               <Label htmlFor="category" className="text-sm font-medium">Category</Label>
                               <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                                 <SelectTrigger className="mt-1">
                                   <SelectValue />
                                 </SelectTrigger>
                                 <SelectContent>
                                   <SelectItem value="general">General</SelectItem>
                                   <SelectItem value="technology">Technology</SelectItem>
                                   <SelectItem value="ai">Artificial Intelligence</SelectItem>
                                   <SelectItem value="business">Business</SelectItem>
                                 </SelectContent>
                               </Select>
                             </div>

                             <div className="flex items-center justify-between">
                               <Label className="text-sm font-medium">Featured Article</Label>
                               <Switch
                                 checked={formData.featured}
                                 onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                               />
                             </div>
                           </div>
                         </Card>

                         <Card className="p-4">
                           <h3 className="font-semibold mb-4">SEO & Metadata</h3>
                           <div className="space-y-4">
                             <div>
                               <Label htmlFor="slug" className="text-sm font-medium">URL Slug</Label>
                               <Input
                                 id="slug"
                                 value={formData.slug}
                                 onChange={(e) => setFormData({...formData, slug: e.target.value})}
                                 placeholder="url-friendly-slug"
                                 className="mt-1 font-mono text-sm"
                               />
                               <p className="text-xs text-muted-foreground mt-1">
                                 yoursite.com/blog/{formData.slug || 'your-slug'}
                               </p>
                             </div>

                             <div>
                               <Label htmlFor="featured_image" className="text-sm font-medium">Featured Image URL</Label>
                               <Input
                                 id="featured_image"
                                 value={formData.featured_image_url}
                                 onChange={(e) => setFormData({...formData, featured_image_url: e.target.value})}
                                 placeholder="https://example.com/image.jpg"
                                 className="mt-1"
                               />
                               {formData.featured_image_url && (
                                 <div className="mt-2">
                                   <img 
                                     src={formData.featured_image_url} 
                                     alt="Featured image preview" 
                                     className="w-full h-20 object-cover rounded border"
                                     onError={(e) => {
                                       e.currentTarget.style.display = 'none';
                                     }}
                                   />
                                 </div>
                               )}
                             </div>
                           </div>
                         </Card>
                       </div>
                     </div>
                   </ScrollArea>
                 </TabsContent>
                 
                 <TabsContent value="settings" className="flex-1 overflow-hidden mt-0 pt-4">
                   <ScrollArea className="h-full px-6">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                       <Card className="p-6">
                         <h3 className="font-semibold mb-4 flex items-center gap-2">
                           <User className="w-4 h-4" />
                           Author Settings
                         </h3>
                         <div className="space-y-4">
                           <div>
                             <Label className="text-sm font-medium">Author</Label>
                             <p className="text-sm text-muted-foreground mt-1">Currently logged in as: {userRole}</p>
                           </div>
                         </div>
                       </Card>

                       <Card className="p-6">
                         <h3 className="font-semibold mb-4">Advanced Options</h3>
                         <div className="space-y-4">
                           <div className="flex items-center justify-between">
                             <div>
                               <Label className="text-sm font-medium">Comments Enabled</Label>
                               <p className="text-xs text-muted-foreground">Allow readers to comment</p>
                             </div>
                             <Switch defaultChecked />
                           </div>
                           <div className="flex items-center justify-between">
                             <div>
                               <Label className="text-sm font-medium">Social Sharing</Label>
                               <p className="text-xs text-muted-foreground">Enable social share buttons</p>
                             </div>
                             <Switch defaultChecked />
                           </div>
                         </div>
                       </Card>
                     </div>
                   </ScrollArea>
                 </TabsContent>

                 <TabsContent value="preview" className="flex-1 overflow-hidden mt-0 pt-4">
                   <ScrollArea className="h-full px-6">
                     <div className="border rounded-lg p-6 bg-background mb-6">
                       <div className="prose prose-sm max-w-none">
                         {formData.featured_image_url && (
                           <img 
                             src={formData.featured_image_url} 
                             alt={formData.title} 
                             className="w-full h-48 object-cover rounded mb-6"
                           />
                         )}
                         <h1 className="text-3xl font-bold mb-2">{formData.title || 'Blog Title'}</h1>
                         <p className="text-muted-foreground mb-6">{formData.excerpt || 'Blog excerpt will appear here...'}</p>
                         <div dangerouslySetInnerHTML={{ __html: formData.content || '<p>Blog content will appear here...</p>' }} />
                       </div>
                     </div>
                   </ScrollArea>
                 </TabsContent>
               </Tabs>
             </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {editingBlog ? 'Editing existing post' : 'Creating new post'}
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingBlog(null);
                    setShowCreateForm(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave}
                  className="bg-primary hover:bg-primary/90"
                  disabled={!formData.title.trim()}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingBlog ? 'Update Post' : 'Create Post'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Blog List */}
      <div className="space-y-4">
        {filteredBlogs.length === 0 ? (
          <Card className="p-12 text-center border-dashed">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No blogs found</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' 
                    ? 'Try adjusting your filters to see more results.' 
                    : 'Create your first blog post to get started!'
                  }
                </p>
              </div>
              {!searchTerm && statusFilter === 'all' && categoryFilter === 'all' && (
                <Button onClick={() => setShowCreateForm(true)} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Blog Post
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredBlogs.map((blog) => (
              <Card key={blog.id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary/20 hover:border-l-primary">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl font-bold truncate">{blog.title}</CardTitle>
                        {blog.featured && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                        <Badge 
                          variant={blog.status === 'published' ? 'default' : blog.status === 'draft' ? 'secondary' : 'outline'}
                          className="capitalize"
                        >
                          {blog.status}
                        </Badge>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(blog.created_at).toLocaleDateString()}
                        </span>
                        <span className="capitalize font-medium">{blog.category}</span>
                        <span className="font-mono text-xs bg-muted px-2 py-1 rounded">/{blog.slug}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleEdit(blog)}
                        className="hover:bg-primary/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete(blog.id)}
                        className="hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                {(blog.excerpt || blog.featured_image_url) && (
                  <CardContent className="pt-0">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        {blog.excerpt && (
                          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {blog.excerpt}
                          </p>
                        )}
                      </div>
                      {blog.featured_image_url && (
                        <div className="flex-shrink-0">
                          <img 
                            src={blog.featured_image_url} 
                            alt={blog.title} 
                            className="w-20 h-20 object-cover rounded-lg border shadow-sm"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogManager;