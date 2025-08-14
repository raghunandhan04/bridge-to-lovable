import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Store, ShoppingCart, TrendingUp, Users, Star } from "lucide-react";

const RetailEcommerce = () => {
  const solutions = [
    "Customer Behavior Analysis",
    "Inventory Optimization", 
    "Price Optimization",
    "Demand Forecasting"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 mb-6">
            Industry Solution
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-hero mb-6">
            Retail & E-commerce AI Solutions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your retail operations with AI-powered inventory management, personalized recommendations, and predictive analytics that drive sales and customer satisfaction.
          </p>
        </div>

        {/* Hero Card */}
        <Card className="card-elevated p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
                <Store className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Revolutionize Retail with AI</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                From predicting customer behavior to optimizing inventory levels, our AI solutions help retail businesses increase revenue, reduce costs, and enhance customer experiences.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-hero">
                  Explore Solutions
                </Button>
                <Link to="/contact">
                  <Button variant="outline">
                    Schedule Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Key Solutions</h3>
              <div className="space-y-3">
                {solutions.map((solution, index) => (
                  <div key={index} className="flex items-center">
                    <Star className="w-5 h-5 text-blue-500 mr-3" />
                    <span className="font-medium">{solution}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Solutions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Customer Behavior Analysis</h3>
            <p className="text-muted-foreground mb-4">
              Understand customer preferences, shopping patterns, and buying behavior to create personalized experiences that drive conversions.
            </p>
            <Badge variant="secondary">Personalization</Badge>
            <Badge variant="secondary" className="ml-2">Analytics</Badge>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center mb-4">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Inventory Optimization</h3>
            <p className="text-muted-foreground mb-4">
              AI-powered inventory management that prevents stockouts, reduces excess inventory, and optimizes warehouse operations.
            </p>
            <Badge variant="secondary">Supply Chain</Badge>
            <Badge variant="secondary" className="ml-2">Cost Reduction</Badge>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Dynamic Price Optimization</h3>
            <p className="text-muted-foreground mb-4">
              Real-time pricing strategies based on demand, competition, inventory levels, and market conditions to maximize revenue.
            </p>
            <Badge variant="secondary">Revenue Growth</Badge>
            <Badge variant="secondary" className="ml-2">Competitive</Badge>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Demand Forecasting</h3>
            <p className="text-muted-foreground mb-4">
              Predict future demand patterns using historical data, seasonal trends, and external factors to optimize planning and procurement.
            </p>
            <Badge variant="secondary">Planning</Badge>
            <Badge variant="secondary" className="ml-2">Forecasting</Badge>
          </Card>
        </div>

        {/* Use Cases */}
        <Card className="card-elevated p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Common Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">E-commerce Personalization</h3>
              <p className="text-sm text-muted-foreground">Product recommendations, personalized search, and targeted promotions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Store className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Store Operations</h3>
              <p className="text-sm text-muted-foreground">Staff optimization, layout planning, and customer flow analysis</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Supply Chain</h3>
              <p className="text-sm text-muted-foreground">Vendor management, logistics optimization, and quality control</p>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-12 text-white mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Retail Business?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join leading retailers who've already implemented our AI solutions to drive growth and improve customer satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3">
              Get Started Today
            </Button>
            <Link to="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3">
                Schedule Consultation
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RetailEcommerce;