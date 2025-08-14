import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
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

const DynamicBlog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [featuredBlogs, setFeaturedBlogs] = useState<Blog[]>([]);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('blog-updates')
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
        .eq('status', 'published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const blogData = data || [];
      setBlogs(blogData);
      const featuredBlogsData = blogData.filter(blog => blog.featured);
      setFeaturedBlogs(featuredBlogsData);
      
      // Auto-add featured articles if we have less than 3
      if (featuredBlogsData.length < 3) {
        try {
          await addFeaturedArticles();
          // Refetch after adding
          const { data: newData, error: newError } = await supabase
            .from('blogs')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false });
          
          if (!newError && newData) {
            setBlogs(newData);
            setFeaturedBlogs(newData.filter(blog => blog.featured));
          }
        } catch (addError) {
          console.log('Featured articles may already exist');
        }
      }
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(blogData.map(blog => blog.category)));
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBlogs = selectedCategory === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  const displayedFeaturedBlogs = featuredBlogs.slice(0, 3);

  const handleBlogClick = (blog: Blog) => {
    setSelectedBlog(blog);
  };

  const handleDownloadPDF = (blog: Blog) => {
    // Simple PDF generation using browser print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${blog.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              .meta { color: #666; margin-bottom: 20px; }
              .content { line-height: 1.6; }
            </style>
          </head>
          <body>
            <h1>${blog.title}</h1>
            <div class="meta">
              <p>Category: ${blog.category}</p>
              <p>Published: ${new Date(blog.created_at).toLocaleDateString()}</p>
            </div>
            <div class="content">
              ${blog.content.replace(/\n/g, '<br>')}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading blogs...</div>
      </div>
    );
  }

  if (selectedBlog) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <Button 
              variant="outline" 
              onClick={() => setSelectedBlog(null)}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Button>
            <Button 
              onClick={() => handleDownloadPDF(selectedBlog)}
              className="flex items-center"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
          
          <article className="prose prose-lg max-w-none">
            {selectedBlog.featured_image_url && (
              <img 
                src={selectedBlog.featured_image_url} 
                alt={selectedBlog.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}
            
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{selectedBlog.title}</h1>
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(selectedBlog.created_at).toLocaleDateString()}
                </div>
                <Badge variant="secondary">{selectedBlog.category}</Badge>
              </div>
            </header>
            
            {selectedBlog.excerpt && (
              <div className="text-xl text-muted-foreground mb-8 font-medium">
                {selectedBlog.excerpt}
              </div>
            )}
            
            <div 
              className="content"
              dangerouslySetInnerHTML={{ 
                __html: selectedBlog.content.replace(/\n/g, '<br>') 
              }}
            />
          </article>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-muted-foreground">
              Discover insights, trends, and innovations in AI and technology
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory('all')}
                  >
                    All Articles ({blogs.length})
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category} ({blogs.filter(b => b.category === category).length})
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {selectedCategory === 'all' ? 'All Articles' : `${selectedCategory} Articles`}
              </h2>
              <div className="grid gap-6">
                {filteredBlogs.map((blog) => (
                  <Card 
                    key={blog.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleBlogClick(blog)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{blog.category}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(blog.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <CardTitle className="text-xl">{blog.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        {blog.excerpt || blog.content.substring(0, 200) + '...'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Articles Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Featured Articles</CardTitle>
              </CardHeader>
              <CardContent>
                {displayedFeaturedBlogs.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No featured articles available.</p>
                ) : (
                  <div className="space-y-4">
                    {displayedFeaturedBlogs.map((blog) => (
                      <div 
                        key={blog.id}
                        className="cursor-pointer hover:bg-muted p-2 rounded transition-colors"
                        onClick={() => handleBlogClick(blog)}
                      >
                        {blog.featured_image_url && (
                          <div className="aspect-video overflow-hidden rounded mb-2">
                            <img 
                              src={blog.featured_image_url} 
                              alt={blog.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex items-center gap-1 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Featured
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {blog.category}
                          </Badge>
                        </div>
                        <h3 className="font-medium text-sm leading-tight mb-1 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-xs text-muted-foreground">
                          {new Date(blog.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DynamicBlog;