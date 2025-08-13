// Shared pricing data for products and solutions
export const productPricing = {
  'smartcrm': {
    name: 'SmartCRM',
    plans: [
      {
        name: 'Starter',
        monthlyPrice: 29,
        annualPrice: 290,
        features: ['Up to 1,000 contacts', 'Basic CRM features', 'Email integration', 'Mobile app access']
      },
      {
        name: 'Professional',
        monthlyPrice: 79,
        annualPrice: 790,
        popular: true,
        features: ['Up to 10,000 contacts', 'Advanced analytics', 'Automation workflows', 'API access', 'Priority support']
      },
      {
        name: 'Enterprise',
        monthlyPrice: null,
        annualPrice: null,
        features: ['Unlimited contacts', 'Custom integrations', 'Dedicated support', 'White-label options']
      }
    ]
  },
  'predictive-sales-ai': {
    name: 'Predictive Sales AI',
    plans: [
      {
        name: 'Basic',
        monthlyPrice: 49,
        annualPrice: 490,
        features: ['Basic forecasting', '10 sales models', 'Email support', 'Standard reports']
      },
      {
        name: 'Pro',
        monthlyPrice: 149,
        annualPrice: 1490,
        popular: true,
        features: ['Advanced forecasting', 'Unlimited models', 'Market analysis', 'Custom reports', 'Priority support']
      },
      {
        name: 'Enterprise',
        monthlyPrice: null,
        annualPrice: null,
        features: ['Custom AI models', 'Dedicated infrastructure', '24/7 support', 'Custom integrations']
      }
    ]
  },
  'chatbot360': {
    name: 'ChatBot360',
    plans: [
      {
        name: 'Starter',
        monthlyPrice: 19,
        annualPrice: 190,
        features: ['Up to 1,000 conversations/month', 'Basic NLP', '5 integrations', 'Email support']
      },
      {
        name: 'Growth',
        monthlyPrice: 59,
        annualPrice: 590,
        popular: true,
        features: ['Up to 10,000 conversations/month', 'Advanced NLP', 'Unlimited integrations', 'Live chat handoff', 'Priority support']
      },
      {
        name: 'Enterprise',
        monthlyPrice: null,
        annualPrice: null,
        features: ['Unlimited conversations', 'Custom AI training', 'Dedicated support', 'White-label solution']
      }
    ]
  },
  'ai-email-optimizer': {
    name: 'AI Email Optimizer',
    plans: [
      {
        name: 'Basic',
        monthlyPrice: 39,
        annualPrice: 390,
        features: ['Up to 5,000 emails/month', 'A/B testing', 'Basic analytics', 'Email templates']
      },
      {
        name: 'Professional',
        monthlyPrice: 99,
        annualPrice: 990,
        popular: true,
        features: ['Up to 50,000 emails/month', 'Advanced AI optimization', 'Predictive analytics', 'Custom templates', 'Priority support']
      },
      {
        name: 'Enterprise',
        monthlyPrice: null,
        annualPrice: null,
        features: ['Unlimited emails', 'Custom AI models', 'Dedicated support', 'Enterprise integrations']
      }
    ]
  },
  'data-intelligence-hub': {
    name: 'Data Intelligence Hub',
    plans: [
      {
        name: 'Professional',
        monthlyPrice: 199,
        annualPrice: 1990,
        features: ['Up to 10TB data processing', 'Real-time analytics', 'Standard integrations', 'Email support']
      },
      {
        name: 'Enterprise',
        monthlyPrice: 499,
        annualPrice: 4990,
        popular: true,
        features: ['Up to 100TB data processing', 'Advanced AI models', 'Custom integrations', 'Dedicated support']
      },
      {
        name: 'Enterprise Plus',
        monthlyPrice: null,
        annualPrice: null,
        features: ['Unlimited data processing', 'Custom AI development', '24/7 support', 'On-premise deployment']
      }
    ]
  }
};

export const solutionPricing = {
  'healthcare': {
    name: 'Healthcare Solutions',
    plans: [
      {
        name: 'Clinic',
        monthlyPrice: 299,
        annualPrice: 2990,
        features: ['Up to 100 patients/month', 'Basic diagnostics', 'HIPAA compliance', 'Email support']
      },
      {
        name: 'Hospital',
        monthlyPrice: 999,
        annualPrice: 9990,
        popular: true,
        features: ['Up to 10,000 patients/month', 'Advanced AI diagnostics', 'Integration suite', 'Priority support']
      },
      {
        name: 'Health System',
        monthlyPrice: null,
        annualPrice: null,
        features: ['Unlimited patients', 'Custom AI models', 'Dedicated support', 'Multi-facility deployment']
      }
    ]
  },
  'logistics-supply-chain': {
    name: 'Logistics & Supply Chain',
    plans: [
      {
        name: 'Basic',
        monthlyPrice: 199,
        annualPrice: 1990,
        features: ['Route optimization', 'Basic tracking', 'Standard reports', 'Email support']
      },
      {
        name: 'Professional',
        monthlyPrice: 599,
        annualPrice: 5990,
        popular: true,
        features: ['Advanced optimization', 'Real-time tracking', 'Predictive analytics', 'API access', 'Priority support']
      },
      {
        name: 'Enterprise',
        monthlyPrice: null,
        annualPrice: null,
        features: ['Custom optimization models', 'Enterprise integrations', 'Dedicated support', 'Multi-location deployment']
      }
    ]
  },
  'financial-services': {
    name: 'Financial Services',
    plans: [
      {
        name: 'Standard',
        monthlyPrice: 399,
        annualPrice: 3990,
        features: ['Basic fraud detection', 'Risk assessment', 'Compliance tools', 'Email support']
      },
      {
        name: 'Professional',
        monthlyPrice: 999,
        annualPrice: 9990,
        popular: true,
        features: ['Advanced fraud detection', 'Algorithmic trading', 'Advanced analytics', 'Priority support']
      },
      {
        name: 'Enterprise',
        monthlyPrice: null,
        annualPrice: null,
        features: ['Custom AI models', 'Dedicated infrastructure', '24/7 support', 'Regulatory compliance']
      }
    ]
  },
  'retail-ecommerce': {
    name: 'Retail & E-commerce',
    plans: [
      {
        name: 'Startup',
        monthlyPrice: 99,
        annualPrice: 990,
        features: ['Customer behavior analysis', 'Basic recommendations', 'Inventory insights', 'Email support']
      },
      {
        name: 'Growth',
        monthlyPrice: 299,
        annualPrice: 2990,
        popular: true,
        features: ['Advanced analytics', 'Dynamic pricing', 'Demand forecasting', 'API access', 'Priority support']
      },
      {
        name: 'Enterprise',
        monthlyPrice: null,
        annualPrice: null,
        features: ['Custom AI models', 'Multi-store support', 'Dedicated support', 'White-label solutions']
      }
    ]
  }
};

export type PricingPlan = {
  name: string;
  monthlyPrice: number | null;
  annualPrice: number | null;
  popular?: boolean;
  features: string[];
};

export type PricingData = {
  name: string;
  plans: PricingPlan[];
};