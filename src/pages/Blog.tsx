import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, User, ArrowRight } from "lucide-react";

const Blog = () => {
  const blogs = [
    {
      id: 1,
      title: "The Future of AI in Business Automation: 2024 Trends and Predictions",
      excerpt: "Explore the latest trends in AI automation and discover how businesses are leveraging intelligent systems to streamline operations, reduce costs, and drive innovation in an increasingly competitive landscape.",
      author: "Dr. Sarah Chen",
      date: "January 15, 2024",
      category: "AI Trends",
      image: "/api/placeholder/400/250",
      readTime: "8 min read",
      featured: true
    },
    {
      id: 2,
      title: "Case Study: How RetailMax Increased Sales by 300% with AI-Powered Recommendations",
      excerpt: "Discover how RetailMax transformed their e-commerce platform using our SmartCRM and predictive analytics tools, resulting in unprecedented growth and customer satisfaction rates.",
      author: "Michael Rodriguez",
      date: "January 10, 2024",
      category: "Case Studies",
      image: "/api/placeholder/400/250",
      readTime: "12 min read",
      featured: false
    },
    {
      id: 3,
      title: "Building an AI-First Culture: A Complete Guide for Modern Enterprises",
      excerpt: "Learn practical strategies for integrating AI into your organizational culture, from employee training and change management to establishing AI governance frameworks that ensure sustainable success.",
      author: "Emma Thompson",
      date: "January 5, 2024",
      category: "Automation",
      image: "/api/placeholder/400/250",
      readTime: "10 min read",
      featured: false
    },
    {
      id: 4,
      title: "Machine Learning in Healthcare: Transforming Patient Care Through AI",
      excerpt: "Explore how healthcare organizations are using machine learning to improve diagnostic accuracy, optimize treatment plans, and enhance patient outcomes while reducing operational costs.",
      author: "Dr. James Wilson",
      date: "December 28, 2023",
      category: "AI Trends",
      image: "/api/placeholder/400/250",
      readTime: "7 min read",
      featured: false
    },
    {
      id: 5,
      title: "ROI Calculator: Measuring the Financial Impact of AI Implementation",
      excerpt: "A comprehensive guide to calculating and measuring the return on investment for AI initiatives, including key metrics, benchmarks, and real-world examples from successful implementations.",
      author: "Lisa Park",
      date: "December 20, 2023",
      category: "Case Studies",
      image: "/api/placeholder/400/250",
      readTime: "15 min read",
      featured: false
    },
    {
      id: 6,
      title: "Chatbot Best Practices: Creating Conversational AI That Actually Helps",
      excerpt: "Discover the secrets to building effective chatbots that provide real value to customers, including design principles, training strategies, and integration techniques for maximum impact.",
      author: "Alex Kumar",
      date: "December 15, 2023",
      category: "Automation",
      image: "/api/placeholder/400/250",
      readTime: "9 min read",
      featured: false
    }
  ];

  const categories = ["All", "AI Trends", "Automation", "Case Studies"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredBlogs = selectedCategory === "All" 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  const featuredBlog = blogs.find(blog => blog.featured);
  const regularBlogs = blogs.filter(blog => !blog.featured);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-hero mb-6">
            Insights & Innovation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Stay ahead of the curve with our latest insights on AI trends, automation strategies, and real-world success stories.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "btn-hero" : "btn-outline"}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Blog */}
        {featuredBlog && selectedCategory === "All" && (
          <Card className="card-elevated mb-16 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative h-64 lg:h-auto bg-gradient-primary">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-accent/80 flex items-center justify-center">
                  <span className="text-white text-6xl font-bold opacity-20">AI</span>
                </div>
                <Badge className="absolute top-4 left-4 bg-secondary text-secondary-foreground">
                  Featured
                </Badge>
              </div>
              <div className="p-8">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-4">
                  <Badge variant="secondary">{featuredBlog.category}</Badge>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {featuredBlog.date}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {featuredBlog.author}
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">
                  {featuredBlog.title}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {featuredBlog.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{featuredBlog.readTime}</span>
                  <Button className="btn-hero">
                    Read More <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {(selectedCategory === "All" ? regularBlogs : filteredBlogs).map((blog) => (
            <Card key={blog.id} className="card-elevated overflow-hidden hover:scale-[1.02] transition-all duration-300">
              <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/60 to-accent/60 flex items-center justify-center">
                  <span className="text-white text-4xl font-bold opacity-30">AI</span>
                </div>
                <Badge className="absolute top-4 left-4 bg-background text-foreground">
                  {blog.category}
                </Badge>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {blog.date}
                  </div>
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {blog.author}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 leading-tight">
                  {blog.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {blog.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{blog.readTime}</span>
                  <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover">
                    Read More <ArrowRight className="ml-1 w-3 h-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="text-center bg-gradient-primary rounded-2xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay Updated with AI Insights
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest AI trends, case studies, and expert insights delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 border-0 focus:ring-2 focus:ring-secondary"
            />
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary-hover px-8 py-3">
              Subscribe
            </Button>
          </div>
        </div>

        {/* Back Button */}
        <div className="mt-12 text-center">
          <Link to="/">
            <Button variant="outline" className="btn-outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Blog;