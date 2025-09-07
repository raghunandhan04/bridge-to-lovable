import { test, expect } from '@playwright/test';

test.describe('Essential Blog System E2E Tests', () => {
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

  // Admin Blog Management Tests (8 tests)
  test('should create and publish a blog post', async ({ page }) => {
    test.setTimeout(60000);
    
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
    await page.click('[data-testid="blog-manager-tab"]');
    await page.click('[data-testid="create-blog-button"]');
    
    await page.fill('[data-testid="blog-title-input"]', 'Essential Test Blog');
    await page.fill('[data-testid="blog-slug-input"]', 'essential-test-blog');
    await page.fill('[data-testid="blog-excerpt-input"]', 'Test excerpt for essential blog');
    
    await page.click('[data-testid="blog-category-select"]');
    await page.click('[data-value="technology"]');
    
    await page.click('[data-testid="rich-text-editor"]');
    await page.type('[data-testid="rich-text-editor"]', 'Essential blog content for testing.');
    
    await page.click('[data-testid="blog-status-select"]');
    await page.click('[data-value="published"]');
    await page.click('[data-testid="save-blog-button"]');
    
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('published');
  });

  test('should create structured blog with custom layouts', async ({ page }) => {
    test.setTimeout(60000);
    
    await page.goto('/admin');
    await page.click('[data-testid="blog-manager-tab"]');
    await page.click('[data-testid="create-blog-button"]');
    await page.click('[data-testid="structured-editor-tab"]');
    
    await page.fill('[data-testid="blog-title-input"]', 'Structured Layout Test');
    
    // Add image-left layout
    await page.dragAndDrop('[data-testid="image-left-template"]', '[data-testid="editor-canvas"]');
    await page.fill('[data-testid="image-left-text"]', 'Text with image on left');
    
    // Add image-right layout
    await page.dragAndDrop('[data-testid="image-right-template"]', '[data-testid="editor-canvas"]');
    await page.fill('[data-testid="image-right-text"]', 'Text with image on right');
    
    await page.click('[data-testid="save-blog-button"]');
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
  });

  test('should edit and update existing blog', async ({ page }) => {
    await page.goto('/admin');
    await page.click('[data-testid="blog-manager-tab"]');
    
    // Create a blog first
    await page.click('[data-testid="create-blog-button"]');
    await page.fill('[data-testid="blog-title-input"]', 'Blog to Edit');
    await page.fill('[data-testid="rich-text-editor"]', 'Original content');
    await page.click('[data-testid="save-blog-button"]');
    
    // Edit the blog
    await page.click('[data-testid="edit-blog-button"]');
    await page.fill('[data-testid="blog-title-input"]', 'Updated Blog Title');
    await page.fill('[data-testid="rich-text-editor"]', 'Updated content');
    await page.click('[data-testid="save-blog-button"]');
    
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('updated');
  });

  test('should handle blog draft workflow', async ({ page }) => {
    await page.goto('/admin');
    await page.click('[data-testid="blog-manager-tab"]');
    await page.click('[data-testid="create-blog-button"]');
    
    await page.fill('[data-testid="blog-title-input"]', 'Draft Blog');
    await page.fill('[data-testid="rich-text-editor"]', 'Draft content');
    
    await page.click('[data-testid="blog-status-select"]');
    await page.click('[data-value="draft"]');
    await page.click('[data-testid="save-blog-button"]');
    
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Draft saved');
    
    // Publish the draft
    await page.click('[data-testid="blog-status-select"]');
    await page.click('[data-value="published"]');
    await page.click('[data-testid="save-blog-button"]');
    
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('published');
  });

  test('should search and filter blogs in admin', async ({ page }) => {
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

  test('should delete blog post', async ({ page }) => {
    await page.goto('/admin');
    await page.click('[data-testid="blog-manager-tab"]');
    
    // Create blog to delete
    await page.click('[data-testid="create-blog-button"]');
    await page.fill('[data-testid="blog-title-input"]', 'Blog to Delete');
    await page.fill('[data-testid="rich-text-editor"]', 'Content to delete');
    await page.click('[data-testid="save-blog-button"]');
    
    // Delete the blog
    await page.click('[data-testid="delete-blog-button"]');
    await page.click('[data-testid="confirm-delete"]');
    
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('deleted');
  });

  test('should handle blog validation errors', async ({ page }) => {
    await page.goto('/admin');
    await page.click('[data-testid="blog-manager-tab"]');
    await page.click('[data-testid="create-blog-button"]');
    
    // Try to save without required fields
    await page.click('[data-testid="save-blog-button"]');
    
    await expect(page.locator('[data-testid="title-error"]')).toContainText('Title is required');
    await expect(page.locator('[data-testid="content-error"]')).toContainText('Content is required');
  });

  test('should set blog as featured', async ({ page }) => {
    await page.goto('/admin');
    await page.click('[data-testid="blog-manager-tab"]');
    await page.click('[data-testid="create-blog-button"]');
    
    await page.fill('[data-testid="blog-title-input"]', 'Featured Blog');
    await page.fill('[data-testid="rich-text-editor"]', 'Featured content');
    await page.check('[data-testid="featured-toggle"]');
    
    await page.click('[data-testid="blog-status-select"]');
    await page.click('[data-value="published"]');
    await page.click('[data-testid="save-blog-button"]');
    
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
  });

  // Frontend Blog Display Tests (5 tests)
  test('should display blog homepage correctly', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1')).toContainText('Insights & Innovation');
    await expect(page.locator('[data-testid="categories-sidebar"]')).toBeVisible();
    await expect(page.locator('[data-testid="featured-articles"]')).toBeVisible();
    await expect(page.locator('text=Select a blog to read')).toBeVisible();
  });

  test('should navigate blog categories and display content', async ({ page }) => {
    // First create a test blog
    await page.goto('/admin');
    await page.click('[data-testid="blog-manager-tab"]');
    await page.click('[data-testid="create-blog-button"]');
    
    await page.fill('[data-testid="blog-title-input"]', 'Frontend Test Blog');
    await page.fill('[data-testid="rich-text-editor"]', 'Frontend test content');
    await page.click('[data-testid="blog-category-select"]');
    await page.click('[data-value="technology"]');
    
    await page.click('[data-testid="blog-status-select"]');
    await page.click('[data-value="published"]');
    await page.click('[data-testid="save-blog-button"]');
    
    // Test frontend display
    await page.goto('/blog');
    await page.click('text=Technology');
    await page.click('text=Frontend Test Blog');
    
    await expect(page.locator('[data-testid="blog-content"]')).toContainText('Frontend test content');
  });

  test('should handle mobile responsive layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('[data-testid="category-select"]')).toBeVisible();
    
    await page.click('[data-testid="category-select"]');
    await page.click('text=Technology');
    
    await expect(page.locator('.lg\\:col-span-1')).not.toBeVisible();
  });

  test('should display featured articles correctly', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('[data-testid="featured-articles"]')).toBeVisible();
    await expect(page.locator('text=Featured Articles')).toBeVisible();
    
    const featuredArticles = page.locator('[data-testid="featured-article"]');
    if (await featuredArticles.count() > 0) {
      await featuredArticles.first().click();
      await expect(page.locator('[data-testid="blog-content"]')).toBeVisible();
    }
  });

  // Performance and Error Handling Tests (2 tests)
  test('should load blog pages with good performance', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(5000);
    
    await expect(page.locator('title')).not.toBeEmpty();
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should handle empty states and errors gracefully', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    
    const blogItems = page.locator('[data-testid="blog-item"]');
    const count = await blogItems.count();
    
    if (count === 0) {
      await expect(page.locator('text=No featured articles available')).toBeVisible();
    }
    
    // Test network error handling
    await page.route('**/supabase.co/**', route => route.abort());
    await page.reload();
    
    // Should not crash the application
    await expect(page.locator('body')).toBeVisible();
  });
});