import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Save, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  isAdmin?: boolean;
}

export const DynamicSection: React.FC<DynamicSectionProps> = ({ section, className = '', isAdmin = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title);
  const [editContent, setEditContent] = useState(section.content);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from('content_sections')
        .update({ title: editTitle, content: editContent })
        .eq('id', section.id);
      
      if (error) throw error;
      toast({ title: "Section updated successfully!" });
      setIsEditing(false);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };
  const renderContent = () => {
    switch (section.section_type) {
      case 'hero':
        return (
          <section className={`relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background overflow-hidden ${className}`}>
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
            <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
              <div className="max-w-4xl mx-auto space-y-8 relative">
                {isAdmin && (
                  <div className="absolute -top-12 right-0 flex gap-2">
                    {!isEditing ? (
                      <Button size="sm" onClick={() => setIsEditing(true)}><Edit className="w-4 h-4" /></Button>
                    ) : (
                      <>
                        <Button size="sm" onClick={handleSave}><Save className="w-4 h-4" /></Button>
                        <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}><X className="w-4 h-4" /></Button>
                      </>
                    )}
                  </div>
                )}
                {isEditing ? (
                  <input 
                    value={editTitle} 
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="text-5xl md:text-7xl font-bold leading-tight text-gradient bg-transparent border-2 border-dashed border-primary/50 p-2 w-full"
                  />
                 ) : (
                   <h1 
                     className="text-5xl md:text-7xl font-bold leading-tight"
                     data-section-id={section.id}
                     data-field="title"
                   >
                     <span className="text-gradient" data-editable-text>{section.title}</span>
                   </h1>
                 )}
                {isEditing ? (
                  <textarea 
                    value={editContent} 
                    onChange={(e) => setEditContent(e.target.value)}
                    className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed bg-transparent border-2 border-dashed border-primary/50 p-2 w-full h-32"
                  />
                 ) : (
                   <p 
                     className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                     data-section-id={section.id}
                     data-field="content"
                   >
                     <span data-editable-text>{section.content}</span>
                   </p>
                 )}
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
                  <div className="relative">
                    {section.image_url.includes('youtube.com') || section.image_url.includes('youtu.be') || section.image_url.includes('vimeo.com') ? (
                      <div className="aspect-video max-w-4xl mx-auto">
                        <iframe 
                          src={section.image_url.includes('youtube.com') ? section.image_url.replace('watch?v=', 'embed/') : section.image_url}
                          className="w-full h-full rounded-lg shadow-2xl"
                          allowFullScreen
                        />
                      </div>
                    ) : (
                      <img src={section.image_url} alt={section.title} className="mx-auto max-w-full h-auto image-hero" />
                    )}
                  </div>
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
                <h2 
                  className="text-4xl md:text-5xl font-bold text-hero mb-4"
                  data-section-id={section.id}
                  data-field="title"
                >
                  <span data-editable-text>{section.title}</span>
                </h2>
                <p 
                  className="text-xl text-muted-foreground max-w-2xl mx-auto"
                  data-section-id={section.id}
                  data-field="content"
                >
                  <span data-editable-text>{section.content}</span>
                </p>
              </div>
              {section.image_url && (
                <div className="flex justify-center mb-8">
                  <img src={section.image_url} alt={section.title} className="max-w-full h-auto image-float" />
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
                <h2 
                  className="text-4xl md:text-5xl font-bold text-hero"
                  data-section-id={section.id}
                  data-field="title"
                >
                  <span data-editable-text>{section.title}</span>
                </h2>
                <p 
                  className="text-xl text-muted-foreground"
                  data-section-id={section.id}
                  data-field="content"
                >
                  <span data-editable-text>{section.content}</span>
                </p>
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
                    <img src={section.image_url} alt={section.title} className="w-full max-w-2xl mx-auto image-hover" />
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'testimonial':
        return (
          <section className={`py-20 bg-muted/30 ${className}`}>
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-hero mb-4">{section.title}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{section.content}</p>
              </div>
              {section.data?.testimonials && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  {section.data.testimonials.map((testimonial: any, index: number) => (
                    <Card key={index} className="p-6">
                      <p className="text-lg mb-4">"{testimonial.content}"</p>
                      <div className="flex items-center gap-3">
                        {testimonial.avatar && <img src={testimonial.avatar} alt={testimonial.name} className="w-10 h-10 rounded-full image-card" />}
                        <div>
                          <p className="font-semibold">{testimonial.name}</p>
                          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        );

      case 'pricing':
        return (
          <section className={`py-20 bg-background ${className}`}>
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-hero mb-4">{section.title}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{section.content}</p>
              </div>
              {section.data?.plans && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {section.data.plans.map((plan: any, index: number) => (
                    <Card key={index} className={`p-8 ${plan.popular ? 'border-primary scale-105' : ''}`}>
                      {plan.popular && <div className="bg-primary text-white text-center py-1 mb-4 rounded">Most Popular</div>}
                      <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                      <div className="text-3xl font-bold mb-6">{plan.price}</div>
                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feature: string, idx: number) => (
                          <li key={idx} className="flex items-center">
                            <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <button className="w-full btn-primary">Get Started</button>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </section>
        );

      case 'contact':
        return (
          <section className={`py-20 bg-muted/30 ${className}`}>
            <div className="container mx-auto px-4 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-hero mb-4">{section.title}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{section.content}</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                <Card className="p-8">
                  <h3 className="text-2xl font-bold mb-6">Send us a message</h3>
                  <div className="space-y-4">
                    <input placeholder="Your Name" className="w-full p-3 border rounded-md" />
                    <input placeholder="Your Email" className="w-full p-3 border rounded-md" />
                    <textarea placeholder="Your Message" className="w-full p-3 border rounded-md h-32"></textarea>
                    <button className="btn-primary">Send Message</button>
                  </div>
                </Card>
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold">Get in touch</h3>
                  {section.data?.email && (
                    <div>
                      <h4 className="font-semibold">Email</h4>
                      <p className="text-muted-foreground">{section.data.email}</p>
                    </div>
                  )}
                  {section.data?.phone && (
                    <div>
                      <h4 className="font-semibold">Phone</h4>
                      <p className="text-muted-foreground">{section.data.phone}</p>
                    </div>
                  )}
                  {section.data?.address && (
                    <div>
                      <h4 className="font-semibold">Address</h4>
                      <p className="text-muted-foreground">{section.data.address}</p>
                    </div>
                  )}
                </div>
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
                <img src={section.image_url} alt={section.title} className="w-full h-48 object-cover image-card" />
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
              <img src={section.image_url} alt={section.title} className="w-full h-auto image-hover" />
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
              <img src={section.image_url} alt={section.title} className="w-full h-auto image-hover" />
            )}
          </div>
        );
    }
  };

  return <>{renderContent()}</>;
};