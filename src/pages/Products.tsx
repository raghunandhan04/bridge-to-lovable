import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Bot, TrendingUp, MessageSquare, Mail, Star, Users, Zap } from "lucide-react";
import { useContentSections } from "@/hooks/useContentSections";
import { DynamicSection } from "@/components/dynamic/DynamicSection";

const Products = () => {
  const { sections, loading } = useContentSections('/products');
  
  const products = [
    {
      id: 1,
      name: "SmartCRM",
      icon: Users,
      category: "Customer Management",
      description: "AI-powered customer relationship management that predicts customer behavior, automates follow-ups, and optimizes sales pipelines for maximum conversion.",
      features: ["Predictive Lead Scoring", "Automated Workflows", "Sales Forecasting", "Customer Insights"],
      pricing: "Starting at $29/month",
      badge: "Most Popular",
      color: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      name: "Predictive Sales AI",
      icon: TrendingUp,
      category: "Sales Analytics",
      description: "Advanced machine learning algorithms that analyze market trends, customer data, and sales patterns to predict future revenue and identify growth opportunities.",
      features: ["Revenue Forecasting", "Market Analysis", "Opportunity Scoring", "Performance Analytics"],
      pricing: "Starting at $49/month",
      badge: "Enterprise Favorite",
      color: "from-green-500 to-teal-600"
    },
    {
      id: 3,
      name: "ChatBot360",
      icon: MessageSquare,
      category: "Customer Support",
      description: "Intelligent conversational AI that provides 24/7 customer support, handles complex queries, and seamlessly escalates to human agents when needed.",
      features: ["Natural Language Processing", "Multi-language Support", "Integration Ready", "Analytics Dashboard"],
      pricing: "Starting at $19/month",
      badge: "New Release",
      color: "from-orange-500 to-red-600"
    },
    {
      id: 4,
      name: "AI Email Optimizer",
      icon: Mail,
      category: "Marketing Automation",
      description: "Optimize email campaigns with AI-driven content generation, send-time optimization, and personalization that increases open rates and conversions.",
      features: ["Content Generation", "Send-time Optimization", "A/B Testing", "Personalization Engine"],
      pricing: "Starting at $39/month",
      badge: "",
      color: "from-pink-500 to-violet-600"
    },
    {
      id: 5,
      name: "Data Intelligence Hub",
      icon: Zap,
      category: "Analytics & Insights",
      description: "Transform raw data into actionable insights with our comprehensive analytics platform that uses AI to identify patterns and predict trends.",
      features: ["Real-time Analytics", "Predictive Modeling", "Custom Dashboards", "API Integration"],
      pricing: "Starting at $99/month",
      badge: "Enterprise",
      color: "from-indigo-500 to-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-hero mb-6">
            Our AI-Powered Products
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover our comprehensive suite of AI solutions designed to transform every aspect of your business operations.
          </p>
        </div>

        {/* Dynamic Product Sections */}
        {!loading && sections.length > 0 && (
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {sections.filter(s => s.section_type === 'product').map((section) => (
                <DynamicSection key={section.id} section={section} />
              ))}
            </div>
          </div>
        )}

        {/* Fallback Products Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {products.map((product, index) => (
            <Card key={product.id} className="card-elevated p-8 hover:scale-[1.02] transition-all duration-300">
              <div className="flex items-start justify-between mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${product.color} rounded-xl flex items-center justify-center`}>
                  <product.icon className="w-8 h-8 text-white" />
                </div>
                {product.badge && (
                  <Badge className="bg-gradient-primary text-white px-3 py-1">
                    {product.badge}
                  </Badge>
                )}
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                  <p className="text-sm text-primary font-medium mb-3">{product.category}</p>
                  <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm">
                        <Star className="w-4 h-4 text-secondary mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-lg font-semibold text-primary">{product.pricing}</span>
                  <div className="space-x-3">
                    <Link to={`/products/${product.name.toLowerCase().replace(/\s+/g, '-').replace('&', '').replace('ai', 'ai').replace('360', '360')}`}>
                      <Button variant="outline" size="sm">Learn More</Button>
                    </Link>
                    <Link to={`/products/${product.name.toLowerCase().replace(/\s+/g, '-').replace('&', '').replace('ai', 'ai').replace('360', '360')}`}>
                      <Button className="btn-hero" size="sm">Get Started</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-primary rounded-2xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need a Custom Solution?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Our team of AI experts can develop tailored solutions that perfectly fit your unique business requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3">
                Contact Our Experts
              </Button>
            </Link>
            <Link to="/enterprise">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3">
                Enterprise Solutions
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Products;