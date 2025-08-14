import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, BookOpen, Code, Settings, HelpCircle, ChevronRight } from "lucide-react";

const Docs = () => {
  const [activeSection, setActiveSection] = useState("getting-started");

  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: BookOpen,
      items: [
        "Quick Start Guide",
        "Installation",
        "Authentication",
        "First API Call"
      ]
    },
    {
      id: "api-reference",
      title: "API Reference",
      icon: Code,
      items: [
        "Authentication API",
        "Products API",
        "Analytics API",
        "WebHooks API"
      ]
    },
    {
      id: "integration",
      title: "Integration Guide",
      icon: Settings,
      items: [
        "CRM Integration",
        "E-commerce Platforms",
        "Custom Integrations",
        "SDKs & Libraries"
      ]
    },
    {
      id: "faqs",
      title: "FAQs",
      icon: HelpCircle,
      items: [
        "General Questions",
        "Billing & Pricing",
        "Technical Support",
        "Security"
      ]
    }
  ];

  const content = {
    "getting-started": {
      title: "Getting Started with Hibiz.ai",
      content: `
        <h2>Welcome to Hibiz.ai Documentation</h2>
        <p>This guide will help you get started with our AI platform in just a few minutes.</p>
        
        <h3>Prerequisites</h3>
        <ul>
          <li>A Hibiz.ai account (sign up at <a href="/contact">hibiz.ai</a>)</li>
          <li>Basic knowledge of REST APIs</li>
          <li>Your preferred programming language</li>
        </ul>

        <h3>Step 1: Create Your Account</h3>
        <p>Sign up for a Hibiz.ai account and verify your email address. Once verified, you'll receive your API credentials.</p>

        <h3>Step 2: Get Your API Key</h3>
        <div class="code-block">
          <pre><code>
curl -X POST https://api.hibiz.ai/v1/auth/token \\
  -H "Content-Type: application/json" \\
  -d '{"email": "your-email@example.com", "password": "your-password"}'
          </code></pre>
        </div>

        <h3>Step 3: Make Your First API Call</h3>
        <div class="code-block">
          <pre><code>
curl -X GET https://api.hibiz.ai/v1/products \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"
          </code></pre>
        </div>
      `
    },
    "api-reference": {
      title: "API Reference",
      content: `
        <h2>Hibiz.ai API Reference</h2>
        <p>Our REST API provides access to all Hibiz.ai features and services.</p>

        <h3>Base URL</h3>
        <div class="code-block">
          <pre><code>https://api.hibiz.ai/v1</code></pre>
        </div>

        <h3>Authentication</h3>
        <p>All API requests require authentication using Bearer tokens.</p>
        <div class="code-block">
          <pre><code>Authorization: Bearer YOUR_API_KEY</code></pre>
        </div>

        <h3>Products Endpoint</h3>
        <h4>GET /products</h4>
        <p>Retrieve a list of available AI products.</p>
        
        <h4>Response</h4>
        <div class="code-block">
          <pre><code>
{
  "products": [
    {
      "id": "smartcrm",
      "name": "SmartCRM",
      "description": "AI-powered customer relationship management",
      "pricing": "$29/month"
    }
  ]
}
          </code></pre>
        </div>

        <h3>Analytics Endpoint</h3>
        <h4>POST /analytics/predict</h4>
        <p>Generate AI-powered predictions based on your data.</p>
        
        <h4>Request Body</h4>
        <div class="code-block">
          <pre><code>
{
  "data": [/* your data array */],
  "model": "sales_prediction",
  "timeframe": "30days"
}
          </code></pre>
        </div>
      `
    },
    "integration": {
      title: "Integration Guide",
      content: `
        <h2>Integration Guide</h2>
        <p>Learn how to integrate Hibiz.ai with your existing systems and workflows.</p>

        <h3>CRM Integration</h3>
        <p>Connect Hibiz.ai with popular CRM platforms like Salesforce, HubSpot, and Pipedrive.</p>

        <h4>Salesforce Integration</h4>
        <ol>
          <li>Install the Hibiz.ai Salesforce app from the AppExchange</li>
          <li>Configure your API credentials in the app settings</li>
          <li>Map your Salesforce fields to Hibiz.ai data models</li>
          <li>Enable real-time synchronization</li>
        </ol>

        <h3>E-commerce Platform Integration</h3>
        <p>Seamlessly integrate with Shopify, WooCommerce, and Magento.</p>

        <h4>Shopify Integration</h4>
        <div class="code-block">
          <pre><code>
// Install via Shopify CLI
shopify app generate extension --type=web_pixel

// Configure webhook endpoint
const webhook = {
  topic: 'orders/paid',
  address: 'https://api.hibiz.ai/v1/webhooks/shopify',
  format: 'json'
};
          </code></pre>
        </div>

        <h3>Custom Integrations</h3>
        <p>Build custom integrations using our comprehensive SDK.</p>

        <h4>JavaScript SDK</h4>
        <div class="code-block">
          <pre><code>
npm install @hibiz/ai-sdk

import { HibizAI } from '@hibiz/ai-sdk';

const client = new HibizAI({
  apiKey: 'your-api-key',
  environment: 'production'
});

const prediction = await client.predict({
  model: 'sales_forecast',
  data: salesData
});
          </code></pre>
        </div>
      `
    },
    "faqs": {
      title: "Frequently Asked Questions",
      content: `
        <h2>Frequently Asked Questions</h2>

        <h3>General Questions</h3>
        
        <h4>What is Hibiz.ai?</h4>
        <p>Hibiz.ai is a comprehensive AI platform that provides businesses with powerful automation, analytics, and machine learning capabilities to drive growth and efficiency.</p>

        <h4>How quickly can I get started?</h4>
        <p>Most customers are up and running within 24 hours. Our quick start guide and dedicated onboarding team ensure a smooth setup process.</p>

        <h4>Do you offer custom AI solutions?</h4>
        <p>Yes! Our enterprise team works with large organizations to develop custom AI solutions tailored to specific business needs.</p>

        <h3>Billing & Pricing</h3>

        <h4>How does billing work?</h4>
        <p>We offer flexible billing options including monthly and annual subscriptions. Enterprise customers can also choose custom billing cycles.</p>

        <h4>Can I change my plan anytime?</h4>
        <p>Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.</p>

        <h3>Technical Support</h3>

        <h4>What support channels are available?</h4>
        <p>We offer 24/7 email support for all customers, live chat for Pro and Enterprise customers, and dedicated phone support for Enterprise customers.</p>

        <h4>Do you provide implementation assistance?</h4>
        <p>Yes, our customer success team provides implementation guidance, and Enterprise customers receive dedicated technical account management.</p>

        <h3>Security</h3>

        <h4>How secure is my data?</h4>
        <p>We use enterprise-grade security including end-to-end encryption, SOC 2 compliance, and regular security audits. Your data is never shared with third parties.</p>

        <h4>Where is my data stored?</h4>
        <p>Data is stored in secure, geographically distributed data centers with automatic backups and disaster recovery capabilities.</p>
      `
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-hero mb-6">
            Documentation
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Everything you need to know to get started with Hibiz.ai and integrate our AI solutions into your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="card-elevated p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-4">Documentation</h3>
              <nav className="space-y-2">
                {sections.map((section) => (
                  <div key={section.id}>
                    <button
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors ${
                        activeSection === section.id
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <section.icon className="w-4 h-4" />
                        <span className="font-medium">{section.title}</span>
                      </div>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    {activeSection === section.id && (
                      <div className="ml-7 mt-2 space-y-1">
                        {section.items.map((item, index) => (
                          <button
                            key={index}
                            className="block w-full text-left p-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card className="card-elevated p-8">
              <div 
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: content[activeSection as keyof typeof content]?.content || "" 
                }}
              />
            </Card>
          </div>
        </div>

      </div>

      <style>{`
        .prose h2 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-bottom: 1rem;
          color: hsl(var(--primary));
        }
        .prose h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .prose h4 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .prose p {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: hsl(var(--muted-foreground));
        }
        .prose ul, .prose ol {
          margin-bottom: 1rem;
          padding-left: 1.5rem;
        }
        .prose li {
          margin-bottom: 0.5rem;
        }
        .code-block {
          background: hsl(var(--muted));
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
        }
        .code-block pre {
          margin: 0;
          color: hsl(var(--foreground));
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.875rem;
        }
        .prose a {
          color: hsl(var(--primary));
          text-decoration: underline;
        }
        .prose a:hover {
          color: hsl(var(--primary-hover));
        }
      `}</style>
    </div>
  );
};

export default Docs;