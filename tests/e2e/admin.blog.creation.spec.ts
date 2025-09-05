import { test, expect } from '@playwright/test';

test.describe('Admin Blog Creation Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to admin login page
    await page.goto('/auth');
    
    // Mock authentication for admin user
    await page.evaluate(() => {
      localStorage.setItem('sb-localhost-auth-token', JSON.stringify({
        access_token: 'mock-admin-token',
        user: {
          id: 'admin-user-id',
          email: 'admin@test.com',
          role: 'admin'
        }
      }));
    });
    
    // Navigate to admin dashboard
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
  });

  test('should create a new blog post with rich text content', async ({ page }) => {
    test.setTimeout(60000);
    
    // Click on Blog Manager tab
    await page.click('[data-testid="blog-manager-tab"]');
    
    // Click Create New Blog button
    await page.click('[data-testid="create-blog-button"]');
    
    // Fill in blog details
    await page.fill('[data-testid="blog-title-input"]', 'New AI Technology Trends');
    await page.fill('[data-testid="blog-slug-input"]', 'new-ai-technology-trends');
    await page.fill('[data-testid="blog-excerpt-input"]', 'Exploring the latest trends in artificial intelligence and machine learning.');
    
    // Select category
    await page.click('[data-testid="blog-category-select"]');
    await page.click('[data-value="technology"]');
    
    // Add rich text content
    await page.click('[data-testid="rich-text-editor"]');
    await page.type('[data-testid="rich-text-editor"]', 'This is a comprehensive article about AI trends...');
    
    // Upload featured image
    await page.setInputFiles('[data-testid="featured-image-upload"]', 'tests/fixtures/test-image.jpg');
    
    // Set as featured
    await page.click('[data-testid="featured-toggle"]');
    
    // Save blog
    await page.click('[data-testid="save-blog-button"]');
    
    // Verify success message
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Blog created successfully');
    
    // Verify blog appears in list
    await expect(page.locator('[data-testid="blog-list"]')).toContainText('New AI Technology Trends');
  });

  test('should create a blog using drag-and-drop structured editor', async ({ page }) => {
    test.setTimeout(60000);
    
    await page.click('[data-testid="blog-manager-tab"]');
    await page.click('[data-testid="create-blog-button"]');
    
    // Switch to structured editor
    await page.click('[data-testid="structured-editor-tab"]');
    
    // Fill basic info
    await page.fill('[data-testid="blog-title-input"]', 'Interactive Product Demo');
    await page.fill('[data-testid="blog-slug-input"]', 'interactive-product-demo');
    
    // Add content blocks using drag and drop
    await page.dragAndDrop('[data-testid="text-block-template"]', '[data-testid="editor-canvas"]');
    await page.fill('[data-testid="text-block-content"]', 'Welcome to our product demonstration');
    
    await page.dragAndDrop('[data-testid="image-text-block-template"]', '[data-testid="editor-canvas"]');
    await page.fill('[data-testid="image-text-content"]', 'Our platform offers cutting-edge solutions');
    await page.setInputFiles('[data-testid="block-image-upload"]', 'tests/fixtures/product-demo.jpg');
    
    await page.dragAndDrop('[data-testid="cta-block-template"]', '[data-testid="editor-canvas"]');
    await page.fill('[data-testid="cta-button-text"]', 'Try Demo');
    await page.fill('[data-testid="cta-button-link"]', '/demo');
    
    // Preview the blog
    await page.click('[data-testid="preview-blog-button"]');
    await expect(page.locator('[data-testid="blog-preview"]')).toBeVisible();
    await expect(page.locator('[data-testid="blog-preview"]')).toContainText('Interactive Product Demo');
    
    // Save blog
    await page.click('[data-testid="save-blog-button"]');
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Blog created successfully');
  });

  test('should validate required fields and show error messages', async ({ page }) => {
    await page.click('[data-testid="blog-manager-tab"]');
    await page.click('[data-testid="create-blog-button"]');
    
    // Try to save without required fields
    await page.click('[data-testid="save-blog-button"]');
    
    // Verify validation errors
    await expect(page.locator('[data-testid="title-error"]')).toContainText('Title is required');
    await expect(page.locator('[data-testid="content-error"]')).toContainText('Content is required');
    
    // Fill only title and try again
    await page.fill('[data-testid="blog-title-input"]', 'Test Blog');
    await page.click('[data-testid="save-blog-button"]');
    
    // Should still show content error
    await expect(page.locator('[data-testid="content-error"]')).toContainText('Content is required');
    
    // Fill content and try again
    await page.fill('[data-testid="rich-text-editor"]', 'Some content');
    await page.click('[data-testid="save-blog-button"]');
    
    // Should succeed now
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
  });

  test('should save draft and publish later workflow', async ({ page }) => {
    await page.click('[data-testid="blog-manager-tab"]');
    await page.click('[data-testid="create-blog-button"]');
    
    // Create draft blog
    await page.fill('[data-testid="blog-title-input"]', 'Draft Blog Post');
    await page.fill('[data-testid="blog-excerpt-input"]', 'This is a draft post');
    await page.fill('[data-testid="rich-text-editor"]', 'Draft content that needs review');
    
    // Set status to draft
    await page.click('[data-testid="blog-status-select"]');
    await page.click('[data-value="draft"]');
    
    // Save as draft
    await page.click('[data-testid="save-blog-button"]');
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Draft saved successfully');
    
    // Verify draft appears in drafts filter
    await page.click('[data-testid="status-filter"]');
    await page.click('[data-value="draft"]');
    await expect(page.locator('[data-testid="blog-list"]')).toContainText('Draft Blog Post');
    await expect(page.locator('[data-testid="draft-badge"]')).toBeVisible();
    
    // Edit and publish the draft
    await page.click('[data-testid="edit-blog-button"]');
    await page.click('[data-testid="blog-status-select"]');
    await page.click('[data-value="published"]');
    await page.click('[data-testid="save-blog-button"]');
    
    // Verify published status
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Blog published successfully');
  });

  test('should handle image upload and optimization in blog creation', async ({ page }) => {
    test.setTimeout(90000);
    
    await page.click('[data-testid="blog-manager-tab"]');
    await page.click('[data-testid="create-blog-button"]');
    
    // Fill basic details
    await page.fill('[data-testid="blog-title-input"]', 'Visual Content Blog');
    await page.fill('[data-testid="rich-text-editor"]', 'Blog with multiple images');
    
    // Test featured image upload
    await page.setInputFiles('[data-testid="featured-image-upload"]', 'tests/fixtures/large-image.jpg');
    
    // Wait for image processing
    await page.waitForSelector('[data-testid="image-processing-complete"]', { timeout: 30000 });
    
    // Verify image preview
    await expect(page.locator('[data-testid="featured-image-preview"]')).toBeVisible();
    
    // Test inline image upload in rich text editor
    await page.click('[data-testid="rich-text-editor"]');
    await page.click('[data-testid="insert-image-button"]');
    await page.setInputFiles('[data-testid="inline-image-upload"]', 'tests/fixtures/content-image.jpg');
    
    // Wait for inline image processing
    await page.waitForSelector('[data-testid="inline-image-inserted"]', { timeout: 30000 });
    
    // Test image alt text
    await page.fill('[data-testid="image-alt-text"]', 'Descriptive alt text for accessibility');
    
    // Test image alignment options
    await page.click('[data-testid="image-alignment-center"]');
    
    // Save blog with images
    await page.click('[data-testid="save-blog-button"]');
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Blog created successfully');
    
    // Verify images are properly stored
    await page.click('[data-testid="edit-blog-button"]');
    await expect(page.locator('[data-testid="featured-image-preview"]')).toBeVisible();
    await expect(page.locator('[data-testid="rich-text-editor"] img')).toBeVisible();
  });
});
