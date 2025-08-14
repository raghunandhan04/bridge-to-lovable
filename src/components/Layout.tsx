import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Navigation from "./Navigation";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-16 relative">
        {/* Global Back Button */}
        <div className="absolute top-4 right-4 z-10">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border shadow-sm hover:shadow-md transition-shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Hibiz.ai
          </Button>
        </div>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;