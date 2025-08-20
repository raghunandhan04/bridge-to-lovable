import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowLeft, TrendingUp, Star, CheckCircle, BarChart3, Target, Zap } from "lucide-react";
import { InlinePricing } from "@/components/pricing/InlinePricing";
import predictiveSalesHero from "@/assets/predictive-sales-hero.jpg";

const PredictiveSalesAI = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-secondary text-secondary-foreground px-4 py-2 mb-6">
            Enterprise Favorite
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-hero mb-6">
            Predictive Sales AI
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Advanced machine learning algorithms that analyze market trends, customer data, and sales patterns to predict future revenue and identify growth opportunities.
          </p>
        </div>

        {/* Product Hero Carousel */}
        <Card className="card-elevated overflow-hidden mb-16">
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8">
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-6">
                      <TrendingUp className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Predict Your Sales Future</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Leverage the power of AI to forecast sales trends, identify market opportunities, and make data-driven decisions that drive sustainable growth.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button className="btn-hero">Start Free Trial</Button>
                      <Button variant="outline">View Demo</Button>
                    </div>
                  </div>
                  <div className="relative">
                    <img 
                      src={predictiveSalesHero} 
                      alt="Predictive Sales AI Analytics Dashboard" 
                      className="w-full h-auto image-hero"
                    />
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8">
                  <div className="bg-gradient-to-br from-green-500/10 to-teal-600/10 rounded-xl p-8">
                    <h3 className="text-2xl font-bold mb-4">Core Capabilities</h3>
                    <div className="space-y-3">
                      {[
                        "Revenue Forecasting",
                        "Market Analysis", 
                        "Opportunity Scoring",
                        "Performance Analytics"
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                      <Target className="w-8 h-8 text-green-500" />
                      <div>
                        <h4 className="font-semibold">95% Accuracy</h4>
                        <p className="text-sm text-muted-foreground">In revenue predictions</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-teal-50 dark:bg-teal-950/20 rounded-lg">
                      <BarChart3 className="w-8 h-8 text-teal-500" />
                      <div>
                        <h4 className="font-semibold">200% ROI Increase</h4>
                        <p className="text-sm text-muted-foreground">Average customer improvement</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <Zap className="w-8 h-8 text-blue-500" />
                      <div>
                        <h4 className="font-semibold">Real-time Analysis</h4>
                        <p className="text-sm text-muted-foreground">Instant market insights</p>
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
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Revenue Forecasting</h3>
            <p className="text-muted-foreground">
              Accurate revenue predictions based on historical performance and market conditions.
            </p>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Market Intelligence</h3>
            <p className="text-muted-foreground">
              Deep market analysis to identify trends, opportunities, and potential risks.
            </p>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Opportunity Scoring</h3>
            <p className="text-muted-foreground">
              AI-powered scoring system that ranks sales opportunities by likelihood to close.
            </p>
          </Card>
        </div>

        {/* Pricing */}
        <Card className="card-elevated p-8 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Enterprise-Grade Pricing</h2>
          <div className="text-4xl font-bold text-primary mb-2">Starting at $49</div>
          <div className="text-muted-foreground mb-6">per user per month</div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-hero">Start Free Trial</Button>
            <Link to="/contact">
              <Button variant="outline">Contact Sales</Button>
            </Link>
          </div>
        </Card>

        {/* Inline Pricing */}
        <InlinePricing itemKey="predictive-sales-ai" type="product" className="mb-16" />

        {/* CTA Section */}
        <div className="text-center bg-gradient-hero rounded-2xl p-12 text-white mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Unlock Your Sales Potential
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Start making smarter sales decisions with AI-powered predictions and insights.
          </p>
          <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3">
            Get Started Today
          </Button>
        </div>

      </div>
    </div>
  );
};

export default PredictiveSalesAI;