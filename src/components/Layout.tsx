import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "./ui/button";
import Navigation from "./Navigation";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <Button
        variant="ghost"
        size="sm"
        onClick={handleBack}
        className="fixed top-20 right-4 z-50 bg-background/80 backdrop-blur-sm border border-border hover:bg-accent"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
      <main className="flex-1 pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;