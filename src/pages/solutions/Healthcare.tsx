import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, Star, CheckCircle, Activity, Users, Shield, Zap } from "lucide-react";

const Healthcare = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 mb-6">
            Healthcare Solutions
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold text-hero mb-6">
            AI-Powered Healthcare
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Revolutionize patient care with AI-driven diagnostics, treatment recommendations, and operational efficiency improvements that enhance outcomes while reducing costs.
          </p>
        </div>

        {/* Solution Hero Card */}
        <Card className="card-elevated p-8 mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Transform Healthcare Delivery</h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our AI healthcare solutions improve patient outcomes, reduce operational costs, and enhance the quality of care through intelligent automation and predictive analytics.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-hero">
                  Request Demo
                </Button>
                <Button variant="outline">
                  View Case Studies
                </Button>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-600/10 rounded-xl p-8">
              <h3 className="text-2xl font-bold mb-4">Core Capabilities</h3>
              <div className="space-y-3">
                {[
                  "Diagnostic Assistance",
                  "Patient Management", 
                  "Treatment Optimization",
                  "Clinical Decision Support"
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
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-4">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">AI Diagnostics</h3>
            <p className="text-muted-foreground">
              Advanced machine learning models assist in medical imaging analysis and diagnostic accuracy improvement.
            </p>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Patient Management</h3>
            <p className="text-muted-foreground">
              Comprehensive patient data management with predictive analytics for personalized care plans.
            </p>
          </Card>
          
          <Card className="card-gradient p-6">
            <div className="w-12 h-12 bg-teal-500 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Compliance & Security</h3>
            <p className="text-muted-foreground">
              HIPAA-compliant solutions with advanced security measures to protect sensitive patient data.
            </p>
          </Card>
        </div>

        {/* Benefits Section */}
        <Card className="card-elevated p-8 text-center mb-16">
          <h2 className="text-3xl font-bold mb-8">Healthcare Transformation Benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-green-500 mb-2">40%</div>
              <div className="text-muted-foreground">Reduction in diagnostic errors</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-emerald-500 mb-2">60%</div>
              <div className="text-muted-foreground">Faster treatment decisions</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-teal-500 mb-2">25%</div>
              <div className="text-muted-foreground">Cost savings on operations</div>
            </div>
          </div>
        </Card>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-12 text-white mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Healthcare?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join leading healthcare organizations using our AI solutions to improve patient outcomes and operational efficiency.
          </p>
          <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3">
            Schedule Consultation
          </Button>
        </div>

      </div>
    </div>
  );
};

export default Healthcare;