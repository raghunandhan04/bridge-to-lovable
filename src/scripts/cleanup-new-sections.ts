import { supabase } from '@/integrations/supabase/client';

// Script to clean up any "New Section" entries created during editing
const cleanupNewSections = async () => {
  try {
    // Delete sections with "New Section" title or generated section keys
    const { error } = await supabase
      .from('content_sections')
      .delete()
      .or('title.eq.New Section,section_key.like.edited-content-%');
    
    if (error) {
      console.error('Error cleaning up sections:', error);
    } else {
      console.log('Successfully cleaned up new sections');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

// Auto-run the cleanup
cleanupNewSections();