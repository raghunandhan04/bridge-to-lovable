import { test, expect } from '@playwright/test';

test.describe('Admin Blog Management - Additional Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Setup admin authentication
    await page.goto('/auth');
    await page.evaluate(() => {
      localStorage.setItem('sb-localhost-auth-token', JSON.stringify({
        access_token: 'mock-admin-token',
        user: { id: 'admin-user-id', email: 'admin@test.com', role: 'admin' }
      }));
    });
    await page.goto('/admin');
    await page.waitForLoadState('networkidle');
  });

  test('should bulk manage multiple blog posts', async ({ page }) => {
    await page.click('[data-testid="blog-manager-tab"]');
    
    // Create multiple test blogs first
    for (let i = 1; i <= 3; i++) {
      await page.click('[data-testid="create-blog-button"]');
      await page.fill('[data-testid="blog-title-input"]', `Bulk Test Blog ${i}`);
      await page.fill('[data-testid="rich-text-editor"]', `Content for blog ${i}`);
      await page.click('[data-testid="save-blog-button"]');
      await page.waitForSelector('[data-testid="success-toast"]');
    }
    
    // Test bulk selection
    await page.click('[data-testid="select-all-checkbox"]');
    await expect(page.locator('[data-testid="selected-count"]')).toContainText('3 selected');
    
    // Test bulk status change
    await page.click('[data-testid="bulk-actions-menu"]');
    await page.click('[data-testid="bulk-set-featured"]');
    await page.click('[data-testid="confirm-bulk-action"]');
    
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Bulk action completed');
  });

  test('should search and filter blog posts effectively', async ({ page }) => {
    await page.click('[data-testid="blog-manager-tab"]');
    
    // Test search functionality
    await page.fill('[data-testid="blog-search-input"]', 'AI Technology');
    await page.waitForTimeout(500); // Debounce
    
    await expect(page.locator('[data-testid="blog-list"] [data-testid="blog-item"]')).toHaveCount(1);
    
    // Test category filter
    await page.click('[data-testid="category-filter"]');
    await page.click('[data-value="technology"]');
    
    // Test status filter
    await page.click('[data-testid="status-filter"]');
    await page.click('[data-value="published"]');
    
    // Test date range filter
    await page.click('[data-testid="date-filter"]');
    await page.fill('[data-testid="date-from"]', '2024-01-01');
    await page.fill('[data-testid="date-to"]', '2024-12-31');
    await page.click('[data-testid="apply-date-filter"]');
    
    // Clear all filters
    await page.click('[data-testid="clear-filters"]');
    await expect(page.locator('[data-testid="blog-search-input"]')).toHaveValue('');
  });

  test('should handle blog content versioning and auto-save', async ({ page }) => {
    await page.click('[data-testid="blog-manager-tab"]');
    await page.click('[data-testid="create-blog-button"]');
    
    // Fill initial content
    await page.fill('[data-testid="blog-title-input"]', 'Version Test Blog');
    await page.fill('[data-testid="rich-text-editor"]', 'Initial content version');
    
    // Wait for auto-save indicator
    await page.waitForSelector('[data-testid="auto-save-indicator"]');
    await expect(page.locator('[data-testid="auto-save-indicator"]')).toContainText('Auto-saved');
    
    // Make changes and verify versioning
    await page.fill('[data-testid="rich-text-editor"]', 'Updated content version');
    await page.waitForSelector('[data-testid="auto-save-indicator"]');
    
    // Test version history
    await page.click('[data-testid="version-history-button"]');
    await expect(page.locator('[data-testid="version-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="version-item"]')).toHaveCount(2);
    
    // Restore previous version
    await page.click('[data-testid="restore-version-button"]');
    await page.click('[data-testid="confirm-restore"]');
    
    await expect(page.locator('[data-testid="rich-text-editor"]')).toContainText('Initial content version');
  });

  test('should validate SEO settings and metadata', async ({ page }) => {
    await page.click('[data-testid="blog-manager-tab"]');
    await page.click('[data-testid="create-blog-button"]');
    
    // Fill basic content
    await page.fill('[data-testid="blog-title-input"]', 'SEO Optimized Blog Post');
    await page.fill('[data-testid="rich-text-editor"]', 'Content optimized for search engines');
    
    // Open SEO settings tab
    await page.click('[data-testid="seo-settings-tab"]');
    
    // Fill meta description
    await page.fill('[data-testid="meta-description"]', 'This is an SEO optimized blog post about AI');
    
    // Add meta keywords
    await page.fill('[data-testid="meta-keywords"]', 'AI, technology, machine learning, automation');
    
    // Test slug optimization
    await page.click('[data-testid="optimize-slug-button"]');
    await expect(page.locator('[data-testid="blog-slug-input"]')).toHaveValue('seo-optimized-blog-post');
    
    // Test SEO score
    await expect(page.locator('[data-testid="seo-score"]')).toBeVisible();
    await expect(page.locator('[data-testid="seo-score"]')).toContainText('Good');
    
    // Test readability score
    await expect(page.locator('[data-testid="readability-score"]')).toBeVisible();
    
    // Save with SEO settings
    await page.click('[data-testid="save-blog-button"]');
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Blog created successfully');
  });

  test('should handle collaborative editing and commenting', async ({ page }) => {
    await page.click('[data-testid="blog-manager-tab"]');
    await page.click('[data-testid="create-blog-button"]');
    
    // Create a blog post
    await page.fill('[data-testid="blog-title-input"]', 'Collaborative Blog Post');
    await page.fill('[data-testid="rich-text-editor"]', 'This post needs review and feedback');
    
    // Save as draft for review
    await page.click('[data-testid="blog-status-select"]');
    await page.click('[data-value="draft"]');
    await page.click('[data-testid="save-blog-button"]');
    
    // Add reviewer comment
    await page.click('[data-testid="add-comment-button"]');
    await page.fill('[data-testid="comment-input"]', 'Please add more technical details in the second paragraph');
    await page.click('[data-testid="submit-comment"]');
    
    // Verify comment appears
    await expect(page.locator('[data-testid="comment-list"]')).toContainText('Please add more technical details');
    
    // Test comment resolution
    await page.click('[data-testid="resolve-comment-button"]');
    await expect(page.locator('[data-testid="resolved-comment"]')).toBeVisible();
    
    // Test assignment to reviewer
    await page.click('[data-testid="assign-reviewer-button"]');
    await page.click('[data-testid="reviewer-select"]');
    await page.click('[data-value="reviewer@test.com"]');
    await page.click('[data-testid="assign-button"]');
    
    await expect(page.locator('[data-testid="assigned-reviewer"]')).toContainText('reviewer@test.com');
  });
});
