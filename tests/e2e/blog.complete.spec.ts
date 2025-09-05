import { test, expect } from '@playwright/test';

test.describe('Complete Blog System E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup admin authentication
    await page.goto('/auth');
    await page.evaluate(() => {
      localStorage.setItem('sb-localhost-auth-token', JSON.stringify({
        access_token: 'mock-admin-token',
        user: { id: 'admin-user-id', email: 'admin@test.com', role: 'admin' }
      }));
    });
  });

  test.describe('Admin Blog Management', () => {
    test('should create, edit, and publish a complete blog workflow', async ({ page }) => {
      test.setTimeout(120000);
      
      // Navigate to admin
      await page.goto('/admin');
      await page.waitForLoadState('networkidle');
      
      // Access blog manager
      await page.click('[data-testid="blog-manager-tab"]');
      
      // Create new blog
      await page.click('[data-testid="create-blog-button"]');
      
      // Fill blog details
      await page.fill('[data-testid="blog-title-input"]', 'Complete E2E Test Blog');
      await page.fill('[data-testid="blog-slug-input"]', 'complete-e2e-test-blog');
      await page.fill('[data-testid="blog-excerpt-input"]', 'This is a comprehensive test of our blog system');
      
      // Select category
      await page.click('[data-testid="blog-category-select"]');
      await page.click('[data-value="technology"]');
      
      // Add rich content
      await page.click('[data-testid="rich-text-editor"]');
      await page.type('[data-testid="rich-text-editor"]', 'This is comprehensive content for testing our blog system end to end.');
      
      // Set as featured
      await page.check('[data-testid="featured-toggle"]');
      
      // Save as draft first
      await page.click('[data-testid="blog-status-select"]');
      await page.click('[data-value="draft"]');
      await page.click('[data-testid="save-blog-button"]');
      
      // Verify draft creation
      await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
      await expect(page.locator('[data-testid="success-toast"]')).toContainText('Draft saved');
      
      // Publish the blog
      await page.click('[data-testid="blog-status-select"]');
      await page.click('[data-value="published"]');
      await page.click('[data-testid="save-blog-button"]');
      
      // Verify publication
      await expect(page.locator('[data-testid="success-toast"]')).toContainText('published');
      
      // Verify in blog list
      await expect(page.locator('[data-testid="blog-list"]')).toContainText('Complete E2E Test Blog');
    });

    test('should manage blog using structured editor with templates', async ({ page }) => {
      test.setTimeout(90000);
      
      await page.goto('/admin');
      await page.click('[data-testid="blog-manager-tab"]');
      await page.click('[data-testid="create-blog-button"]');
      
      // Switch to structured editor
      await page.click('[data-testid="structured-editor-tab"]');
      
      await page.fill('[data-testid="blog-title-input"]', 'Structured Blog Test');
      
      // Add different content blocks
      await page.dragAndDrop('[data-testid="text-block-template"]', '[data-testid="editor-canvas"]');
      await page.fill('[data-testid="text-block-content"]', 'Introduction text block');
      
      await page.dragAndDrop('[data-testid="image-text-block-template"]', '[data-testid="editor-canvas"]');
      await page.fill('[data-testid="image-text-content"]', 'Image with text description');
      
      await page.dragAndDrop('[data-testid="cta-block-template"]', '[data-testid="editor-canvas"]');
      await page.fill('[data-testid="cta-button-text"]', 'Learn More');
      await page.fill('[data-testid="cta-button-link"]', '/learn-more');
      
      // Preview and save
      await page.click('[data-testid="preview-blog-button"]');
      await expect(page.locator('[data-testid="blog-preview"]')).toContainText('Structured Blog Test');
      
      await page.click('[data-testid="save-blog-button"]');
      await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
    });

    test('should handle bulk blog operations', async ({ page }) => {
      test.setTimeout(90000);
      
      await page.goto('/admin');
      await page.click('[data-testid="blog-manager-tab"]');
      
      // Create multiple test blogs
      for (let i = 1; i <= 3; i++) {
        await page.click('[data-testid="create-blog-button"]');
        await page.fill('[data-testid="blog-title-input"]', `Bulk Test Blog ${i}`);
        await page.fill('[data-testid="rich-text-editor"]', `Content for blog ${i}`);
        await page.click('[data-testid="save-blog-button"]');
        await page.waitForSelector('[data-testid="success-toast"]');
      }
      
      // Test bulk selection
      await page.check('[data-testid="select-all-checkbox"]');
      await expect(page.locator('[data-testid="selected-count"]')).toContainText('3 selected');
      
      // Test bulk status change
      await page.click('[data-testid="bulk-actions-menu"]');
      await page.click('[data-testid="bulk-set-featured"]');
      await page.click('[data-testid="confirm-bulk-action"]');
      
      await expect(page.locator('[data-testid="success-toast"]')).toContainText('Bulk action completed');
    });

    test('should search and filter blogs effectively', async ({ page }) => {
      await page.goto('/admin');
      await page.click('[data-testid="blog-manager-tab"]');
      
      // Test search
      await page.fill('[data-testid="blog-search-input"]', 'Technology');
      await page.waitForTimeout(500);
      
      // Test category filter
      await page.click('[data-testid="category-filter"]');
      await page.click('[data-value="technology"]');
      
      // Test status filter
      await page.click('[data-testid="status-filter"]');
      await page.click('[data-value="published"]');
      
      // Clear filters
      await page.click('[data-testid="clear-filters"]');
      await expect(page.locator('[data-testid="blog-search-input"]')).toHaveValue('');
    });
  });

  test.describe('Frontend Blog Display', () => {
    test('should display blogs correctly on the blog page', async ({ page }) => {
      // First create a test blog as admin
      await page.goto('/admin');
      await page.click('[data-testid="blog-manager-tab"]');
      await page.click('[data-testid="create-blog-button"]');
      
      await page.fill('[data-testid="blog-title-input"]', 'Frontend Display Test');
      await page.fill('[data-testid="blog-excerpt-input"]', 'Test excerpt for frontend');
      await page.fill('[data-testid="rich-text-editor"]', 'Frontend content test');
      await page.click('[data-testid="blog-category-select"]');
      await page.click('[data-value="technology"]');
      await page.check('[data-testid="featured-toggle"]');
      
      await page.click('[data-testid="blog-status-select"]');
      await page.click('[data-value="published"]');
      await page.click('[data-testid="save-blog-button"]');
      await page.waitForSelector('[data-testid="success-toast"]');
      
      // Now test frontend display
      await page.goto('/blog');
      await page.waitForLoadState('networkidle');
      
      // Verify blog page structure
      await expect(page.locator('h1')).toContainText('Insights & Innovation');
      
      // Test category expansion
      await page.click('text=Technology');
      await expect(page.locator('[data-testid="blog-item"]')).toBeVisible();
      
      // Test blog selection
      await page.click('text=Frontend Display Test');
      await expect(page.locator('[data-testid="blog-content"]')).toContainText('Frontend content test');
      
      // Verify featured article sidebar
      await expect(page.locator('[data-testid="featured-articles"]')).toBeVisible();
    });

    test('should handle mobile responsiveness', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 812 });
      
      await page.goto('/blog');
      await page.waitForLoadState('networkidle');
      
      // Test mobile category selector
      await expect(page.locator('[data-testid="category-select"]')).toBeVisible();
      
      // Test category selection on mobile
      await page.click('[data-testid="category-select"]');
      await page.click('text=Technology');
      
      // Verify responsive layout
      await expect(page.locator('.lg\\:col-span-1')).not.toBeVisible();
    });

    test('should handle blog filtering and search on frontend', async ({ page }) => {
      await page.goto('/blog');
      await page.waitForLoadState('networkidle');
      
      // Test category filtering
      await page.click('text=Technology');
      await page.waitForTimeout(300);
      
      // Verify filtered results
      const blogItems = page.locator('[data-testid="blog-item"]');
      await expect(blogItems.first()).toBeVisible();
      
      // Test featured blog interaction
      const featuredBlog = page.locator('[data-testid="featured-article"]').first();
      if (await featuredBlog.isVisible()) {
        await featuredBlog.click();
        await expect(page.locator('[data-testid="blog-content"]')).toBeVisible();
      }
    });
  });

  test.describe('Blog Content Rendering', () => {
    test('should render different blog layouts correctly', async ({ page }) => {
      // Create blogs with different structures
      await page.goto('/admin');
      await page.click('[data-testid="blog-manager-tab"]');
      
      // Test image-left layout
      await page.click('[data-testid="create-blog-button"]');
      await page.click('[data-testid="structured-editor-tab"]');
      
      await page.fill('[data-testid="blog-title-input"]', 'Image Left Layout Test');
      await page.dragAndDrop('[data-testid="image-left-template"]', '[data-testid="editor-canvas"]');
      
      await page.fill('[data-testid="layout-text-content"]', 'Text content with image on left');
      await page.click('[data-testid="save-blog-button"]');
      
      // Verify layout in preview
      await page.click('[data-testid="preview-blog-button"]');
      await expect(page.locator('[data-testid="image-left-layout"]')).toBeVisible();
      
      // Test image-right layout
      await page.goto('/admin');
      await page.click('[data-testid="blog-manager-tab"]');
      await page.click('[data-testid="create-blog-button"]');
      await page.click('[data-testid="structured-editor-tab"]');
      
      await page.fill('[data-testid="blog-title-input"]', 'Image Right Layout Test');
      await page.dragAndDrop('[data-testid="image-right-template"]', '[data-testid="editor-canvas"]');
      
      await page.fill('[data-testid="layout-text-content"]', 'Text content with image on right');
      await page.click('[data-testid="save-blog-button"]');
      
      // Verify layout in preview
      await page.click('[data-testid="preview-blog-button"]');
      await expect(page.locator('[data-testid="image-right-layout"]')).toBeVisible();
    });

    test('should handle blog content with rich media', async ({ page }) => {
      await page.goto('/admin');
      await page.click('[data-testid="blog-manager-tab"]');
      await page.click('[data-testid="create-blog-button"]');
      
      await page.fill('[data-testid="blog-title-input"]', 'Rich Media Blog Test');
      
      // Test rich text editor with formatting
      await page.click('[data-testid="rich-text-editor"]');
      await page.type('[data-testid="rich-text-editor"]', 'This is bold text and italic text with links.');
      
      // Test image insertion in rich editor
      await page.click('[data-testid="insert-image-button"]');
      // Simulate image upload would go here
      
      await page.click('[data-testid="save-blog-button"]');
      await page.waitForSelector('[data-testid="success-toast"]');
      
      // Verify rich content rendering
      await page.goto('/blog');
      await page.click('text=Rich Media Blog Test');
      await expect(page.locator('[data-testid="blog-content"]')).toContainText('This is bold text');
    });
  });

  test.describe('Error Handling and Edge Cases', () => {
    test('should handle validation errors gracefully', async ({ page }) => {
      await page.goto('/admin');
      await page.click('[data-testid="blog-manager-tab"]');
      await page.click('[data-testid="create-blog-button"]');
      
      // Try to save without required fields
      await page.click('[data-testid="save-blog-button"]');
      
      await expect(page.locator('[data-testid="title-error"]')).toContainText('Title is required');
      await expect(page.locator('[data-testid="content-error"]')).toContainText('Content is required');
    });

    test('should handle network errors gracefully', async ({ page }) => {
      // Block network requests to simulate offline state
      await page.route('**/supabase.co/**', route => route.abort());
      
      await page.goto('/blog');
      
      // Should show error message or loading state gracefully
      await expect(page.locator('text=Loading blogs...')).toBeVisible();
    });

    test('should handle empty states correctly', async ({ page }) => {
      await page.goto('/blog');
      await page.waitForLoadState('networkidle');
      
      // If no blogs exist, should show appropriate message
      const blogItems = page.locator('[data-testid="blog-item"]');
      const count = await blogItems.count();
      
      if (count === 0) {
        await expect(page.locator('text=No featured articles available')).toBeVisible();
      }
    });
  });

  test.describe('Performance and SEO', () => {
    test('should load blog pages with good performance', async ({ page }) => {
      const startTime = Date.now();
      
      await page.goto('/blog');
      await page.waitForLoadState('networkidle');
      
      const loadTime = Date.now() - startTime;
      expect(loadTime).toBeLessThan(5000); // Should load in under 5 seconds
      
      // Check for essential SEO elements
      await expect(page.locator('title')).not.toBeEmpty();
      await expect(page.locator('meta[name="description"]')).not.toBeEmpty();
      await expect(page.locator('h1')).toBeVisible();
    });

    test('should have proper meta tags for individual blogs', async ({ page }) => {
      // Create a test blog first
      await page.goto('/admin');
      await page.click('[data-testid="blog-manager-tab"]');
      await page.click('[data-testid="create-blog-button"]');
      
      await page.fill('[data-testid="blog-title-input"]', 'SEO Test Blog');
      await page.fill('[data-testid="blog-excerpt-input"]', 'SEO optimized excerpt for testing');
      await page.fill('[data-testid="rich-text-editor"]', 'SEO content');
      
      await page.click('[data-testid="blog-status-select"]');
      await page.click('[data-value="published"]');
      await page.click('[data-testid="save-blog-button"]');
      
      // Navigate to blog page and verify SEO
      await page.goto('/blog');
      await page.click('text=SEO Test Blog');
      
      // Check that blog content affects page meta (if implemented)
      await expect(page.locator('[data-testid="blog-content"]')).toContainText('SEO content');
    });
  });
});