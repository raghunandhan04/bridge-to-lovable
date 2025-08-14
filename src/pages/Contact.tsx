import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Mail, Phone, MapPin, Clock, Send, Facebook, Twitter, Linkedin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate form submission
    toast({
      title: "Message Sent!",
      description: "Thank you for contacting us. We'll get back to you within 24 hours.",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      company: "",
      message: ""
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@hibiz.ai",
      description: "Send us an email anytime"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 6pm PST"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "123 Innovation Drive\nSan Francisco, CA 94105",
      description: "Our headquarters in SOMA"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Monday - Friday\n8:00 AM - 6:00 PM PST",
      description: "We're here to help"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 fade-in">
      <div className="container mx-auto px-4 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-hero mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have questions about our AI solutions? Our team of experts is here to help you transform your business.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card className="card-elevated p-8">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  placeholder="Your Company Name"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  name="message"
                  placeholder="Tell us about your project and how we can help..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="mt-1"
                />
              </div>
              
              <Button type="submit" className="w-full btn-hero">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {contactInfo.map((info, index) => (
                <Card key={index} className="card-elevated p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4">
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                  <p className="text-foreground font-medium whitespace-pre-line mb-1">{info.content}</p>
                  <p className="text-muted-foreground text-sm">{info.description}</p>
                </Card>
              ))}
            </div>

            {/* Map Placeholder */}
            <Card className="card-elevated p-6">
              <h3 className="font-semibold text-lg mb-4">Find Us</h3>
              <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-primary mx-auto mb-2" />
                  <p className="text-muted-foreground">Interactive map coming soon</p>
                  <p className="text-sm text-muted-foreground mt-1">123 Innovation Drive, San Francisco</p>
                </div>
              </div>
            </Card>

            {/* Social Media */}
            <Card className="card-elevated p-6">
              <h3 className="font-semibold text-lg mb-4">Follow Us</h3>
              <div className="flex space-x-4 justify-center">
                <a 
                  href="#" 
                  className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
                >
                  <Twitter className="w-5 h-5 text-white" />
                </a>
                <a 
                  href="#" 
                  className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center hover:scale-110 transition-transform duration-300"
                >
                  <Linkedin className="w-5 h-5 text-white" />
                </a>
              </div>
              <p className="text-center text-muted-foreground text-sm mt-4">
                Stay updated with our latest AI insights and company news
              </p>
            </Card>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-primary rounded-2xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Your AI Journey?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Let's discuss how our AI solutions can transform your business operations and drive growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/pricing">
              <Button className="bg-white text-primary hover:bg-gray-100 px-8 py-3">
                View Pricing
              </Button>
            </Link>
            <Link to="/enterprise">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary px-8 py-3">
                Enterprise Solutions
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;