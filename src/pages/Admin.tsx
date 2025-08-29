import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Edit, Trash } from 'lucide-react';
import BlogManager from '@/components/admin/BlogManager';
import ContentManager from '@/components/admin/ContentManager';
import TestManager from '@/components/admin/TestManager';
import LiveWebsitePreview from '@/components/admin/LiveWebsitePreview';

const Admin = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        navigate('/auth');
        return;
      }

      setUser(session.user);

      // Check user role
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .single();

      if (!roles || (roles.role !== 'admin' && roles.role !== 'editor')) {
        toast({
          title: "Access Denied",
          description: "You don't have admin or editor permissions.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      setUserRole(roles.role);
    } catch (error) {
      console.error('Auth check error:', error);
      navigate('/auth');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user || !userRole) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome, {user.email} ({userRole})
            </p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="blogs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="blogs">Blog Management</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
            <TabsTrigger value="tests">Test Reports</TabsTrigger>
            <TabsTrigger value="preview">Live Website Editor</TabsTrigger>
          </TabsList>

          <TabsContent value="blogs">
            <BlogManager userRole={userRole} />
          </TabsContent>

          <TabsContent value="content">
            <ContentManager userRole={userRole} />
          </TabsContent>

          <TabsContent value="tests">
            <TestManager userRole={userRole} />
          </TabsContent>

          <TabsContent value="preview">
            <LiveWebsitePreview />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;