import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BlogRenderer from "@/components/blog/BlogRenderer";

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

const Blog = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isMobile, setIsMobile] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
    
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const fetchBlogs = async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('status', 'published')
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

  const categories = ["general", "technology", "ai", "business"];
  const categoryLabels = {
    general: "General",
    technology: "Technology", 
    ai: "Artificial Intelligence",
    business: "Business"
  };

  const getBlogsByCategory = (category: string) => {
    return blogs.filter(blog => blog.category === category);
  };

  const getFeaturedBlogByCategory = (category: string) => {
    return blogs.find(blog => blog.category === category && blog.featured);
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const handleBlogClick = (blog: Blog) => {
    setSelectedBlog(blog);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Loading blogs...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      {/* Header */}
      <div className="bg-background border-b">
        <div className="container mx-auto px-4 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-hero mb-4">
              Insights & Innovation
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay ahead of the curve with our latest insights on AI trends, automation strategies, and real-world success stories.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 lg:px-8 py-8 h-[calc(100vh-200px)]">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          
          {/* Left Sidebar - Categories */}
          <div className="lg:col-span-1">
            {isMobile ? (
            <div className="mb-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory} data-testid="category-select">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {categoryLabels[category as keyof typeof categoryLabels]} ({getBlogsByCategory(category).length})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
          <Card className="h-full">
            <CardHeader data-testid="categories-sidebar">
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
                <CardContent className="p-0 overflow-y-auto h-[calc(100vh-300px)]">
                  {categories.map((category) => {
                    const categoryBlogs = getBlogsByCategory(category);
                    const isExpanded = expandedCategories.has(category);
                    
                    return (
                      <div key={category} className="border-b last:border-b-0">
                        <button
                          onClick={() => toggleCategory(category)}
                          className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                        >
                          <span className="font-medium text-left">
                            {categoryLabels[category as keyof typeof categoryLabels]} ({categoryBlogs.length})
                          </span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>
                        
                        {isExpanded && categoryBlogs.length > 0 && (
                          <div className="px-4 pb-4 space-y-2 bg-muted/20">
                            {categoryBlogs.map((blog) => (
                              <button
                                key={blog.id}
                                onClick={() => handleBlogClick(blog)}
                                className={`w-full text-left p-3 rounded-lg text-sm hover:bg-background transition-colors ${
                                  selectedBlog?.id === blog.id ? 'bg-primary/10 border border-primary/20' : 'bg-background/50'
                                }`}
                                data-testid="blog-item"
                              >
                                <div className="font-medium mb-1 line-clamp-2">{blog.title}</div>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(blog.created_at).toLocaleDateString()}
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Center - Blog Content */}
          <div className="lg:col-span-2">
            {selectedBlog ? (
              <Card className="h-full overflow-hidden">
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {categoryLabels[selectedBlog.category as keyof typeof categoryLabels]}
                    </Badge>
                    <div className="text-sm text-muted-foreground">
                      {new Date(selectedBlog.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <CardTitle className="text-2xl md:text-3xl leading-tight">
                    {selectedBlog.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0 overflow-y-auto h-[calc(100vh-400px)]">
                  <div className="p-6" data-testid="blog-content">
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
                      className="max-w-none"
                    />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <div className="text-center p-8">
                  <h3 className="text-xl font-semibold mb-2">Select a blog to read</h3>
                  <p className="text-muted-foreground">
                    Choose a category from the left sidebar and click on any blog to start reading.
                  </p>
                </div>
              </Card>
            )}
          </div>

          {/* Right Sidebar - Featured Articles */}
          <div className="lg:col-span-1">
          <Card className="h-full overflow-hidden" data-testid="featured-articles">
            <CardHeader>
              <CardTitle className="text-lg">Featured Articles</CardTitle>
            </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-y-auto h-[calc(100vh-300px)]">
                  {categories.map((category) => {
                    const featuredBlog = getFeaturedBlogByCategory(category);
                    // Avoid duplicate titles when a category is expanded on the left
                    if (!featuredBlog || expandedCategories.has(category)) return null;
                    
                    return (
                      <div key={category} className="border-b last:border-b-0 p-4">
                        <Badge variant="outline" className="mb-2">
                          {categoryLabels[category as keyof typeof categoryLabels]}
                        </Badge>
                        <button
                          onClick={() => handleBlogClick(featuredBlog)}
                          className={`w-full text-left group hover:bg-muted/50 p-3 rounded-lg transition-colors ${
                            selectedBlog?.id === featuredBlog.id ? 'bg-primary/10 border border-primary/20' : ''
                          }`}
                          aria-label={`Featured: ${featuredBlog.title}`}
                          data-testid="featured-article"
                        >
                          <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-3">
                            {featuredBlog.title}
                          </h4>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                            {featuredBlog.excerpt}
                          </p>
                          <div className="text-xs text-muted-foreground">
                            {new Date(featuredBlog.created_at).toLocaleDateString()}
                          </div>
                        </button>
                      </div>
                    );
                  })}
                  
                  {!categories.some(cat => getFeaturedBlogByCategory(cat)) && (
                    <div className="p-4 text-center text-muted-foreground">
                      No featured articles available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Blog;