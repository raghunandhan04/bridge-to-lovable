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
          className="fixed top-24 left-6 z-50 bg-background/90 backdrop-blur-md border border-border/40 hover:bg-accent/90 shadow-lg transition-all duration-200 flex items-center gap-2 text-xs px-3 py-1.5 min-w-fit"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
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