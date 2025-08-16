import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronDown, ArrowLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleBack = () => {
    console.log('Back button clicked'); // Debug log
    navigate(-1);
  };

  // Don't show back button on home page
  const showBackButton = location.pathname !== '/';

  const products = [
    { name: "SmartCRM", path: "/products/smartcrm" },
    { name: "Predictive Sales AI", path: "/products/predictive-sales-ai" },
    { name: "ChatBot360", path: "/products/chatbot360" },
    { name: "AI Email Optimizer", path: "/products/ai-email-optimizer" },
    { name: "Data Intelligence Hub", path: "/products/data-intelligence-hub" },
  ];

  const solutionsByIndustry = [
    { name: "Retail & E-commerce", path: "/solutions/retail-ecommerce" },
    { name: "Healthcare", path: "/solutions/healthcare" },
    { name: "Logistics & Supply Chain", path: "/solutions/logistics-supply-chain" },
    { name: "Financial Services", path: "/solutions/financial-services" },
  ];

  const solutionsByUseCase = [
    { name: "Marketing Automation", path: "/solutions/marketing-automation" },
    { name: "Sales Enhancement", path: "/solutions/sales-enhancement" },
    { name: "Operations Optimization", path: "/solutions/operations-optimization" },
    { name: "Customer Support", path: "/solutions/customer-support" },
  ];

  const navItems = [
    { name: "Blog", path: "/blog" },
    { name: "Docs", path: "/docs" },
    { name: "Pricing", path: "/pricing" },
    { name: "Contact Us", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-blur">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo with Back Button */}
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                className="bg-background/95 backdrop-blur-sm border border-border/50 hover:bg-accent shadow-sm flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            )}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-2xl font-bold text-gradient">Hibiz.ai</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {/* Products Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center font-medium transition-colors duration-300 hover:text-primary focus:outline-none">
                Products <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-background border border-border shadow-lg">
                {products.map((product) => (
                  <DropdownMenuItem key={product.name} className="p-0">
                    <Link 
                      to={product.path} 
                      className="w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {product.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem className="p-0 border-t border-border mt-1">
                  <Link 
                    to="/products" 
                    className="w-full px-3 py-2 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    View All Products
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Solutions Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center font-medium transition-colors duration-300 hover:text-primary focus:outline-none">
                Solutions <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-background border border-border shadow-lg">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  By Industry
                </div>
                {solutionsByIndustry.map((solution) => (
                  <DropdownMenuItem key={solution.name} className="p-0">
                    <Link 
                      to={solution.path} 
                      className="w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {solution.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-t border-border mt-1">
                  By Use Case
                </div>
                {solutionsByUseCase.map((solution) => (
                  <DropdownMenuItem key={solution.name} className="p-0">
                    <Link 
                      to={solution.path} 
                      className="w-full px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      {solution.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem className="p-0 border-t border-border mt-1">
                  <Link 
                    to="/solutions" 
                    className="w-full px-3 py-2 text-sm font-medium text-primary hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    View All Solutions
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`font-medium transition-colors duration-300 hover:text-primary ${
                  isActive(item.path) ? "text-primary font-semibold" : "text-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
            <Link to="/enterprise">
              <Button className="btn-hero">Enterprise Quote</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="lg:hidden bg-background border-t border-border animate-in slide-in-from-top-4 duration-300">
            <div className="px-4 py-6 space-y-4">
              {/* Products Mobile Menu */}
              <div>
                <div className="font-medium text-primary py-2">Products</div>
                <div className="pl-4 space-y-2">
                  {products.map((product) => (
                    <Link
                      key={product.name}
                      to={product.path}
                      className="block py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {product.name}
                    </Link>
                  ))}
                  <Link
                    to="/products"
                    className="block py-1 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    View All Products
                  </Link>
                </div>
              </div>

              {/* Solutions Mobile Menu */}
              <div>
                <div className="font-medium text-primary py-2">Solutions</div>
                <div className="pl-4 space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-1">
                    By Industry
                  </div>
                  {solutionsByIndustry.map((solution) => (
                    <Link
                      key={solution.name}
                      to={solution.path}
                      className="block py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {solution.name}
                    </Link>
                  ))}
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider py-1 pt-3">
                    By Use Case
                  </div>
                  {solutionsByUseCase.map((solution) => (
                    <Link
                      key={solution.name}
                      to={solution.path}
                      className="block py-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {solution.name}
                    </Link>
                  ))}
                  <Link
                    to="/solutions"
                    className="block py-1 text-sm text-primary font-medium hover:text-primary/80 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    View All Solutions
                  </Link>
                </div>
              </div>

              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`block py-2 font-medium transition-colors duration-300 ${
                    isActive(item.path) ? "text-primary font-semibold" : "text-foreground"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <Link to="/enterprise" onClick={() => setIsOpen(false)}>
                <Button className="btn-hero w-full mt-4">Enterprise Quote</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;