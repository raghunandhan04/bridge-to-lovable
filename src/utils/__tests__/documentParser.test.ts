import { describe, it, expect } from 'vitest';
import { DocumentParser } from '@/utils/documentParser';

describe('DocumentParser', () => {
  it('parses simple HTML into standardized blocks and excerpt', () => {
    const html = `
      <h1>My Title</h1>
      <p>First paragraph content that should appear in excerpt because it is the first text block and not a heading.</p>
      <img src="/img.png" />
      <ul><li>Item 1</li><li>Item 2</li></ul>
      <table><tr><th>A</th><th>B</th></tr><tr><td>1</td><td>2</td></tr></table>
    `;
    // Use private method via any to target deterministic parsing method
    const blog = (DocumentParser as any).parseHtmlContentToBlocks(html, 'file.docx');
    expect(blog.title).toBe('My Title');
    expect(blog.featuredImage).toBe('/img.png');
    expect(blog.author).toBe('Document Upload');
    expect(Array.isArray(blog.blocks)).toBe(true);
    // Should generate a non-empty excerpt from first paragraph
    expect(blog.excerpt.length).toBeGreaterThan(0);
  // Ensure some expected block types exist
  const types = blog.blocks.map((b: any) => b.type);
  expect(types).toEqual(expect.arrayContaining(['full-width-text', 'table']));
  // Depending on layout toggle, image may be combined with paragraph or standalone
  const hasImageType = types.includes('left-image-right-text') || types.includes('right-image-left-text') || types.includes('image-caption');
  expect(hasImageType).toBe(true);
  });

  it('parses plain text into blocks with inferred title', () => {
    const text = `Title Line\nSome paragraph line that is fairly long to be considered content.\n- Bullet 1\n- Bullet 2`;
    const blog = (DocumentParser as any).parseTextContentToBlocks(text, 'sample.pdf');
    expect(blog.title).toBe('Title Line');
    expect(blog.blocks.length).toBeGreaterThan(0);
    expect(blog.excerpt.length).toBeGreaterThan(0);
  });
});
