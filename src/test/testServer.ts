import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { mockBlogs, mockFeaturedBlogs } from './mocks/blogData';

export const testServer = setupServer(
  // Mock Supabase REST API endpoints
  http.get('https://tqpjqyjyidyargswfzga.supabase.co/rest/v1/blogs', ({ request }) => {
    const url = new URL(request.url);
    const select = url.searchParams.get('select');
    const status = url.searchParams.get('status');
    const featured = url.searchParams.get('featured');
    const category = url.searchParams.get('category');

    let blogs = mockBlogs;

    // Filter by status
    if (status === 'eq.published') {
      blogs = blogs.filter(blog => blog.status === 'published');
    }

    // Filter by featured
    if (featured === 'eq.true') {
      blogs = blogs.filter(blog => blog.featured === true);
    }

    // Filter by category
    if (category && category.startsWith('eq.')) {
      const categoryValue = category.replace('eq.', '');
      blogs = blogs.filter(blog => blog.category === categoryValue);
    }

    return HttpResponse.json(blogs);
  }),

  // Mock individual blog post endpoint
  http.get('https://tqpjqyjyidyargswfzga.supabase.co/rest/v1/blogs', ({ request }) => {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (id && id.startsWith('eq.')) {
      const blogId = id.replace('eq.', '');
      const blog = mockBlogs.find(b => b.id === blogId);
      return HttpResponse.json(blog ? [blog] : []);
    }

    return HttpResponse.json(mockBlogs);
  }),

  // Mock content sections endpoint
  http.get('https://tqpjqyjyidyargswfzga.supabase.co/rest/v1/content_sections', () => {
    return HttpResponse.json([]);
  }),

  // Mock auth endpoints
  http.get('https://tqpjqyjyidyargswfzga.supabase.co/auth/v1/user', () => {
    return HttpResponse.json(null, { status: 401 });
  })
);