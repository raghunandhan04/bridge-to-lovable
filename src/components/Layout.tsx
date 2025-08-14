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
      {showBackButton && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleBack}
          className="fixed top-20 left-4 z-40 bg-background/95 backdrop-blur-sm border border-border/50 hover:bg-accent shadow-sm flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      )}
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;