import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Headphones, MessageCircle, Brain, Zap, Clock, Shield } from "lucide-react";
import { InlinePricing } from "@/components/pricing/InlinePricing";

const CustomerSupport = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mr-4">
              <Headphones className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-hero">
              AI-Powered Customer Support
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Deliver exceptional customer experiences with intelligent chatbots, automated ticket resolution, and 24/7 support capabilities.
          </p>
        </div>

        {/* Hero Card */}
        <Card className="card-elevated mb-16 overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/20 dark:to-rose-950/20">
            <div className="flex items-center mb-6">
              <MessageCircle className="w-12 h-12 text-pink-600 mr-4" />
              <div>
                <h2 className="text-3xl font-bold mb-2">Intelligent Support Automation</h2>
                <p className="text-muted-foreground text-lg">
                  Transform customer service with AI-powered chatbots, sentiment analysis, and automated resolution systems.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="font-bold text-2xl text-pink-600">24/7</div>
                <div className="text-sm text-muted-foreground">Availability</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-rose-600">90%</div>
                <div className="text-sm text-muted-foreground">Auto-Resolution</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-purple-600">80%</div>
                <div className="text-sm text-muted-foreground">Faster Response</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-indigo-600">95%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-hero flex-1">
                <Zap className="w-4 h-4 mr-2" />
                Start Free Trial
              </Button>
              <Button variant="outline" className="btn-outline flex-1">
                View Demo
              </Button>
            </div>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="card-gradient p-8">
            <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-rose-500 rounded-xl flex items-center justify-center mb-6">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Intelligent Chatbots</h3>
            <p className="text-muted-foreground mb-6">
              AI-powered conversational agents that understand context, handle complex queries, and provide human-like interactions.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                Natural language processing
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-rose-500 rounded-full mr-3"></div>
                Multi-language support
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Context-aware responses
              </li>
            </ul>
          </Card>

          <Card className="card-gradient p-8">
            <div className="w-14 h-14 bg-gradient-to-r from-rose-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Sentiment Analysis</h3>
            <p className="text-muted-foreground mb-6">
              Real-time emotion detection and sentiment analysis to prioritize urgent issues and route to appropriate agents.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-rose-500 rounded-full mr-3"></div>
                Real-time mood detection
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Escalation triggers
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                Customer satisfaction tracking
              </li>
            </ul>
          </Card>

          <Card className="card-gradient p-8">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl flex items-center justify-center mb-6">
              <Clock className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Ticket Automation</h3>
            <p className="text-muted-foreground mb-6">
              Smart ticket routing, automated categorization, and AI-suggested solutions for faster resolution times.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Intelligent ticket routing
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                Auto-categorization
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Solution recommendations
              </li>
            </ul>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="card-elevated mb-16 p-8">
          <h3 className="text-3xl font-bold text-center mb-8">Customer Support Excellence</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-600 mb-2">70%</div>
              <div className="text-muted-foreground">Cost Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-rose-600 mb-2">5x</div>
              <div className="text-muted-foreground">Faster Resolution</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">98%</div>
              <div className="text-muted-foreground">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">4.9/5</div>
              <div className="text-muted-foreground">Customer Rating</div>
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <InlinePricing itemKey="customer-support" type="solution" />

        {/* CTA Section */}
        <div className="text-center bg-gradient-hero rounded-2xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transform Your Customer Support
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Deliver world-class customer experiences with AI-powered support that scales with your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3"
              onClick={() => navigate('/contact')}
            >
              Enhance Support Now
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-3"
              onClick={() => navigate('/products')}
            >
              Explore Solutions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;