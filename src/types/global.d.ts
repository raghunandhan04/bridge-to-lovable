// Global type declarations for window extensions
declare global {
  interface Window {
    __TEST_HOOKS__?: {
      setFormData?: (data: any) => void;
      setBlogStructure?: (structure: any) => void;
      fetchBlogs?: () => void;
      [key: string]: any;
    };
  }
}

export {};
