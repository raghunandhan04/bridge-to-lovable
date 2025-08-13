import React from 'react';
import { Card } from '@/components/ui/card';

interface ContentSection {
  id: string;
  section_key: string;
  title: string;
  content: string;
  image_url: string;
  data: any;
  section_type: string;
  page_path: string;
  display_order: number;
  visible: boolean;
}

interface DynamicSectionProps {
  section: ContentSection;
  className?: string;
}

export const DynamicSection: React.FC<DynamicSectionProps> = ({ section, className = '' }) => {
  const renderContent = () => {
    switch (section.section_type) {
      case 'hero':
        return (
          <section className={`relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden ${className}`}>
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
              <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                  <span className="text-gradient">{section.title}</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  {section.content}
                </p>
                {section.data?.buttons && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {section.data.buttons.map((button: any, index: number) => (
                      <a key={index} href={button.link}>
                        <button className={`btn-${button.style} text-lg px-8 py-4`}>
                          {button.text}
                        </button>
                      </a>
                    ))}
                  </div>
                )}
                {section.image_url && (
                  <img src={section.image_url} alt={section.title} className="mx-auto max-w-full h-auto rounded-lg shadow-2xl" />
                )}
              </div>
            </div>
          </section>
        );

      case 'feature':
        return (
          <section className={`py-20 bg-muted/30 ${className}`}>
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-hero mb-4">{section.title}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{section.content}</p>
              </div>
              {section.image_url && (
                <div className="flex justify-center mb-8">
                  <img src={section.image_url} alt={section.title} className="max-w-full h-auto rounded-lg shadow-lg" />
                </div>
              )}
              {section.data?.features && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {section.data.features.map((feature: any, index: number) => (
                    <Card key={index} className="card-elevated p-6 text-center hover:scale-105 transition-transform duration-300">
                      <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-2xl">✨</span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        );

      case 'stats':
        return (
          <section className={`py-20 bg-gradient-primary text-white ${className}`}>
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-bold mb-4">{section.title}</h2>
                <p className="text-xl opacity-90 max-w-2xl mx-auto">{section.content}</p>
              </div>
              {section.data?.stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
                  {section.data.stats.map((stat: any, index: number) => (
                    <div key={index} className="space-y-2">
                      <div className="text-4xl md:text-5xl font-bold">{stat.number}</div>
                      <div className="text-lg opacity-90">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        );

      case 'cta':
        return (
          <section className={`py-20 bg-background ${className}`}>
            <div className="container mx-auto px-4 lg:px-8 text-center">
              <div className="max-w-3xl mx-auto space-y-8">
                <h2 className="text-4xl md:text-5xl font-bold text-hero">{section.title}</h2>
                <p className="text-xl text-muted-foreground">{section.content}</p>
                {section.data?.buttons && (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {section.data.buttons.map((button: any, index: number) => (
                      <a key={index} href={button.link}>
                        <button className={`btn-${button.style} text-lg px-8 py-4`}>
                          {button.text}
                        </button>
                      </a>
                    ))}
                  </div>
                )}
                {section.image_url && (
                  <div className="mt-8">
                    <img src={section.image_url} alt={section.title} className="w-full max-w-2xl mx-auto rounded-lg shadow-lg" />
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'product':
      case 'solution':
        return (
          <Card className={`card-elevated p-8 hover:scale-[1.02] transition-all duration-300 ${className}`}>
            <div className="space-y-4">
              <h3 className="text-2xl font-bold">{section.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{section.content}</p>
              {section.image_url && (
                <img src={section.image_url} alt={section.title} className="w-full h-48 object-cover rounded-lg" />
              )}
              {section.data && section.data.features && (
                <ul className="space-y-2">
                  {section.data.features.map((feature: any, idx: number) => (
                    <li key={idx} className="flex items-center text-sm">
                      <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                      {typeof feature === 'string' ? feature : feature.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Card>
        );

      case 'image':
        return (
          <div className={`${className}`}>
            {section.image_url && (
              <img src={section.image_url} alt={section.title} className="w-full h-auto rounded-lg shadow-lg" />
            )}
            {section.title && <h3 className="text-xl font-semibold mt-4">{section.title}</h3>}
            {section.content && <p className="text-muted-foreground mt-2">{section.content}</p>}
          </div>
        );

      case 'text':
      default:
        return (
          <div className={`space-y-4 ${className}`}>
            {section.title && <h3 className="text-2xl font-bold">{section.title}</h3>}
            {section.content && (
              <div className="text-muted-foreground leading-relaxed">
                {section.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>
            )}
            {section.image_url && (
              <img src={section.image_url} alt={section.title} className="w-full h-auto rounded-lg shadow-lg" />
            )}
          </div>
        );
    }
  };

  return <>{renderContent()}</>;
};