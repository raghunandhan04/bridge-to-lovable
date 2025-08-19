-- Add blog_structure column to blogs table to support visual editor
ALTER TABLE blogs 
ADD COLUMN blog_structure JSONB;

-- Add index on blog_structure for better query performance
CREATE INDEX idx_blogs_blog_structure ON blogs USING GIN (blog_structure);

-- Add comment to describe the column
COMMENT ON COLUMN blogs.blog_structure IS 'Structured JSON data for visual blog editor including blocks, layout, and metadata';