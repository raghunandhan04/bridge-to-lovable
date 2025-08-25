import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Settings, Cog, BarChart3, Zap, Shield, Clock } from "lucide-react";
import { InlinePricing } from "@/components/pricing/InlinePricing";

const OperationsOptimization = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center mr-4">
              <Settings className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-hero">
              AI-Powered Operations Optimization
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Streamline your operations with intelligent process automation, predictive maintenance, and resource optimization for maximum efficiency.
          </p>
        </div>

        {/* Hero Card */}
        <Card className="card-elevated mb-16 overflow-hidden">
          <div className="p-8 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20">
            <div className="flex items-center mb-6">
              <Cog className="w-12 h-12 text-yellow-600 mr-4" />
              <div>
                <h2 className="text-3xl font-bold mb-2">Smart Process Automation</h2>
                <p className="text-muted-foreground text-lg">
                  Optimize your entire operation with AI-driven process automation, resource planning, and predictive analytics.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="font-bold text-2xl text-yellow-600">85%</div>
                <div className="text-sm text-muted-foreground">Cost Reduction</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-orange-600">60%</div>
                <div className="text-sm text-muted-foreground">Time Savings</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-amber-600">95%</div>
                <div className="text-sm text-muted-foreground">Process Efficiency</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-red-600">40%</div>
                <div className="text-sm text-muted-foreground">Error Reduction</div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="btn-hero flex-1">
                <Zap className="w-4 h-4 mr-2" />
                Start Optimization
              </Button>
              <Button variant="outline" className="btn-outline flex-1">
                Schedule Assessment
              </Button>
            </div>
          </div>
        </Card>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="card-gradient p-8">
            <div className="w-14 h-14 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center mb-6">
              <Cog className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Process Automation</h3>
            <p className="text-muted-foreground mb-6">
              Intelligent automation of repetitive tasks and workflows with AI-powered decision-making and adaptive learning.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                Workflow automation
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                Task prioritization
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-amber-500 rounded-full mr-3"></div>
                Exception handling
              </li>
            </ul>
          </Card>

          <Card className="card-gradient p-8">
            <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Resource Planning</h3>
            <p className="text-muted-foreground mb-6">
              AI-driven resource allocation and capacity planning to maximize efficiency and minimize waste across operations.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                Demand forecasting
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                Capacity optimization
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                Resource allocation
              </li>
            </ul>
          </Card>

          <Card className="card-gradient p-8">
            <div className="w-14 h-14 bg-gradient-to-r from-red-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Predictive Maintenance</h3>
            <p className="text-muted-foreground mb-6">
              Proactive maintenance scheduling and failure prediction to minimize downtime and extend equipment lifespan.
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                Failure prediction
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-pink-500 rounded-full mr-3"></div>
                Maintenance scheduling
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-rose-500 rounded-full mr-3"></div>
                Performance monitoring
              </li>
            </ul>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="card-elevated mb-16 p-8">
          <h3 className="text-3xl font-bold text-center mb-8">Operational Excellence Results</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600 mb-2">300%</div>
              <div className="text-muted-foreground">Productivity Boost</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">90%</div>
              <div className="text-muted-foreground">Downtime Reduction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-600 mb-2">50%</div>
              <div className="text-muted-foreground">Maintenance Costs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-pink-600 mb-2">99.5%</div>
              <div className="text-muted-foreground">System Reliability</div>
            </div>
          </div>
        </Card>

        {/* Pricing */}
        <InlinePricing itemKey="operations-optimization" type="solution" />

        {/* CTA Section */}
        <div className="text-center bg-gradient-hero rounded-2xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Optimize Your Operations Today
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Transform your operations with AI-powered automation and optimization that delivers measurable results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3"
              onClick={() => navigate('/contact')}
            >
              Start Optimization
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

export default OperationsOptimization;