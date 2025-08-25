import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, TrendingUp, Target, Users, Zap, BarChart3, DollarSign } from "lucide-react";
import { InlinePricing } from "@/components/pricing/InlinePricing";

const SalesEnhancement = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mr-4">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-hero">
              AI-Powered Sales Enhancement
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Supercharge your sales performance with intelligent lead scoring, predictive analytics, and automated sales processes that close more deals.
          </p>
        </div>

        {/* Hero Card */}
        <Card className="card-elevated mb-16 overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950/20 dark:to-teal-950/20">
            <div className="flex items-center mb-6">
              <DollarSign className="w-12 h-12 text-green-600 mr-4" />
              <div>
                <h2 className="text-3xl font-bold mb-2">Intelligent Sales Pipeline</h2>
                <p className="text-muted-foreground text-lg">
                  Transform your sales process with AI-driven lead qualification, opportunity scoring, and automated follow-ups.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="font-bold text-2xl text-green-600">250%</div>
                <div className="text-sm text-muted-foreground">Sales Velocity</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-teal-600">40%</div>
                <div className="text-sm text-muted-foreground">Close Rate</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-emerald-600">60%</div>
                <div className="text-sm text-muted-foreground">Lead Quality</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-cyan-600">75%</div>
                <div className="text-sm text-muted-foreground">Rep Productivity</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-hero flex-1">
                <Zap className="w-4 h-4 mr-2" />
                Start Free Trial
              </Button>
              <Button variant="outline" className="btn-outline flex-1">
                Schedule Demo
              </Button>
            </div>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="card-gradient p-8">
            <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Lead Qualification</h3>
            <p className="text-muted-foreground mb-6">
              AI-powered lead scoring and qualification based on behavioral data, engagement patterns, and demographic information.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                Predictive lead scoring models
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                Real-time qualification updates
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                Automated lead routing
              </li>
            </ul>
          </Card>

          <Card className="card-gradient p-8">
            <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Sales Forecasting</h3>
            <p className="text-muted-foreground mb-6">
              Advanced predictive analytics for accurate sales forecasting, pipeline management, and revenue prediction.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                AI-powered revenue forecasting
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                Deal probability scoring
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                Pipeline health analytics
              </li>
            </ul>
          </Card>

          <Card className="card-gradient p-8">
            <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
              <Users className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Customer Intelligence</h3>
            <p className="text-muted-foreground mb-6">
              Deep customer insights and behavioral analysis to personalize sales approaches and improve conversion rates.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                Customer behavior analysis
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mr-3"></div>
                Purchase intent prediction
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-teal-500 rounded-full mr-3"></div>
                Personalized recommendations
              </li>
            </ul>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="card-elevated mb-16 p-8">
          <h3 className="text-3xl font-bold text-center mb-8">Sales Performance Impact</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">180%</div>
              <div className="text-muted-foreground">Revenue Growth</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-teal-600 mb-2">65%</div>
              <div className="text-muted-foreground">Faster Deal Closure</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-emerald-600 mb-2">45%</div>
              <div className="text-muted-foreground">Higher Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-cyan-600 mb-2">90%</div>
              <div className="text-muted-foreground">Forecast Accuracy</div>
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <InlinePricing itemKey="sales-enhancement" type="solution" />

        {/* CTA Section */}
        <div className="text-center bg-gradient-hero rounded-2xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Accelerate Your Sales?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Transform your sales process with AI-powered insights and automation that drives consistent revenue growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3"
              onClick={() => navigate('/contact')}
            >
              Boost Sales Now
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-primary px-8 py-3"
              onClick={() => navigate('/products')}
            >
              View Solutions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesEnhancement;