import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useContentSections = (pagePath: string = '') => {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSections();

    // Only subscribe in browser environments. Avoid running realtime
    // subscription logic in test/node environments where `window` may not exist.
    if (typeof window === 'undefined') return;

    // Subscribe to real-time updates
    const channel = supabase
      .channel('content-sections-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'content_sections' },
        () => {
          fetchSections();
        }
      )
      .subscribe();

    return () => {
      try {
        supabase.removeChannel(channel);
      } catch (e) {
        // swallow during teardown in non-browser environments
      }
    };
  }, [pagePath]);

  const fetchSections = async () => {
    try {
      setLoading(true);
      let query = supabase
        .from('content_sections')
        .select('*')
        .eq('visible', true)
        .order('display_order', { ascending: true });

      if (pagePath) {
        query = query.eq('page_path', pagePath);
      }

      const { data, error } = await query;

      if (error) throw error;
      setSections(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSectionsByType = (type: string) => 
    sections.filter(section => section.section_type === type);

  const getSectionByKey = (key: string) => 
    sections.find(section => section.section_key === key);

  return {
    sections,
    loading,
    error,
    getSectionsByType,
    getSectionByKey,
    refetch: fetchSections
  };
};