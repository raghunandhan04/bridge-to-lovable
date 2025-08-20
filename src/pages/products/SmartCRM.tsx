import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowLeft, Users, Star, CheckCircle, TrendingUp, BarChart3, Zap } from "lucide-react";
import { InlinePricing } from "@/components/pricing/InlinePricing";
import smartCrmHero from "@/assets/smartcrm-hero.jpg";

const SmartCRM = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-primary text-white px-4 py-2 mb-6">
            Most Popular
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-hero mb-6">
            SmartCRM
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            AI-powered customer relationship management that predicts customer behavior, automates follow-ups, and optimizes sales pipelines for maximum conversion.
          </p>
        </div>

        {/* Product Hero Carousel */}
        <Card className="card-elevated overflow-hidden mb-16">
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8">
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-6">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Transform Your Customer Relationships</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      SmartCRM leverages advanced AI to give you unprecedented insights into your customers, automate routine tasks, and help your sales team close more deals faster.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button className="btn-hero">Start Free Trial</Button>
                      <Button variant="outline">Schedule Demo</Button>
                    </div>
                  </div>
                  <div className="relative">
                    <img 
                      src={smartCrmHero} 
                      alt="SmartCRM Dashboard Interface" 
                      className="w-full h-auto image-hero"
                    />
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl p-8">
                    <h3 className="text-2xl font-bold mb-4">Key Features</h3>
                    <div className="space-y-3">
                      {[
                        "Predictive Lead Scoring",
                        "Automated Workflows",
                        "Sales Forecasting",
                        "Customer Insights"
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-blue-500" />
                      <div>
                        <h4 className="font-semibold">150% Revenue Growth</h4>
                        <p className="text-sm text-muted-foreground">Average increase for our customers</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <BarChart3 className="w-8 h-8 text-purple-500" />
                      <div>
                        <h4 className="font-semibold">90% Lead Accuracy</h4>
                        <p className="text-sm text-muted-foreground">AI-powered lead scoring precision</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <Zap className="w-8 h-8 text-green-500" />
                      <div>
                        <h4 className="font-semibold">5x Faster Setup</h4>
                        <p className="text-sm text-muted-foreground">Quick implementation and onboarding</p>
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
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Predictive Analytics</h3>
            <p className="text-muted-foreground">
              AI algorithms analyze customer behavior patterns to predict which leads are most likely to convert.
            </p>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Automated Workflows</h3>
            <p className="text-muted-foreground">
              Set up intelligent automation that handles follow-ups, task assignments, and pipeline management.
            </p>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Sales Forecasting</h3>
            <p className="text-muted-foreground">
              Get accurate revenue predictions based on historical data and current pipeline health.
            </p>
          </Card>
        </div>

        {/* Pricing */}
        <Card className="card-elevated p-8 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <div className="text-4xl font-bold text-primary mb-2">Starting at $29</div>
          <div className="text-muted-foreground mb-6">per user per month</div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-hero">Start Free Trial</Button>
            <Link to="/contact">
              <Button variant="outline">Contact Sales</Button>
            </Link>
          </div>
        </Card>

        {/* Inline Pricing */}
        <InlinePricing itemKey="smartcrm" type="product" className="mb-16" />

        {/* CTA Section */}
        <div className="text-center bg-gradient-primary rounded-2xl p-12 text-white mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Sales Process?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using SmartCRM to boost their sales performance.
          </p>
          <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3">
            Get Started Today
          </Button>
        </div>

      </div>
    </div>
  );
};

export default SmartCRM;