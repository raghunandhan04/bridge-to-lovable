import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Calendar, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addFeaturedArticles } from '@/scripts/add-featured-articles';
import BlogRenderer from '@/components/blog/BlogRenderer';

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
  blog_structure?: any; // Support for new visual editor
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
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      // Generate content HTML based on blog structure
      let contentHtml = '';
      
      if (blog.blog_structure && blog.blog_structure.blocks && blog.blog_structure.blocks.length > 0) {
        // Render structured content
        blog.blog_structure.blocks.forEach(block => {
          switch (block.type) {
            case 'hero':
            case 'full-width-text':
              contentHtml += `<div style="margin-bottom: 20px;">
                <p style="line-height: 1.6; font-size: 16px;">${block.content?.text || ''}</p>
              </div>`;
              break;
            case 'left-image-right-text':
            case 'right-image-left-text':
              contentHtml += `<div style="margin-bottom: 30px; display: flex; align-items: flex-start; gap: 20px;">
                ${block.content?.image_url ? `<img src="${block.content.image_url}" alt="${block.content?.image_alt || ''}" style="max-width: 300px; height: auto; object-fit: cover; border-radius: 8px;" />` : ''}
                <div style="flex: 1;">
                  <p style="line-height: 1.6; font-size: 16px;">${block.content?.text || ''}</p>
                </div>
              </div>`;
              break;
            case 'image-caption':
              if (block.content?.image_url) {
                contentHtml += `<div style="margin-bottom: 30px; text-align: center;">
                  <img src="${block.content.image_url}" alt="${block.content?.image_alt || ''}" style="max-width: 100%; height: auto; border-radius: 8px;" />
                  ${block.content?.caption ? `<p style="margin-top: 10px; font-style: italic; color: #666; font-size: 14px;">${block.content.caption}</p>` : ''}
                </div>`;
              }
              break;
            case 'bullet-points':
              if (block.content?.points && block.content.points.length > 0) {
                contentHtml += `<div style="margin-bottom: 20px;">
                  <ul style="padding-left: 20px;">
                    ${block.content.points.map(point => `<li style="margin-bottom: 8px; line-height: 1.6;">${point}</li>`).join('')}
                  </ul>
                </div>`;
              }
              break;
            case 'table':
              if (block.content?.table_data) {
                contentHtml += `<div style="margin-bottom: 30px; overflow-x: auto;">
                  <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
                    ${block.content.table_data.map((row, i) => 
                      `<tr>${row.map(cell => 
                        `<${i === 0 ? 'th' : 'td'} style="padding: 12px; border: 1px solid #ddd; text-align: left; ${i === 0 ? 'background-color: #f5f5f5; font-weight: bold;' : ''}">${cell}</${i === 0 ? 'th' : 'td'}>`
                      ).join('')}</tr>`
                    ).join('')}
                  </table>
                </div>`;
              }
              break;
          }
        });
      } else {
        // Fallback to regular content
        contentHtml = `<div style="line-height: 1.6;">${blog.content.replace(/\n/g, '<br>')}</div>`;
      }

      printWindow.document.write(`
        <html>
          <head>
            <title>${blog.title}</title>
            <meta charset="utf-8">
            <style>
              @media print {
                body { -webkit-print-color-adjust: exact; color-adjust: exact; }
                img { max-width: 100% !important; height: auto !important; }
              }
              body { 
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
                padding: 40px; 
                max-width: 800px; 
                margin: 0 auto;
                line-height: 1.6;
                color: #333;
              }
              h1 { 
                color: #1a1a1a; 
                font-size: 32px; 
                margin-bottom: 10px;
                font-weight: 700;
              }
              .meta { 
                color: #666; 
                margin-bottom: 30px; 
                padding-bottom: 20px;
                border-bottom: 2px solid #eee;
                font-size: 14px;
              }
              .meta p { margin: 5px 0; }
              .excerpt {
                font-size: 18px;
                color: #555;
                font-style: italic;
                margin-bottom: 30px;
                padding: 20px;
                background-color: #f9f9f9;
                border-left: 4px solid #007acc;
              }
              .featured-image {
                margin-bottom: 30px;
                text-align: center;
              }
              .featured-image img {
                max-width: 100%;
                height: auto;
                border-radius: 8px;
                box-shadow: 0 4px 8px rgba(0,0,0,0.1);
              }
              .content { 
                font-size: 16px;
                line-height: 1.8;
              }
              .content p { margin-bottom: 16px; }
              .content h2, .content h3 { 
                margin-top: 30px; 
                margin-bottom: 15px; 
                color: #1a1a1a;
              }
              .content ul, .content ol { 
                margin-bottom: 16px; 
                padding-left: 30px;
              }
              .content li { margin-bottom: 8px; }
            </style>
          </head>
          <body>
            <h1>${blog.title}</h1>
            <div class="meta">
              <p><strong>Category:</strong> ${blog.category}</p>
              <p><strong>Published:</strong> ${new Date(blog.created_at).toLocaleDateString()}</p>
            </div>
            ${blog.excerpt ? `<div class="excerpt">${blog.excerpt}</div>` : ''}
            ${blog.featured_image_url ? `<div class="featured-image"><img src="${blog.featured_image_url}" alt="${blog.title}" /></div>` : ''}
            <div class="content">
              ${contentHtml}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      
      // Wait for images to load before printing
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 1000);
      };
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
          
          <BlogRenderer 
            blog={{
              title: selectedBlog.title,
              content: selectedBlog.content,
              excerpt: selectedBlog.excerpt,
              featured_image_url: selectedBlog.featured_image_url,
              created_at: selectedBlog.created_at,
              category: selectedBlog.category,
              blog_structure: selectedBlog.blog_structure
            }}
            className="prose prose-lg max-w-none"
          />
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