import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Megaphone, Target, TrendingUp, Users, Zap, BarChart3 } from "lucide-react";
import { InlinePricing } from "@/components/pricing/InlinePricing";

const MarketingAutomation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-2xl flex items-center justify-center mr-4">
              <Megaphone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-hero">
              AI-Powered Marketing Automation
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Transform your marketing strategy with intelligent automation, personalized campaigns, and data-driven insights that drive results.
          </p>
        </div>

        {/* Hero Card */}
        <Card className="card-elevated mb-16 overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20">
            <div className="flex items-center mb-6">
              <Target className="w-12 h-12 text-indigo-600 mr-4" />
              <div>
                <h2 className="text-3xl font-bold mb-2">Smart Campaign Management</h2>
                <p className="text-muted-foreground text-lg">
                  Automate your entire marketing funnel with AI-driven content creation, audience targeting, and performance optimization.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="font-bold text-2xl text-indigo-600">5x</div>
                <div className="text-sm text-muted-foreground">Lead Generation</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-blue-600">80%</div>
                <div className="text-sm text-muted-foreground">Time Savings</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-purple-600">3x</div>
                <div className="text-sm text-muted-foreground">Conversion Rate</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-teal-600">60%</div>
                <div className="text-sm text-muted-foreground">Cost Reduction</div>
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
            <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Audience Segmentation</h3>
            <p className="text-muted-foreground mb-6">
              AI-powered customer segmentation based on behavior, preferences, and engagement patterns for highly targeted campaigns.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                Behavioral analysis and clustering
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Dynamic segment updates
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Predictive scoring models
              </li>
            </ul>
          </Card>

          <Card className="card-gradient p-8">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Campaign Optimization</h3>
            <p className="text-muted-foreground mb-6">
              Automatically optimize campaign performance with real-time A/B testing, content personalization, and timing optimization.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                Real-time performance tracking
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Automated A/B testing
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                Optimal send time prediction
              </li>
            </ul>
          </Card>

          <Card className="card-gradient p-8">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Analytics & Insights</h3>
            <p className="text-muted-foreground mb-6">
              Comprehensive analytics dashboard with predictive insights, ROI tracking, and actionable recommendations.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                Advanced attribution modeling
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                Predictive lifetime value
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-rose-500 rounded-full mr-3"></div>
                Custom reporting dashboards
              </li>
            </ul>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="card-elevated mb-16 p-8">
          <h3 className="text-3xl font-bold text-center mb-8">Marketing Performance Boost</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-indigo-600 mb-2">300%</div>
              <div className="text-muted-foreground">ROI Improvement</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">85%</div>
              <div className="text-muted-foreground">Email Open Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">45%</div>
              <div className="text-muted-foreground">Click-through Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-600 mb-2">92%</div>
              <div className="text-muted-foreground">Customer Satisfaction</div>
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <InlinePricing itemKey="marketing-automation" type="solution" />

        {/* CTA Section */}
        <div className="text-center bg-gradient-hero rounded-2xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Revolutionize Your Marketing?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using our AI-powered marketing automation to drive growth and increase revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3"
              onClick={() => navigate('/contact')}
            >
              Get Started Today
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-3"
              onClick={() => navigate('/products')}
            >
              Explore Products
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketingAutomation;