import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowLeft, Mail, Star, CheckCircle, Send, Target, TrendingUp } from "lucide-react";
import { InlinePricing } from "@/components/pricing/InlinePricing";
import emailOptimizerHero from "@/assets/email-optimizer-hero.jpg";

const AIEmailOptimizer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-hero mb-6">
            AI Email Optimizer
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Optimize email campaigns with AI-driven content generation, send-time optimization, and personalization that increases open rates and conversions.
          </p>
        </div>

        {/* Product Hero Carousel */}
        <Card className="card-elevated overflow-hidden mb-16">
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8">
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-violet-600 rounded-xl flex items-center justify-center mb-6">
                      <Mail className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Email Marketing, Perfected</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Harness AI to create compelling email content, optimize send times, and personalize messages for maximum engagement and conversion rates.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button className="btn-hero">Optimize My Emails</Button>
                      <Button variant="outline">View Results</Button>
                    </div>
                  </div>
                  <div className="relative">
                    <img 
                      src={emailOptimizerHero} 
                      alt="AI Email Optimizer Dashboard" 
                      className="w-full h-auto image-hero"
                    />
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8">
                  <div className="bg-gradient-to-br from-pink-500/10 to-violet-600/10 rounded-xl p-8">
                    <h3 className="text-2xl font-bold mb-4">Optimization Features</h3>
                    <div className="space-y-3">
                      {[
                        "Content Generation",
                        "Send-time Optimization",
                        "A/B Testing",
                        "Personalization Engine"
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-pink-50 dark:bg-pink-950/20 rounded-lg">
                      <Send className="w-8 h-8 text-pink-500" />
                      <div>
                        <h4 className="font-semibold">85% Open Rates</h4>
                        <p className="text-sm text-muted-foreground">Optimized send times</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-violet-50 dark:bg-violet-950/20 rounded-lg">
                      <Target className="w-8 h-8 text-violet-500" />
                      <div>
                        <h4 className="font-semibold">300% More Clicks</h4>
                        <p className="text-sm text-muted-foreground">AI-generated content</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                      <TrendingUp className="w-8 h-8 text-blue-500" />
                      <div>
                        <h4 className="font-semibold">60% Revenue Boost</h4>
                        <p className="text-sm text-muted-foreground">Campaign optimization</p>
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
            <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
              <Send className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Content Creation</h3>
            <p className="text-muted-foreground">
              AI generates compelling subject lines, email copy, and CTAs that resonate with your audience.
            </p>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-violet-500 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Perfect Timing</h3>
            <p className="text-muted-foreground">
              Analyze recipient behavior to determine optimal send times for maximum open rates.
            </p>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Hyper-Personalization</h3>
            <p className="text-muted-foreground">
              Create unique, personalized content for each recipient based on their preferences and behavior.
            </p>
          </Card>
        </div>

        {/* Pricing */}
        <Card className="card-elevated p-8 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Boost Your Email ROI</h2>
          <div className="text-4xl font-bold text-primary mb-2">Starting at $39</div>
          <div className="text-muted-foreground mb-6">per month</div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-hero">Start Optimizing</Button>
            <Link to="/contact">
              <Button variant="outline">Contact Sales</Button>
            </Link>
          </div>
        </Card>

        {/* Inline Pricing */}
        <InlinePricing itemKey="ai-email-optimizer" type="product" className="mb-16" />

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-pink-500 to-violet-600 rounded-2xl p-12 text-white mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to 10x Your Email Performance?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of marketers who've already transformed their email campaigns with AI.
          </p>
          <Button className="bg-white text-pink-600 hover:bg-gray-100 px-8 py-3">
            Start Free Trial
          </Button>
        </div>

      </div>
    </div>
  );
};

export default AIEmailOptimizer;