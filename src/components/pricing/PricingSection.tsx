import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, Zap, Users, Building } from "lucide-react";
import { PricingData } from "@/data/pricingData";

interface PricingSectionProps {
  pricingData: PricingData;
  className?: string;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ pricingData, className = "" }) => {
  const [isAnnual, setIsAnnual] = useState(true);

  const calculatePrice = (plan: any) => {
    if (!plan.monthlyPrice) return null;
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getPerUserText = () => {
    return isAnnual ? " / year" : " / month";
  };

  const getIcon = (index: number) => {
    const icons = [Zap, Users, Building];
    return icons[index] || Building;
  };

  return (
    <div className={`pricing-section ${className}`}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-4">{pricingData.name} Pricing</h3>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4 bg-muted rounded-lg p-2">
            <span className={`px-3 py-1 rounded-md transition-colors text-sm ${!isAnnual ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}>
              Monthly
            </span>
            <Switch
              checked={isAnnual}
              onCheckedChange={setIsAnnual}
              className="data-[state=checked]:bg-primary"
            />
            <span className={`px-3 py-1 rounded-md transition-colors text-sm ${isAnnual ? 'bg-background shadow-sm font-medium' : 'text-muted-foreground'}`}>
              Annually
            </span>
            {isAnnual && (
              <Badge className="bg-secondary text-secondary-foreground">
                Save 20%
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pricingData.plans.map((plan, index) => {
          const IconComponent = getIcon(index);
          
          return (
            <Card 
              key={plan.name} 
              className={`card-elevated p-6 relative ${plan.popular ? 'ring-2 ring-primary scale-105' : ''} hover:scale-[1.02] transition-all duration-300`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1">
                  Most Popular
                </Badge>
              )}
              
              <div className="text-center mb-6">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center ${
                  plan.popular ? 'bg-gradient-primary' : 'bg-gradient-secondary'
                }`}>
                  <IconComponent className="w-6 h-6 text-white" />
                </div>
                
                <h4 className="text-xl font-bold mb-2">{plan.name}</h4>
                
                <div className="mb-4">
                  {calculatePrice(plan) ? (
                    <div>
                      <div className="flex items-baseline justify-center">
                        <span className="text-3xl font-bold">${calculatePrice(plan)}</span>
                        <span className="text-muted-foreground ml-1 text-sm">{getPerUserText()}</span>
                      </div>
                      {isAnnual && (
                        <p className="text-sm text-secondary font-medium mt-1">Save 20%</p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="text-2xl font-bold mb-1">Custom</div>
                      <p className="text-muted-foreground text-sm">Contact us</p>
                    </div>
                  )}
                </div>
                
                <Button className={`w-full ${plan.popular ? 'btn-hero' : 'btn-outline'}`}>
                  {plan.monthlyPrice ? 'Get Started' : 'Contact Sales'}
                </Button>
              </div>
              
              <div className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <Check className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};