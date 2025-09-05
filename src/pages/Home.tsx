import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Zap, Cloud, BarChart3, Cpu, Users, Award, TrendingUp, ChevronUp, ChevronDown } from "lucide-react";
import { useContentSections } from "@/hooks/useContentSections";
import { DynamicSection } from "@/components/dynamic/DynamicSection";

const Home = () => {
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const { sections, loading } = useContentSections('/');
  
  const slogans = [
    "Transforming Business with AI Innovation",
    "Automate, Analyze, Accelerate Growth",
    "Your Partner in Digital Transformation",
    "AI Solutions for Modern Enterprises"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlogan((prev) => (prev + 1) % slogans.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Apply localStorage overrides when component mounts and listen for changes
  useEffect(() => {
    const applyStoredOverrides = () => {
      if (typeof window === 'undefined' || !window.localStorage) return;
      
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('static_override_')) {
          try {
            const override = JSON.parse(localStorage.getItem(key) || '{}');
            
            // Only apply overrides for current page
            if (override.page_path !== window.location.pathname) return;
            
            let elementFound = false;
            
            // Try to find element by path first
            if (override.element_path && !elementFound) {
              try {
                const elements = document.querySelectorAll(override.element_path);
                elements.forEach(element => {
                  if (element.textContent?.trim() === override.original_text?.trim()) {
                    element.textContent = override.override_text;
                    element.setAttribute('data-overridden', 'true');
                    elementFound = true;
                  }
                });
              } catch (e) {
                // Path might be invalid, continue to fallback methods
              }
            }
            
            // Fallback: find by text content and tag name
            if (!elementFound && override.tag_name && override.original_text) {
              const elements = document.querySelectorAll(override.tag_name);
              elements.forEach(element => {
                if (element.textContent?.trim() === override.original_text.trim() && 
                    !element.hasAttribute('data-overridden')) {
                  element.textContent = override.override_text;
                  element.setAttribute('data-overridden', 'true');
                  elementFound = true;
                }
              });
            }
            
          } catch (error) {
            console.warn('Could not apply stored override:', error);
          }
        }
      });
    };

    // Apply overrides after DOM is ready and a short delay to ensure all content is rendered
    const timeouts = [100, 300, 500, 1000]; // Multiple attempts to catch dynamic content
    timeouts.forEach(delay => {
      setTimeout(applyStoredOverrides, delay);
    });

    // Listen for storage events from live editor
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('static_override_') && e.newValue) {
        // Apply the new override immediately
        setTimeout(applyStoredOverrides, 50);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollToNext = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const features = [
    {
      icon: Zap,
      title: "AI Automation",
      description: "Streamline workflows with intelligent automation that learns and adapts to your business needs."
    },
    {
      icon: Cloud,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure designed for enterprise-grade AI applications and data processing."
    },
    {
      icon: BarChart3,
      title: "Advanced Analytics",
      description: "Transform data into actionable insights with our powerful AI-driven analytics platform."
    },
    {
      icon: Cpu,
      title: "Machine Learning",
      description: "Custom ML models tailored to solve your specific business challenges and opportunities."
    }
  ];

  const stats = [
    { number: "500+", label: "Enterprise Clients" },
    { number: "99.9%", label: "Uptime Guarantee" },
    { number: "10x", label: "ROI Improvement" },
    { number: "24/7", label: "Expert Support" }
  ];

  return (
    <div className="animate-in fade-in duration-700">
      {/* Admin Toggle */}
      {localStorage.getItem('supabase.auth.token') && (
        <Button 
          className="fixed top-20 right-4 z-50" 
          variant={isAdminMode ? "default" : "outline"}
          onClick={() => setIsAdminMode(!isAdminMode)}
        >
          {isAdminMode ? "Exit Edit" : "Edit Mode"}
        </Button>
      )}

      {/* Original Static Content with seamless CMS integration */}
      <div className="space-y-16">
        <>
          {/* Fallback Hero Section */}
          <section id="hero" className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
              <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="text-gradient">
                    {slogans[currentSlogan]}
                  </span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  Empower your business with cutting-edge AI solutions designed to automate processes, 
                  unlock insights, and drive unprecedented growth.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link to="/contact">
                    <Button className="btn-hero text-lg px-8 py-4">
                      Get Started <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/solutions">
                    <Button className="btn-outline text-lg px-8 py-4">
                      Explore Solutions
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Scroll down indicator */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <Button
                variant="ghost"
                size="icon"
                onClick={scrollToNext}
                className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white"
              >
                <ChevronDown className="h-6 w-6" />
              </Button>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-hero mb-4">
                  Why Choose Hibiz.ai?
                </h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Our comprehensive AI platform delivers measurable results across all business functions
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, index) => (
                  <Card key={index} className="card-elevated p-6 text-center hover:scale-105 transition-transform duration-300">
                    <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section id="stats" className="py-20 bg-gradient-primary text-white">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                {stats.map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-4xl md:text-5xl font-bold">{stat.number}</div>
                    <div className="text-lg opacity-90">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section id="cta" className="py-20 bg-background">
            <div className="container mx-auto px-4 lg:px-8 text-center">
              <div className="max-w-3xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold text-hero">
                  Ready to Transform Your Business?
                </h2>
                <p className="text-xl text-muted-foreground">
                  Join hundreds of forward-thinking companies already leveraging AI to drive growth and innovation.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/contact">
                    <Button className="btn-hero text-lg px-8 py-4">
                      Start Your AI Journey
                    </Button>
                  </Link>
                  <Link to="/pricing">
                    <Button className="btn-secondary text-lg px-8 py-4">
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
          size="icon"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default Home;