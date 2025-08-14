
import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import Navigation from "./Navigation";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    navigate(-1);
  };

  // Don't show back button on home page
  const showBackButton = location.pathname !== '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16">
        {showBackButton && (
          <div className="container mx-auto px-4 lg:px-8 pt-6 pb-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleBack}
              className="bg-background/90 backdrop-blur-md border border-border/40 hover:bg-accent/90 shadow-lg transition-all duration-200 flex items-center gap-2 text-xs px-3 py-1.5 min-w-fit mb-4"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
