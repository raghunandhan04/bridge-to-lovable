import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowLeft, Zap, Star, CheckCircle, BarChart3, Database, Brain } from "lucide-react";
import dataIntelligenceHero from "@/assets/data-intelligence-hero.jpg";

const DataIntelligenceHub = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-4 py-2 mb-6">
            Enterprise
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-hero mb-6">
            Data Intelligence Hub
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform raw data into actionable insights with our comprehensive analytics platform that uses AI to identify patterns and predict trends.
          </p>
        </div>

        {/* Product Hero Carousel */}
        <Card className="card-elevated overflow-hidden mb-16">
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8">
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
                      <Zap className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Unlock Data's True Potential</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Turn complex data into clear insights with our enterprise-grade analytics platform powered by advanced AI and machine learning algorithms.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button className="btn-hero">Explore Platform</Button>
                      <Button variant="outline">Book Demo</Button>
                    </div>
                  </div>
                  <div className="relative">
                    <img 
                      src={dataIntelligenceHero} 
                      alt="Data Intelligence Hub Analytics Platform" 
                      className="w-full h-auto image-hero"
                    />
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8">
                  <div className="bg-gradient-to-br from-indigo-500/10 to-blue-600/10 rounded-xl p-8">
                    <h3 className="text-2xl font-bold mb-4">Platform Capabilities</h3>
                    <div className="space-y-3">
                      {[
                        "Real-time Analytics",
                        "Predictive Modeling",
                        "Custom Dashboards",
                        "API Integration"
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg">
                      <Database className="w-8 h-8 text-indigo-500" />
                      <div>
                        <h4 className="font-semibold">Petabyte Scale</h4>
                        <p className="text-sm text-muted-foreground">Handle massive datasets</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <BarChart3 className="w-8 h-8 text-blue-500" />
                      <div>
                        <h4 className="font-semibold">Real-time Processing</h4>
                        <p className="text-sm text-muted-foreground">Instant data analysis</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <Brain className="w-8 h-8 text-purple-500" />
                      <div>
                        <h4 className="font-semibold">ML Predictions</h4>
                        <p className="text-sm text-muted-foreground">Advanced forecasting</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Real-time Analytics</h3>
            <p className="text-muted-foreground">
              Monitor your business metrics in real-time with live dashboards and instant alerts.
            </p>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Predictive Models</h3>
            <p className="text-muted-foreground">
              AI-powered forecasting models that predict trends and identify opportunities.
            </p>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Universal Integration</h3>
            <p className="text-muted-foreground">
              Connect to any data source with our comprehensive API and connector library.
            </p>
          </Card>
        </div>

        {/* Pricing */}
        <Card className="card-elevated p-8 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Enterprise-Scale Analytics</h2>
          <div className="text-4xl font-bold text-primary mb-2">Starting at $99</div>
          <div className="text-muted-foreground mb-6">per user per month</div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-hero">Request Demo</Button>
            <Link to="/contact">
              <Button variant="outline">Enterprise Pricing</Button>
            </Link>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-indigo-500 to-blue-600 rounded-2xl p-12 text-white mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Turn Data Into Your Competitive Advantage
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Enterprise leaders choose Data Intelligence Hub to make smarter, faster decisions.
          </p>
          <Button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3">
            Schedule Consultation
          </Button>
        </div>

      </div>
    </div>
  );
};

export default DataIntelligenceHub;