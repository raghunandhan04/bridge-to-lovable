import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Solutions from "./pages/Solutions";
import Blog from "./pages/Blog";
import Docs from "./pages/Docs";
import Pricing from "./pages/Pricing";
import Contact from "./pages/Contact";
import Enterprise from "./pages/Enterprise";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import DynamicBlog from "./pages/DynamicBlog";

// Product Pages
import SmartCRM from "./pages/products/SmartCRM";
import PredictiveSalesAI from "./pages/products/PredictiveSalesAI";
import ChatBot360 from "./pages/products/ChatBot360";
import AIEmailOptimizer from "./pages/products/AIEmailOptimizer";
import DataIntelligenceHub from "./pages/products/DataIntelligenceHub";

// Solution Pages
import RetailEcommerce from "./pages/solutions/RetailEcommerce";
import Healthcare from "./pages/solutions/Healthcare";
import LogisticsSupplyChain from "./pages/solutions/LogisticsSupplyChain";
import FinancialServices from "./pages/solutions/FinancialServices";
import MarketingAutomation from "./pages/solutions/MarketingAutomation";
import SalesEnhancement from "./pages/solutions/SalesEnhancement";
import CustomerSupport from "./pages/solutions/CustomerSupport";
import OperationsOptimization from "./pages/solutions/OperationsOptimization";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/solutions" element={<Solutions />} />
            <Route path="/blog" element={<DynamicBlog />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/enterprise" element={<Enterprise />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<Admin />} />
            
            {/* Product Routes */}
            <Route path="/products/smartcrm" element={<SmartCRM />} />
            <Route path="/products/predictive-sales-ai" element={<PredictiveSalesAI />} />
            <Route path="/products/chatbot360" element={<ChatBot360 />} />
            <Route path="/products/ai-email-optimizer" element={<AIEmailOptimizer />} />
            <Route path="/products/data-intelligence-hub" element={<DataIntelligenceHub />} />
            
            {/* Solution Routes */}
            <Route path="/solutions/retail-ecommerce" element={<RetailEcommerce />} />
            <Route path="/solutions/healthcare" element={<Healthcare />} />
            <Route path="/solutions/logistics-supply-chain" element={<LogisticsSupplyChain />} />
            <Route path="/solutions/financial-services" element={<FinancialServices />} />
            <Route path="/solutions/marketing-automation" element={<MarketingAutomation />} />
            <Route path="/solutions/sales-enhancement" element={<SalesEnhancement />} />
            <Route path="/solutions/customer-support" element={<CustomerSupport />} />
            <Route path="/solutions/operations-optimization" element={<OperationsOptimization />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
