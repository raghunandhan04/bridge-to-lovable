import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { PricingSection } from "@/components/pricing/PricingSection";
import { productPricing, solutionPricing } from "@/data/pricingData";

const Pricing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState<'product' | 'solution' | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    const productParam = searchParams.get('product');
    const solutionParam = searchParams.get('solution');
    
    if (productParam && productPricing[productParam as keyof typeof productPricing]) {
      setCategory('product');
      setSelectedItem(productParam);
    } else if (solutionParam && solutionPricing[solutionParam as keyof typeof solutionPricing]) {
      setCategory('solution');
      setSelectedItem(solutionParam);
    }
  }, [searchParams]);

  const handleCategorySelect = (selectedCategory: 'product' | 'solution') => {
    setCategory(selectedCategory);
    setSelectedItem(null);
    searchParams.delete('product');
    searchParams.delete('solution');
    setSearchParams(searchParams);
  };

  const handleItemSelect = (item: string) => {
    setSelectedItem(item);
    if (category === 'product') {
      searchParams.set('product', item);
      searchParams.delete('solution');
    } else if (category === 'solution') {
      searchParams.set('solution', item);
      searchParams.delete('product');
    }
    setSearchParams(searchParams);
  };

  const getCurrentPricingData = () => {
    if (category === 'product' && selectedItem) {
      return productPricing[selectedItem as keyof typeof productPricing];
    } else if (category === 'solution' && selectedItem) {
      return solutionPricing[selectedItem as keyof typeof solutionPricing];
    }
    return null;
  };

  const getDropdownItems = () => {
    if (category === 'product') {
      return Object.entries(productPricing).map(([key, value]) => ({
        value: key,
        label: value.name
      }));
    } else if (category === 'solution') {
      return Object.entries(solutionPricing).map(([key, value]) => ({
        value: key,
        label: value.name
      }));
    }
    return [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-hero mb-6">
            Find the Perfect Plan
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose pricing for our products or solutions and start transforming your business with AI today.
          </p>
        </div>

        {!category ? (
          /* Category Selection */
          <div className="max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl font-bold text-center mb-8">What are you looking for?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className="card-elevated p-8 cursor-pointer hover:scale-105 transition-all duration-300 text-center"
                onClick={() => handleCategorySelect('product')}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">P</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Products</h3>
                <p className="text-muted-foreground">Individual AI tools and platforms</p>
              </Card>
              
              <Card 
                className="card-elevated p-8 cursor-pointer hover:scale-105 transition-all duration-300 text-center"
                onClick={() => handleCategorySelect('solution')}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-secondary flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">S</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Solutions</h3>
                <p className="text-muted-foreground">Industry-specific AI solutions</p>
              </Card>
            </div>
          </div>
        ) : (
          /* Item Selection and Pricing */
          <div className="max-w-4xl mx-auto mb-16">
            <div className="text-center mb-8">
              <Button 
                variant="outline" 
                onClick={() => setCategory(null)}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Categories
              </Button>
              
              <h2 className="text-2xl font-bold mb-4">
                Select a {category === 'product' ? 'Product' : 'Solution'}
              </h2>
              
              <Select value={selectedItem || ""} onValueChange={handleItemSelect}>
                <SelectTrigger className="w-full max-w-md mx-auto">
                  <SelectValue placeholder={`Choose a ${category}...`} />
                </SelectTrigger>
                <SelectContent>
                  {getDropdownItems().map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedItem && getCurrentPricingData() && (
              <PricingSection pricingData={getCurrentPricingData()!} />
            )}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center bg-gradient-hero rounded-2xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using Hibiz.ai to transform their operations with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3">
              Start Free Trial
            </Button>
            <Link to="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3">
                Talk to Sales
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Pricing;