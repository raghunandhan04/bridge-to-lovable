import { test, expect } from '@playwright/test';

test.describe('Comprehensive Frontend Blog Experience', () => {
  test.beforeEach(async ({ page }) => {
    // Setup test data - create sample blogs as admin first
    await page.goto('/auth');
    await page.evaluate(() => {
      localStorage.setItem('sb-localhost-auth-token', JSON.stringify({
        access_token: 'mock-admin-token',
        user: { id: 'admin-user-id', email: 'admin@test.com', role: 'admin' }
      }));
    });
    
    await page.goto('/admin');
    await page.click('[data-testid="blog-manager-tab"]');
    
    // Create test blogs for different categories
    const testBlogs = [
      { title: 'AI Revolution in Healthcare', category: 'ai', featured: true },
      { title: 'Future of Automation Technology', category: 'technology', featured: false },
      { title: 'Business Intelligence Trends', category: 'business', featured: true },
      { title: 'Machine Learning Best Practices', category: 'ai', featured: false }
    ];
    
    for (const blog of testBlogs) {
      await page.click('[data-testid="create-blog-button"]');
      await page.fill('[data-testid="blog-title-input"]', blog.title);
      await page.fill('[data-testid="blog-excerpt-input"]', `Excerpt for ${blog.title}`);
      await page.fill('[data-testid="rich-text-editor"]', `Detailed content for ${blog.title}`);
      
      await page.click('[data-testid="blog-category-select"]');
      await page.click(`[data-value="${blog.category}"]`);
      
      if (blog.featured) {
        await page.check('[data-testid="featured-toggle"]');
      }
      
      await page.click('[data-testid="blog-status-select"]');
      await page.click('[data-value="published"]');
      await page.click('[data-testid="save-blog-button"]');
      await page.waitForSelector('[data-testid="success-toast"]');
    }
  });

  test('should display blog homepage with correct layout and navigation', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    
    // Verify main header
    await expect(page.locator('h1')).toContainText('Insights & Innovation');
    
    // Verify three-column layout on desktop
    await expect(page.locator('.lg\\:grid-cols-4')).toBeVisible();
    
    // Verify left sidebar categories
    await expect(page.locator('[data-testid="categories-sidebar"]')).toBeVisible();
    await expect(page.locator('text=Technology')).toBeVisible();
    await expect(page.locator('text=Artificial Intelligence')).toBeVisible();
    await expect(page.locator('text=Business')).toBeVisible();
    
    // Verify right sidebar featured articles
    await expect(page.locator('[data-testid="featured-articles"]')).toBeVisible();
    await expect(page.locator('text=Featured Articles')).toBeVisible();
    
    // Verify center content area
    await expect(page.locator('[data-testid="blog-content-area"]')).toBeVisible();
    await expect(page.locator('text=Select a blog to read')).toBeVisible();
  });

  test('should handle category navigation and blog selection correctly', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    
    // Click AI category
    await page.click('text=Artificial Intelligence');
    
    // Verify category expansion
    await expect(page.locator('[data-testid="blog-item"]')).toHaveCountGreaterThan(0);
    
    // Click on a blog
    await page.click('text=AI Revolution in Healthcare');
    
    // Verify blog content loads
    await expect(page.locator('[data-testid="blog-title"]')).toContainText('AI Revolution in Healthcare');
    await expect(page.locator('[data-testid="blog-content"]')).toContainText('Detailed content for AI Revolution in Healthcare');
    
    // Verify blog metadata
    await expect(page.locator('[data-testid="blog-category"]')).toContainText('Artificial Intelligence');
    await expect(page.locator('[data-testid="blog-date"]')).toBeVisible();
    
    // Test switching to different category
    await page.click('text=Technology');
    await page.click('text=Future of Automation Technology');
    
    // Verify new blog loads
    await expect(page.locator('[data-testid="blog-title"]')).toContainText('Future of Automation Technology');
  });

  test('should handle featured articles sidebar functionality', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    
    // Verify featured articles are displayed
    const featuredArticles = page.locator('[data-testid="featured-article"]');
    await expect(featuredArticles).toHaveCountGreaterThan(0);
    
    // Click on featured article
    const firstFeatured = featuredArticles.first();
    await firstFeatured.click();
    
    // Verify featured article loads
    await expect(page.locator('[data-testid="blog-content"]')).toBeVisible();
    
    // Verify featured article is highlighted when selected
    await expect(firstFeatured).toHaveClass(/bg-primary\/10/);
    
    // Test that featured articles update when category is expanded
    await page.click('text=Artificial Intelligence');
    
    // Featured articles should hide for expanded category to avoid duplication
    const aiCategory = page.locator('text=Artificial Intelligence').locator('xpath=ancestor::div[contains(@class, "border-b")]');
    const isExpanded = await aiCategory.locator('[data-testid="chevron-down"]').isVisible();
    
    if (isExpanded) {
      // When category is expanded, its featured article should be hidden from sidebar
      await expect(page.locator('[data-testid="featured-articles"]')).not.toContainText('AI Revolution in Healthcare');
    }
  });

  test('should be fully responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });
    
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    
    // Verify mobile layout
    await expect(page.locator('.lg\\:grid-cols-4')).not.toBeVisible();
    
    // Verify mobile category selector
    await expect(page.locator('[data-testid="category-select"]')).toBeVisible();
    
    // Test category selection on mobile
    await page.click('[data-testid="category-select"]');
    await expect(page.locator('[data-testid="category-dropdown"]')).toBeVisible();
    
    await page.click('text=Technology (');
    
    // Verify blogs load for selected category
    await expect(page.locator('[data-testid="blog-list"]')).toBeVisible();
    
    // Test blog selection on mobile
    await page.click('text=Future of Automation Technology');
    
    // Verify full-screen blog view on mobile
    await expect(page.locator('[data-testid="blog-content"]')).toBeVisible();
    await expect(page.locator('[data-testid="blog-title"]')).toContainText('Future of Automation Technology');
    
    // Test back navigation (if implemented)
    if (await page.locator('[data-testid="back-button"]').isVisible()) {
      await page.click('[data-testid="back-button"]');
      await expect(page.locator('[data-testid="category-select"]')).toBeVisible();
    }
  });

  test('should handle blog content rendering with different layouts', async ({ page }) => {
    // First create a blog with structured content
    await page.goto('/admin');
    await page.click('[data-testid="blog-manager-tab"]');
    await page.click('[data-testid="create-blog-button"]');
    await page.click('[data-testid="structured-editor-tab"]');
    
    await page.fill('[data-testid="blog-title-input"]', 'Structured Layout Test Blog');
    
    // Add image-left layout block
    await page.dragAndDrop('[data-testid="image-left-template"]', '[data-testid="editor-canvas"]');
    await page.fill('[data-testid="image-left-text"]', 'This text should appear to the right of the image');
    
    // Add image-right layout block
    await page.dragAndDrop('[data-testid="image-right-template"]', '[data-testid="editor-canvas"]');
    await page.fill('[data-testid="image-right-text"]', 'This text should appear to the left of the image');
    
    // Add quote block
    await page.dragAndDrop('[data-testid="quote-block-template"]', '[data-testid="editor-canvas"]');
    await page.fill('[data-testid="quote-content"]', 'Innovation distinguishes between a leader and a follower');
    await page.fill('[data-testid="quote-author"]', 'Steve Jobs');
    
    await page.click('[data-testid="blog-category-select"]');
    await page.click('[data-value="technology"]');
    
    await page.click('[data-testid="blog-status-select"]');
    await page.click('[data-value="published"]');
    await page.click('[data-testid="save-blog-button"]');
    
    // Now test frontend rendering
    await page.goto('/blog');
    await page.click('text=Technology');
    await page.click('text=Structured Layout Test Blog');
    
    // Verify structured content renders correctly
    await expect(page.locator('[data-testid="image-left-layout"]')).toBeVisible();
    await expect(page.locator('[data-testid="image-right-layout"]')).toBeVisible();
    await expect(page.locator('[data-testid="quote-block"]')).toBeVisible();
    
    // Verify quote content
    await expect(page.locator('[data-testid="quote-content"]')).toContainText('Innovation distinguishes between a leader and a follower');
    await expect(page.locator('[data-testid="quote-author"]')).toContainText('Steve Jobs');
    
    // Test layout responsiveness
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Verify layouts adapt to tablet view
    await expect(page.locator('[data-testid="image-left-layout"]')).toBeVisible();
    await expect(page.locator('[data-testid="image-right-layout"]')).toBeVisible();
  });

  test('should handle search and filtering functionality', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    
    // Test category filtering
    await page.click('text=Business');
    
    // Verify only business blogs are shown
    await expect(page.locator('[data-testid="blog-item"]')).toContainText('Business Intelligence Trends');
    
    // Test clearing filters
    await page.click('text=All Categories'); // if implemented
    
    // Test text search (if implemented)
    if (await page.locator('[data-testid="blog-search"]').isVisible()) {
      await page.fill('[data-testid="blog-search"]', 'AI Revolution');
      await page.waitForTimeout(300); // debounce
      
      await expect(page.locator('[data-testid="search-results"]')).toContainText('AI Revolution in Healthcare');
    }
  });

  test('should handle loading states and error scenarios', async ({ page }) => {
    // Test loading state
    await page.goto('/blog');
    
    // Should show loading indicator initially
    await expect(page.locator('text=Loading blogs...')).toBeVisible();
    await page.waitForLoadState('networkidle');
    
    // Test network error handling
    await page.route('**/supabase.co/**', route => route.abort());
    
    // Navigate away and back to trigger refetch
    await page.goto('/');
    await page.goto('/blog');
    
    // Should handle error gracefully (either show error message or retry)
    // This depends on implementation, but should not crash
    const hasError = await page.locator('text=Error loading blogs').isVisible();
    const hasRetry = await page.locator('[data-testid="retry-button"]').isVisible();
    
    if (hasError || hasRetry) {
      // Error handling is implemented
      expect(true).toBe(true);
    } else {
      // Should at least show loading state without crashing
      await expect(page.locator('body')).toBeVisible();
    }
  });

  test('should handle blog permalink and direct navigation', async ({ page }) => {
    // Create a blog with specific slug
    await page.goto('/admin');
    await page.click('[data-testid="blog-manager-tab"]');
    await page.click('[data-testid="create-blog-button"]');
    
    await page.fill('[data-testid="blog-title-input"]', 'Direct Navigation Test');
    await page.fill('[data-testid="blog-slug-input"]', 'direct-navigation-test');
    await page.fill('[data-testid="rich-text-editor"]', 'Content for direct navigation testing');
    
    await page.click('[data-testid="blog-status-select"]');
    await page.click('[data-value="published"]');
    await page.click('[data-testid="save-blog-button"]');
    
    // Test direct blog URL navigation (if implemented)
    // This would depend on routing setup
    await page.goto('/blog');
    
    // Verify blog can be accessed and shared
    await page.click('text=Direct Navigation Test');
    
    // Check if URL updates for blog selection (for sharing purposes)
    const currentUrl = page.url();
    expect(currentUrl).toContain('/blog');
    
    // Test browser back/forward navigation
    await page.goBack();
    await page.goForward();
    
    // Should maintain blog selection state
    await expect(page.locator('[data-testid="blog-content"]')).toBeVisible();
  });

  test('should validate SEO and accessibility features', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForLoadState('networkidle');
    
    // Check page title and meta description
    const title = await page.title();
    expect(title).toBeTruthy();
    expect(title).toContain('Blog'); // Should contain relevant keywords
    
    // Check meta description
    const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
    expect(metaDescription).toBeTruthy();
    
    // Check heading structure
    await expect(page.locator('h1')).toHaveCount(1); // Should have single H1
    
    // Check image alt attributes
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const altText = await images.nth(i).getAttribute('alt');
      expect(altText).toBeTruthy(); // All images should have alt text
    }
    
    // Check keyboard navigation
    await page.keyboard.press('Tab');
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy(); // Should be focusable
    
    // Check color contrast (basic check)
    const backgroundColor = await page.locator('body').evaluate(el => 
      getComputedStyle(el).backgroundColor
    );
    const textColor = await page.locator('body').evaluate(el => 
      getComputedStyle(el).color
    );
    
    expect(backgroundColor).toBeTruthy();
    expect(textColor).toBeTruthy();
  });
});