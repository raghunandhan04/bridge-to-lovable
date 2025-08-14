import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Building, Shield, Headphones, Zap, Users, Globe, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Enterprise = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    teamSize: "",
    productService: "",
    requirements: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Enterprise Inquiry Submitted!",
      description: "Our enterprise team will contact you within 24 hours to discuss your custom solution.",
    });
    
    setFormData({
      name: "",
      email: "",
      company: "",
      teamSize: "",
      productService: "",
      requirements: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const enterpriseFeatures = [
    {
      icon: Shield,
      title: "Advanced Security & Compliance",
      description: "SOC 2 Type II, GDPR compliance, custom data retention policies, and enterprise-grade encryption."
    },
    {
      icon: Headphones,
      title: "Dedicated Support Team",
      description: "24/7 priority support with dedicated technical account manager and guaranteed response times."
    },
    {
      icon: Zap,
      title: "Custom AI Model Development",
      description: "Tailored machine learning models built specifically for your business requirements and data."
    },
    {
      icon: Users,
      title: "Unlimited Team Members",
      description: "No limits on team size with advanced role-based access controls and user management."
    },
    {
      icon: Globe,
      title: "Global Infrastructure",
      description: "Multi-region deployment options with data residency controls and high availability guarantees."
    },
    {
      icon: Building,
      title: "On-Premise Deployment",
      description: "Deploy Hibiz.ai within your own infrastructure for maximum security and control."
    }
  ];

  const useCases = [
    {
      title: "Fortune 500 Retail Chain",
      description: "Implemented AI-powered inventory optimization across 1,000+ stores, reducing costs by 30% and improving stock availability by 25%."
    },
    {
      title: "Global Financial Services",
      description: "Deployed custom fraud detection models processing 10M+ transactions daily with 99.9% accuracy and 50% reduction in false positives."
    },
    {
      title: "Healthcare Network",
      description: "Built predictive analytics platform for 200+ hospitals, improving patient outcomes and reducing readmission rates by 20%."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-hero mb-6">
            Custom Solutions for Large Teams
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Powerful AI solutions designed for enterprises with 20+ users, custom requirements, and advanced security needs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Enterprise Form */}
          <Card className="card-elevated p-8">
            <h2 className="text-2xl font-bold mb-6">Get Your Custom Quote</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Business Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="company">Company Name *</Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Your Company Name"
                  value={formData.company}
                  onChange={handleChange}
                  required
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="teamSize">Team Size *</Label>
                <Select name="teamSize" value={formData.teamSize} onValueChange={(value) => setFormData({...formData, teamSize: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="20-50">20-50 users</SelectItem>
                    <SelectItem value="51-100">51-100 users</SelectItem>
                    <SelectItem value="101-500">101-500 users</SelectItem>
                    <SelectItem value="500+">500+ users</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="productService">Product/Service of Interest *</Label>
                <Select name="productService" value={formData.productService} onValueChange={(value) => setFormData({...formData, productService: value})}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select product or service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="smartcrm">SmartCRM</SelectItem>
                    <SelectItem value="predictive-sales">Predictive Sales AI</SelectItem>
                    <SelectItem value="chatbot360">ChatBot 360</SelectItem>
                    <SelectItem value="email-optimizer">AI Email Optimizer</SelectItem>
                    <SelectItem value="data-intelligence">Data Intelligence Hub</SelectItem>
                    <SelectItem value="healthcare">Healthcare Solutions</SelectItem>
                    <SelectItem value="financial-services">Financial Services</SelectItem>
                    <SelectItem value="retail-ecommerce">Retail & E-commerce</SelectItem>
                    <SelectItem value="logistics-supply">Logistics & Supply Chain</SelectItem>
                    <SelectItem value="custom-solution">Custom AI Solution</SelectItem>
                    <SelectItem value="multiple-products">Multiple Products</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="requirements">Project Requirements *</Label>
                <Textarea
                  id="requirements"
                  name="requirements"
                  placeholder="Describe your specific requirements, use cases, and any compliance needs..."
                  value={formData.requirements}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="mt-1"
                />
              </div>
              
              <Button type="submit" className="w-full btn-hero">
                <Phone className="w-4 h-4 mr-2" />
                Request Callback
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground text-center">
                Our enterprise team will contact you within 24 hours to discuss your requirements and provide a custom quote.
              </p>
            </div>
          </Card>

          {/* Enterprise Features */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">Enterprise Features</h2>
            <div className="grid grid-cols-1 gap-6">
              {enterpriseFeatures.map((feature, index) => (
                <Card key={index} className="card-gradient p-6 hover:scale-[1.02] transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Success Stories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Enterprise Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="card-elevated p-6 text-center">
                <h3 className="font-semibold text-lg mb-4 text-primary">{useCase.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{useCase.description}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Info */}
        <div className="text-center bg-gradient-hero rounded-2xl p-12 text-white mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Enterprise Pricing
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Our enterprise solutions are tailored to your specific needs, team size, and requirements. 
            Pricing typically starts at $500/month for teams of 20+ users with volume discounts available.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Flexible Pricing</h3>
              <p className="text-sm opacity-90">Custom pricing based on your team size and usage requirements</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Volume Discounts</h3>
              <p className="text-sm opacity-90">Significant savings for larger teams and multi-year commitments</p>
            </div>
            <div className="bg-white/10 rounded-xl p-6">
              <h3 className="font-semibold text-lg mb-2">Custom Terms</h3>
              <p className="text-sm opacity-90">Flexible billing cycles and payment terms to match your budget</p>
            </div>
          </div>
        </div>

        {/* Contact Enterprise Team */}
        <Card className="card-elevated p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need to Speak with Our Enterprise Team?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Our enterprise specialists are available to discuss your specific requirements, 
            provide demos, and help you understand how Hibiz.ai can transform your organization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-hero">
              Schedule Demo
            </Button>
            <Link to="/contact">
              <Button variant="outline" className="btn-outline">
                Contact Sales Team
              </Button>
            </Link>
          </div>
        </Card>

      </div>
    </div>
  );
};

export default Enterprise;