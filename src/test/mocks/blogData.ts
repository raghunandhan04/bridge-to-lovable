import { faker } from '@faker-js/faker';

export interface MockBlog {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: string;
  featured: boolean;
  status: string;
  created_at: string;
  updated_at: string;
  featured_image_url: string | null;
  author_id: string | null;
  slug: string;
  blog_structure: any;
}

// Generate consistent mock data
faker.seed(123);

export const mockBlogs: MockBlog[] = Array.from({ length: 15 }, (_, index) => ({
  id: faker.string.uuid(),
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(5, '\n\n'),
  excerpt: faker.lorem.sentences(2),
  category: faker.helpers.arrayElement(['ai-technology', 'business-insights', 'industry-trends', 'product-updates', 'customer-success']),
  featured: index < 5, // First 5 are featured
  status: 'published',
  created_at: faker.date.past().toISOString(),
  updated_at: faker.date.recent().toISOString(),
  featured_image_url: faker.image.url(),
  author_id: faker.string.uuid(),
  slug: faker.lorem.slug(),
  blog_structure: {
    blocks: [
      {
        type: 'paragraph',
        content: faker.lorem.paragraph()
      },
      {
        type: 'image',
        content: {
          url: faker.image.url(),
          caption: faker.lorem.sentence()
        }
      }
    ]
  }
}));

export const mockFeaturedBlogs = mockBlogs.filter(blog => blog.featured);

// Helper function to get blogs by category
export const getBlogsByCategory = (category: string) => 
  mockBlogs.filter(blog => blog.category === category);

// Helper function to get featured blog by category
export const getFeaturedBlogByCategory = (category: string) => 
  mockBlogs.find(blog => blog.category === category && blog.featured);