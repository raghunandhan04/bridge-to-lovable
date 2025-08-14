import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import RichTextEditor from '@/components/ui/rich-text-editor';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash, Eye, Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  const [loading, setLoading] = useState(true);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
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

  const handleSave = async () => {
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
        toast({ title: "Blog updated successfully!" });
      } else {
        const { error } = await supabase
          .from('blogs')
          .insert([blogData]);
        if (error) throw error;
        toast({ title: "Blog created successfully!" });
      }

      setEditingBlog(null);
      setShowCreateForm(false);
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

  if (loading) return <div>Loading blogs...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleMigrateBlogs}
            disabled={migrating}
          >
            <Upload className="w-4 h-4 mr-2" />
            {migrating ? 'Migrating...' : 'Migrate Static Blogs'}
          </Button>
          <Button 
            variant="outline" 
            onClick={handleAddFeaturedArticles}
            disabled={addingFeatured}
          >
            <Plus className="w-4 h-4 mr-2" />
            {addingFeatured ? 'Adding...' : 'Add Featured Articles'}
          </Button>
          <Dialog open={showCreateForm || !!editingBlog} onOpenChange={(open) => {
          if (!open) {
            setShowCreateForm(false);
            setEditingBlog(null);
            resetForm();
          }
          }}>
            <DialogTrigger asChild>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                New Blog
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingBlog ? 'Edit Blog' : 'Create New Blog'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    placeholder="Auto-generated from title"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={formData.excerpt}
                  onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(content) => setFormData({...formData, content})}
                  placeholder="Write your blog content here..."
                  className="mt-2"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                    <SelectTrigger>
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
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                    />
                    <span>Featured Article</span>
                  </Label>
                </div>

                <div>
                  <Label htmlFor="featured_image">Featured Image URL</Label>
                  <Input
                    id="featured_image"
                    value={formData.featured_image_url}
                    onChange={(e) => setFormData({...formData, featured_image_url: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
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
                <Button onClick={handleSave}>
                  {editingBlog ? 'Update' : 'Create'} Blog
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      <div className="grid gap-4">
        {blogs.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No blogs found. Create your first blog post!</p>
          </Card>
        ) : (
          blogs.map((blog) => (
            <Card key={blog.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{blog.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <span className="font-medium capitalize">{blog.category}</span>
                      <span>•</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        blog.status === 'published' ? 'bg-green-100 text-green-800' :
                        blog.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {blog.status}
                      </span>
                      <span>•</span>
                      <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                      {blog.featured && (
                        <>
                          <span>•</span>
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">Featured</span>
                        </>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-mono mt-1">Slug: /{blog.slug}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(blog)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="destructive" 
                      onClick={() => handleDelete(blog.id)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-2">{blog.excerpt}</p>
                {blog.featured_image_url && (
                  <div className="mt-3">
                    <img 
                      src={blog.featured_image_url} 
                      alt={blog.title} 
                      className="w-20 h-20 object-cover rounded border"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogManager;