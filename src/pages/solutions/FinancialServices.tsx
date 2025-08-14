import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, Star, CheckCircle, Shield, TrendingUp, AlertTriangle, Users } from "lucide-react";

const FinancialServices = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 mb-6">
            Financial Services
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-hero mb-6">
            AI-Powered FinTech
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Enhance financial operations with AI-powered risk assessment, fraud detection, algorithmic trading, and customer service automation for superior performance and security.
          </p>
        </div>

        {/* Solution Hero Card */}
        <Card className="card-elevated p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-6">
                <CreditCard className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Transform Financial Operations</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Leverage advanced AI to enhance risk management, detect fraud in real-time, optimize trading strategies, and deliver exceptional customer experiences in the financial sector.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-hero">
                  Request Demo
                </Button>
                <Button variant="outline">
                  Compliance Guide
                </Button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500/10 to-pink-600/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Financial AI Solutions</h3>
              <div className="space-y-3">
                {[
                  "Fraud Detection",
                  "Risk Assessment", 
                  "Algorithmic Trading",
                  "Customer Onboarding"
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
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Fraud Detection</h3>
            <p className="text-muted-foreground">
              Real-time fraud detection using machine learning to identify suspicious patterns and prevent financial crimes.
            </p>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center mb-4">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Risk Management</h3>
            <p className="text-muted-foreground">
              Advanced risk assessment models that evaluate creditworthiness and market risks with unprecedented accuracy.
            </p>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Smart Trading</h3>
            <p className="text-muted-foreground">
              AI-powered algorithmic trading systems that analyze market data and execute optimal trading strategies.
            </p>
          </Card>
        </div>

        {/* Performance Metrics */}
        <Card className="card-elevated p-8 text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Financial Performance Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-purple-500 mb-2">95%</div>
              <div className="text-muted-foreground">Fraud detection accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-500 mb-2">70%</div>
              <div className="text-muted-foreground">Faster loan processing</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-500 mb-2">35%</div>
              <div className="text-muted-foreground">Trading performance improvement</div>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-12 text-white mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Secure Your Financial Future
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join leading financial institutions using our AI solutions to enhance security, performance, and customer satisfaction.
          </p>
          <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">
            Get Financial AI Demo
          </Button>
        </div>

      </div>
    </div>
  );
};

export default FinancialServices;