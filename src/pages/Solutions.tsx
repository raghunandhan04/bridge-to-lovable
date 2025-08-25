import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  ChevronDown, 
  ChevronRight, 
  Store, 
  Heart, 
  Truck, 
  CreditCard, 
  Megaphone, 
  TrendingUp, 
  Settings, 
  Headphones 
} from "lucide-react";

const Solutions = () => {
  const [openCategory, setOpenCategory] = useState<string | null>("industry");

  const industries = [
    {
      name: "Retail & E-commerce",
      icon: Store,
      description: "Transform your retail operations with AI-powered inventory management, personalized recommendations, and predictive analytics.",
      solutions: ["Customer Behavior Analysis", "Inventory Optimization", "Price Optimization", "Demand Forecasting"],
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "Healthcare",
      icon: Heart,
      description: "Revolutionize patient care with AI-driven diagnostics, treatment recommendations, and operational efficiency improvements.",
      solutions: ["Diagnostic Assistance", "Patient Management", "Treatment Optimization", "Clinical Decision Support"],
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "Logistics & Supply Chain",
      icon: Truck,
      description: "Optimize your supply chain with intelligent routing, demand prediction, and real-time visibility across operations.",
      solutions: ["Route Optimization", "Demand Planning", "Warehouse Automation", "Risk Management"],
      color: "from-orange-500 to-red-500"
    },
    {
      name: "Financial Services",
      icon: CreditCard,
      description: "Enhance financial operations with AI-powered risk assessment, fraud detection, and customer service automation.",
      solutions: ["Fraud Detection", "Risk Assessment", "Algorithmic Trading", "Customer Onboarding"],
      color: "from-purple-500 to-pink-500"
    }
  ];

  const useCases = [
    {
      name: "Marketing Automation",
      icon: Megaphone,
      description: "Automate and optimize your marketing campaigns with AI-driven content creation, audience targeting, and performance analytics.",
      solutions: ["Content Generation", "Audience Segmentation", "Campaign Optimization", "Lead Scoring"],
      color: "from-indigo-500 to-blue-500"
    },
    {
      name: "Sales Enhancement",
      icon: TrendingUp,
      description: "Boost your sales performance with predictive analytics, lead prioritization, and automated sales processes.",
      solutions: ["Lead Qualification", "Sales Forecasting", "Pipeline Management", "Customer Intelligence"],
      color: "from-green-500 to-teal-500"
    },
    {
      name: "Operations Optimization",
      icon: Settings,
      description: "Streamline operations with intelligent process automation, resource optimization, and predictive maintenance.",
      solutions: ["Process Automation", "Resource Planning", "Quality Control", "Predictive Maintenance"],
      color: "from-yellow-500 to-orange-500"
    },
    {
      name: "Customer Support",
      icon: Headphones,
      description: "Enhance customer experience with AI-powered chatbots, sentiment analysis, and automated ticket resolution.",
      solutions: ["Intelligent Chatbots", "Sentiment Analysis", "Ticket Routing", "Knowledge Management"],
      color: "from-pink-500 to-rose-500"
    }
  ];

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-hero mb-6">
            AI Solutions for Every Business
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Discover tailored AI solutions designed for your industry and specific business use cases.
          </p>
        </div>

        {/* Main Navigation Links */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <Link to="/products">
            <Button variant="outline" className="btn-outline">Products</Button>
          </Link>
          <Link to="/solutions">
            <Button className="btn-hero">Solutions</Button>
          </Link>
          <Link to="/blog">
            <Button variant="outline" className="btn-outline">Blog</Button>
          </Link>
          <Link to="/docs">
            <Button variant="outline" className="btn-outline">Docs</Button>
          </Link>
          <Link to="/pricing">
            <Button variant="outline" className="btn-outline">Pricing</Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" className="btn-outline">Contact Us</Button>
          </Link>
          <Link to="/enterprise">
            <Button variant="outline" className="btn-outline">Enterprise Quote</Button>
          </Link>
        </div>

        {/* Solutions Categories */}
        <div className="space-y-8 mb-16">
          {/* By Industry */}
          <Card id="industry-solutions" className="card-elevated overflow-hidden">
            <div 
              className="p-6 cursor-pointer flex items-center justify-between bg-gradient-to-r from-primary/10 to-accent/10 hover:from-primary/20 hover:to-accent/20 transition-all duration-300"
              onClick={() => toggleCategory("industry")}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <Store className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Solutions by Industry</h2>
                  <p className="text-muted-foreground">Industry-specific AI solutions tailored to your sector</p>
                </div>
              </div>
              {openCategory === "industry" ? 
                <ChevronDown className="w-6 h-6 text-primary" /> : 
                <ChevronRight className="w-6 h-6 text-primary" />
              }
            </div>
            
            {openCategory === "industry" && (
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-300">
                {industries.map((industry, index) => {
                  const getRouteForIndustry = (name: string) => {
                    switch (name) {
                      case "Retail & E-commerce":
                        return "/solutions/retail-ecommerce";
                      case "Healthcare":
                        return "/solutions/healthcare";
                      case "Logistics & Supply Chain":
                        return "/solutions/logistics-supply-chain";
                      case "Financial Services":
                        return "/solutions/financial-services";
                      default:
                        return `/solutions/${name.toLowerCase().replace(/\s+/g, '-').replace('&', '')}`;
                    }
                  };
                  
                  return (
                    <Link key={index} to={getRouteForIndustry(industry.name)}>
                      <Card className="card-gradient p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                        <div className="flex items-start space-x-4">
                          <div className={`w-14 h-14 bg-gradient-to-r ${industry.color} rounded-xl flex items-center justify-center`}>
                            <industry.icon className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{industry.name}</h3>
                            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{industry.description}</p>
                            <div className="space-y-2">
                              {industry.solutions.map((solution, idx) => (
                                <Badge key={idx} variant="secondary" className="mr-2 mb-1">
                                  {solution}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>

          {/* By Use Case */}
          <Card id="usecase-solutions" className="card-elevated overflow-hidden">
            <div 
              className="p-6 cursor-pointer flex items-center justify-between bg-gradient-to-r from-secondary/10 to-primary/10 hover:from-secondary/20 hover:to-primary/20 transition-all duration-300"
              onClick={() => toggleCategory("usecase")}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-secondary-foreground" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Solutions by Use Case</h2>
                  <p className="text-muted-foreground">Function-specific AI solutions for every business area</p>
                </div>
              </div>
              {openCategory === "usecase" ? 
                <ChevronDown className="w-6 h-6 text-primary" /> : 
                <ChevronRight className="w-6 h-6 text-primary" />
              }
            </div>
            
            {openCategory === "usecase" && (
              <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-300">
                {useCases.map((useCase, index) => {
                  const getRouteForUseCase = (name: string) => {
                    switch (name) {
                      case "Marketing Automation":
                        return "/solutions/marketing-automation";
                      case "Sales Enhancement":
                        return "/solutions/sales-enhancement";
                      case "Operations Optimization":
                        return "/solutions/operations-optimization";
                      case "Customer Support":
                        return "/solutions/customer-support";
                      default:
                        return `/solutions/${name.toLowerCase().replace(/\s+/g, '-')}`;
                    }
                  };
                  
                  return (
                    <Link key={index} to={getRouteForUseCase(useCase.name)}>
                      <Card className="card-gradient p-6 hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                        <div className="flex items-start space-x-4">
                          <div className={`w-14 h-14 bg-gradient-to-r ${useCase.color} rounded-xl flex items-center justify-center`}>
                            <useCase.icon className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{useCase.name}</h3>
                            <p className="text-muted-foreground mb-4 text-sm leading-relaxed">{useCase.description}</p>
                            <div className="space-y-2">
                              {useCase.solutions.map((solution, idx) => (
                                <Badge key={idx} variant="secondary" className="mr-2 mb-1">
                                  {solution}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-hero rounded-2xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Implement Your AI Solution?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Our expert team will work with you to identify the perfect AI solution for your specific needs and industry requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact">
              <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3">
                Schedule Consultation
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3">
                View Our Products
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Solutions;