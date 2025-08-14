import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Truck, Star, CheckCircle, Package, Route, BarChart3, Clock } from "lucide-react";

const LogisticsSupplyChain = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 mb-6">
            Logistics & Supply Chain
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-hero mb-6">
            Smart Logistics Solutions
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Optimize your supply chain with intelligent routing, demand prediction, and real-time visibility across operations for maximum efficiency and cost reduction.
          </p>
        </div>

        {/* Solution Hero Card */}
        <Card className="card-elevated p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6">
                <Truck className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Revolutionize Your Supply Chain</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Transform logistics operations with AI-powered route optimization, predictive maintenance, and intelligent inventory management that reduces costs and improves delivery times.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-hero">
                  Get Started
                </Button>
                <Button variant="outline">
                  Watch Demo
                </Button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-500/10 to-red-600/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Key Solutions</h3>
              <div className="space-y-3">
                {[
                  "Route Optimization",
                  "Demand Planning", 
                  "Warehouse Automation",
                  "Risk Management"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
              <Route className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Routing</h3>
            <p className="text-muted-foreground">
              AI-powered route optimization that considers traffic, weather, and delivery constraints for maximum efficiency.
            </p>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Inventory Intelligence</h3>
            <p className="text-muted-foreground">
              Predictive inventory management that prevents stockouts and reduces carrying costs through demand forecasting.
            </p>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-time Tracking</h3>
            <p className="text-muted-foreground">
              Complete supply chain visibility with real-time tracking and automated alerts for proactive issue resolution.
            </p>
          </Card>
        </div>

        {/* ROI Section */}
        <Card className="card-elevated p-8 text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Supply Chain ROI</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-orange-500 mb-2">30%</div>
              <div className="text-muted-foreground">Reduction in transportation costs</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-red-500 mb-2">50%</div>
              <div className="text-muted-foreground">Faster delivery times</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-yellow-500 mb-2">40%</div>
              <div className="text-muted-foreground">Inventory cost reduction</div>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-12 text-white mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Optimize Your Supply Chain Today
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join industry leaders who have transformed their logistics operations with our AI-powered solutions.
          </p>
          <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3">
            Start Your Transformation
          </Button>
        </div>

      </div>
    </div>
  );
};

export default LogisticsSupplyChain;