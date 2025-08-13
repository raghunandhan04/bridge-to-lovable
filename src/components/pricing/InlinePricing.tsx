import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, DollarSign } from "lucide-react";
import { PricingSection } from "./PricingSection";
import { productPricing, solutionPricing, PricingData } from "@/data/pricingData";

interface InlinePricingProps {
  itemKey: string;
  type: 'product' | 'solution';
  className?: string;
}

export const InlinePricing: React.FC<InlinePricingProps> = ({ itemKey, type, className = "" }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPricingData = (): PricingData | null => {
    if (type === 'product') {
      return productPricing[itemKey as keyof typeof productPricing] || null;
    } else {
      return solutionPricing[itemKey as keyof typeof solutionPricing] || null;
    }
  };

  const pricingData = getPricingData();

  if (!pricingData) {
    return null;
  }

  return (
    <div className={`inline-pricing ${className}`}>
      <div className="bg-muted/50 rounded-lg p-6 border">
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          variant="outline"
          className="w-full flex items-center justify-between"
        >
          <span className="flex items-center">
            <DollarSign className="w-4 h-4 mr-2" />
            View Pricing Plans
          </span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </Button>
        
        {isExpanded && (
          <div className="mt-6 animate-in slide-in-from-top duration-300">
            <PricingSection pricingData={pricingData} />
          </div>
        )}
      </div>
    </div>
  );
};