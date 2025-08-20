import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { ArrowLeft, MessageSquare, Star, CheckCircle, Bot, Clock, Globe } from "lucide-react";
import { InlinePricing } from "@/components/pricing/InlinePricing";
import chatbotHero from "@/assets/chatbot360-hero.jpg";

const ChatBot360 = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white px-4 py-2 mb-6">
            New Release
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-hero mb-6">
            ChatBot360
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Intelligent conversational AI that provides 24/7 customer support, handles complex queries, and seamlessly escalates to human agents when needed.
          </p>
        </div>

        {/* Product Hero Carousel */}
        <Card className="card-elevated overflow-hidden mb-16">
          <Carousel className="w-full">
            <CarouselContent>
              <CarouselItem>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8">
                  <div>
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-6">
                      <MessageSquare className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">24/7 Intelligent Support</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Provide instant, intelligent customer support that never sleeps. ChatBot360 understands context, learns from interactions, and delivers personalized responses.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button className="btn-hero">Try ChatBot360</Button>
                      <Button variant="outline">Watch Demo</Button>
                    </div>
                  </div>
                  <div className="relative">
                    <img 
                      src={chatbotHero} 
                      alt="ChatBot360 Interface" 
                      className="w-full h-auto image-hero"
                    />
                  </div>
                </div>
              </CarouselItem>
              <CarouselItem>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center p-8">
                  <div className="bg-gradient-to-br from-orange-500/10 to-red-600/10 rounded-xl p-8">
                    <h3 className="text-2xl font-bold mb-4">Smart Features</h3>
                    <div className="space-y-3">
                      {[
                        "Natural Language Processing",
                        "Multi-language Support",
                        "Integration Ready",
                        "Analytics Dashboard"
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center">
                          <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                          <span className="font-medium">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                      <Clock className="w-8 h-8 text-orange-500" />
                      <div>
                        <h4 className="font-semibold">24/7 Availability</h4>
                        <p className="text-sm text-muted-foreground">Never miss a customer inquiry</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-red-50 dark:bg-red-950/20 rounded-lg">
                      <Globe className="w-8 h-8 text-red-500" />
                      <div>
                        <h4 className="font-semibold">50+ Languages</h4>
                        <p className="text-sm text-muted-foreground">Global customer support</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4 p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                      <Bot className="w-8 h-8 text-purple-500" />
                      <div>
                        <h4 className="font-semibold">98% Accuracy</h4>
                        <p className="text-sm text-muted-foreground">Understanding customer intent</p>
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
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center mb-4">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Conversations</h3>
            <p className="text-muted-foreground">
              Advanced NLP enables natural, contextual conversations that feel human-like.
            </p>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Seamless Handoffs</h3>
            <p className="text-muted-foreground">
              Intelligent escalation to human agents when complex issues require personal attention.
            </p>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Multi-Platform</h3>
            <p className="text-muted-foreground">
              Deploy across websites, mobile apps, social media, and messaging platforms.
            </p>
          </Card>
        </div>

        {/* Pricing */}
        <Card className="card-elevated p-8 text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Affordable AI Support</h2>
          <div className="text-4xl font-bold text-primary mb-2">Starting at $19</div>
          <div className="text-muted-foreground mb-6">per month</div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-hero">Start Free Trial</Button>
            <Link to="/contact">
              <Button variant="outline">Get Custom Quote</Button>
            </Link>
          </div>
        </Card>

        {/* Inline Pricing */}
        <InlinePricing itemKey="chatbot360" type="product" className="mb-16" />

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-12 text-white mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transform Customer Support Today
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Give your customers instant, intelligent support that improves satisfaction and reduces costs.
          </p>
          <Button className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-3">
            Deploy ChatBot360
          </Button>
        </div>

      </div>
    </div>
  );
};

export default ChatBot360;