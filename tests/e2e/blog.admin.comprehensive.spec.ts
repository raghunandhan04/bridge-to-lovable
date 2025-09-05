import { test, expect } from '@playwright/test';

test.describe('Comprehensive Admin Blog Management', () => {
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
    await page.click('[data-testid="blog-manager-tab"]');
  });

  test('should create blog with all content block types', async ({ page }) => {
    test.setTimeout(120000);
    
    await page.click('[data-testid="create-blog-button"]');
    await page.click('[data-testid="structured-editor-tab"]');
    
    // Fill basic info
    await page.fill('[data-testid="blog-title-input"]', 'Complete Content Block Test');
    await page.fill('[data-testid="blog-slug-input"]', 'complete-content-block-test');
    
    // Add text block
    await page.dragAndDrop('[data-testid="text-block-template"]', '[data-testid="editor-canvas"]');
    await page.fill('[data-testid="text-block-content"]', 'This is a text block with rich content.');
    
    // Add image-left block
    await page.dragAndDrop('[data-testid="image-left-template"]', '[data-testid="editor-canvas"]');
    await page.fill('[data-testid="image-left-text"]', 'Text content with image on the left side.');
    
    // Add image-right block
    await page.dragAndDrop('[data-testid="image-right-template"]', '[data-testid="editor-canvas"]');
    await page.fill('[data-testid="image-right-text"]', 'Text content with image on the right side.');
    
    // Add quote block
    await page.dragAndDrop('[data-testid="quote-block-template"]', '[data-testid="editor-canvas"]');
    await page.fill('[data-testid="quote-content"]', 'This is an inspirational quote block.');
    await page.fill('[data-testid="quote-author"]', 'Famous Author');
    
    // Add CTA block
    await page.dragAndDrop('[data-testid="cta-block-template"]', '[data-testid="editor-canvas"]');
    await page.fill('[data-testid="cta-title"]', 'Ready to Get Started?');
    await page.fill('[data-testid="cta-description"]', 'Join thousands of satisfied customers.');
    await page.fill('[data-testid="cta-button-text"]', 'Start Now');
    await page.fill('[data-testid="cta-button-link"]', '/signup');
    
    // Add list block
    await page.dragAndDrop('[data-testid="list-block-template"]', '[data-testid="editor-canvas"]');
    await page.fill('[data-testid="list-title"]', 'Key Benefits');
    await page.fill('[data-testid="list-item-1"]', 'Increased productivity');
    await page.fill('[data-testid="list-item-2"]', 'Better organization');
    await page.fill('[data-testid="list-item-3"]', 'Enhanced collaboration');
    
    // Test reordering blocks
    await page.dragAndDrop('[data-testid="block-2"]', '[data-testid="block-1"]');
    
    // Preview the blog
    await page.click('[data-testid="preview-blog-button"]');
    await expect(page.locator('[data-testid="blog-preview"]')).toBeVisible();
    await expect(page.locator('[data-testid="blog-preview"]')).toContainText('Complete Content Block Test');
    
    // Save the blog
    await page.click('[data-testid="save-blog-button"]');
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Blog created successfully');
    
    // Verify all blocks are saved correctly
    await page.click('[data-testid="edit-blog-button"]');
    await page.click('[data-testid="structured-editor-tab"]');
    
    await expect(page.locator('[data-testid="text-block"]')).toBeVisible();
    await expect(page.locator('[data-testid="image-left-block"]')).toBeVisible();
    await expect(page.locator('[data-testid="image-right-block"]')).toBeVisible();
    await expect(page.locator('[data-testid="quote-block"]')).toBeVisible();
    await expect(page.locator('[data-testid="cta-block"]')).toBeVisible();
    await expect(page.locator('[data-testid="list-block"]')).toBeVisible();
  });

  test('should handle advanced blog settings and metadata', async ({ page }) => {
    await page.click('[data-testid="create-blog-button"]');
    
    // Fill basic content
    await page.fill('[data-testid="blog-title-input"]', 'Advanced Settings Blog');
    await page.fill('[data-testid="rich-text-editor"]', 'Advanced blog content');
    
    // Open advanced settings tab
    await page.click('[data-testid="advanced-settings-tab"]');
    
    // Test SEO settings
    await page.fill('[data-testid="meta-title"]', 'Custom Meta Title for SEO');
    await page.fill('[data-testid="meta-description"]', 'This is a custom meta description for better SEO ranking.');
    await page.fill('[data-testid="meta-keywords"]', 'blog, seo, advanced, settings');
    
    // Test custom slug generation
    await page.click('[data-testid="generate-slug-button"]');
    await expect(page.locator('[data-testid="blog-slug-input"]')).toHaveValue('advanced-settings-blog');
    
    // Test custom publication date
    await page.click('[data-testid="custom-date-toggle"]');
    await page.fill('[data-testid="publication-date"]', '2024-12-01');
    
    // Test author settings
    await page.fill('[data-testid="blog-author"]', 'John Doe');
    await page.fill('[data-testid="author-bio"]', 'Senior content writer and SEO specialist.');
    
    // Test reading time estimation
    await expect(page.locator('[data-testid="reading-time"]')).toContainText('1 min read');
    
    // Test social media preview
    await page.click('[data-testid="social-preview-tab"]');
    await expect(page.locator('[data-testid="facebook-preview"]')).toBeVisible();
    await expect(page.locator('[data-testid="twitter-preview"]')).toBeVisible();
    
    // Save with advanced settings
    await page.click('[data-testid="save-blog-button"]');
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Blog created successfully');
    
    // Verify advanced settings are preserved
    await page.click('[data-testid="edit-blog-button"]');
    await page.click('[data-testid="advanced-settings-tab"]');
    
    await expect(page.locator('[data-testid="meta-title"]')).toHaveValue('Custom Meta Title for SEO');
    await expect(page.locator('[data-testid="meta-description"]')).toHaveValue('This is a custom meta description for better SEO ranking.');
  });

  test('should handle collaborative workflow features', async ({ page }) => {
    await page.click('[data-testid="create-blog-button"]');
    
    await page.fill('[data-testid="blog-title-input"]', 'Collaborative Workflow Test');
    await page.fill('[data-testid="rich-text-editor"]', 'Content for collaborative review');
    
    // Save as draft for review
    await page.click('[data-testid="blog-status-select"]');
    await page.click('[data-value="draft"]');
    await page.click('[data-testid="save-blog-button"]');
    
    // Open collaboration panel
    await page.click('[data-testid="collaboration-tab"]');
    
    // Assign reviewer
    await page.click('[data-testid="assign-reviewer-button"]');
    await page.fill('[data-testid="reviewer-email"]', 'reviewer@test.com');
    await page.click('[data-testid="send-review-request"]');
    
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Review request sent');
    
    // Add internal comment
    await page.fill('[data-testid="internal-comment"]', 'Please review the technical accuracy of paragraph 2');
    await page.click('[data-testid="add-comment-button"]');
    
    // Verify comment appears
    await expect(page.locator('[data-testid="comment-list"]')).toContainText('Please review the technical accuracy');
    
    // Test comment threading
    await page.click('[data-testid="reply-comment-button"]');
    await page.fill('[data-testid="reply-text"]', 'I will check the sources and update accordingly.');
    await page.click('[data-testid="submit-reply"]');
    
    await expect(page.locator('[data-testid="comment-thread"]')).toContainText('I will check the sources');
    
    // Mark comment as resolved
    await page.click('[data-testid="resolve-comment-button"]');
    await expect(page.locator('[data-testid="resolved-comment"]')).toBeVisible();
    
    // Test approval workflow
    await page.click('[data-testid="request-approval-button"]');
    await page.fill('[data-testid="approval-message"]', 'Ready for final approval and publication');
    await page.click('[data-testid="submit-approval-request"]');
    
    await expect(page.locator('[data-testid="approval-status"]')).toContainText('Pending Approval');
  });

  test('should handle blog templates and content import', async ({ page }) => {
    await page.click('[data-testid="create-blog-button"]');
    
    // Test template selection
    await page.click('[data-testid="template-tab"]');
    
    // Select product announcement template
    await page.click('[data-testid="product-announcement-template"]');
    await expect(page.locator('[data-testid="blog-title-input"]')).toHaveValue('Product Announcement');
    
    // Verify template structure is loaded
    await page.click('[data-testid="structured-editor-tab"]');
    await expect(page.locator('[data-testid="template-blocks"]')).toContainText('Product Overview');
    
    // Test document import
    await page.click('[data-testid="import-tab"]');
    await page.click('[data-testid="import-document-button"]');
    
    // Simulate file upload (would need actual file in real test)
    await page.setInputFiles('[data-testid="document-upload"]', 'tests/fixtures/sample-blog.docx');
    
    // Wait for processing
    await page.waitForSelector('[data-testid="import-success"]', { timeout: 10000 });
    
    // Verify imported content
    await expect(page.locator('[data-testid="blog-title-input"]')).not.toBeEmpty();
    await expect(page.locator('[data-testid="rich-text-editor"]')).not.toBeEmpty();
    
    // Test content cleanup and formatting
    await page.click('[data-testid="clean-formatting-button"]');
    await page.click('[data-testid="optimize-structure-button"]');
    
    // Save imported blog
    await page.click('[data-testid="save-blog-button"]');
    await expect(page.locator('[data-testid="success-toast"]')).toContainText('Blog created successfully');
  });

  test('should validate blog analytics and performance metrics', async ({ page }) => {
    // Create a published blog first
    await page.click('[data-testid="create-blog-button"]');
    
    await page.fill('[data-testid="blog-title-input"]', 'Analytics Test Blog');
    await page.fill('[data-testid="rich-text-editor"]', 'Content for analytics testing');
    
    await page.click('[data-testid="blog-status-select"]');
    await page.click('[data-value="published"]');
    await page.click('[data-testid="save-blog-button"]');
    
    // Access analytics tab
    await page.click('[data-testid="edit-blog-button"]');
    await page.click('[data-testid="analytics-tab"]');
    
    // Verify analytics dashboard
    await expect(page.locator('[data-testid="blog-views"]')).toBeVisible();
    await expect(page.locator('[data-testid="engagement-metrics"]')).toBeVisible();
    await expect(page.locator('[data-testid="social-shares"]')).toBeVisible();
    
    // Test SEO score
    await expect(page.locator('[data-testid="seo-score"]')).toBeVisible();
    await expect(page.locator('[data-testid="readability-score"]')).toBeVisible();
    
    // Test performance recommendations
    await expect(page.locator('[data-testid="performance-recommendations"]')).toBeVisible();
    
    // Verify keyword analysis
    await page.click('[data-testid="keyword-analysis-tab"]');
    await expect(page.locator('[data-testid="keyword-density"]')).toBeVisible();
    await expect(page.locator('[data-testid="keyword-suggestions"]')).toBeVisible();
  });

  test('should handle blog versioning and revision history', async ({ page }) => {
    await page.click('[data-testid="create-blog-button"]');
    
    // Create initial version
    await page.fill('[data-testid="blog-title-input"]', 'Version Control Test');
    await page.fill('[data-testid="rich-text-editor"]', 'Initial version content');
    await page.click('[data-testid="save-blog-button"]');
    
    // Wait for auto-save
    await page.waitForSelector('[data-testid="auto-save-indicator"]');
    await expect(page.locator('[data-testid="auto-save-indicator"]')).toContainText('Saved');
    
    // Make changes
    await page.fill('[data-testid="rich-text-editor"]', 'Updated version content with more details');
    await page.waitForSelector('[data-testid="auto-save-indicator"]');
    
    // Access version history
    await page.click('[data-testid="version-history-button"]');
    
    await expect(page.locator('[data-testid="version-list"]')).toBeVisible();
    await expect(page.locator('[data-testid="version-item"]')).toHaveCountGreaterThan(1);
    
    // Compare versions
    await page.click('[data-testid="compare-versions-button"]');
    await expect(page.locator('[data-testid="version-diff"]')).toBeVisible();
    
    // Restore previous version
    await page.click('[data-testid="version-item"]:first-child');
    await page.click('[data-testid="restore-version-button"]');
    await page.click('[data-testid="confirm-restore"]');
    
    // Verify restoration
    await expect(page.locator('[data-testid="rich-text-editor"]')).toContainText('Initial version content');
    
    // Test version labeling
    await page.click('[data-testid="version-history-button"]');
    await page.click('[data-testid="add-version-label"]');
    await page.fill('[data-testid="version-label-input"]', 'Major Update v2.0');
    await page.click('[data-testid="save-version-label"]');
    
    await expect(page.locator('[data-testid="version-list"]')).toContainText('Major Update v2.0');
  });
});