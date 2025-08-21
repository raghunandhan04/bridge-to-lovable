import mammoth from 'mammoth';

// Import the blog structure interfaces
export interface ContentBlock {
  id: string;
  type: 'left-image-right-text' | 'right-image-left-text' | 'full-width-image' | 'full-width-text' | 'image-caption' | 'video-embed' | 'table' | 'chart';
  content: {
    title?: string;
    text?: string;
    imageUrl?: string;
    videoUrl?: string;
    caption?: string;
    width?: number;
    alignment?: 'left' | 'center' | 'right';
    hasBorder?: boolean;
    hasShadow?: boolean;
    fontSize?: 'sm' | 'base' | 'lg' | 'xl';
    fontWeight?: 'normal' | 'medium' | 'semibold' | 'bold';
    textColor?: string;
    tableData?: {
      headers: string[];
      rows: string[][];
    };
    chartData?: {
      type: 'pie' | 'bar' | 'line';
      labels: string[];
      data: number[];
      title: string;
    };
  };
}

export interface StandardizedBlog {
  title: string;
  featuredImage: string;
  author: string;
  date: string;
  blocks: ContentBlock[];
  excerpt: string;
}

interface DocumentBlock {
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'table';
  level?: number;
  content: string;
  items?: string[];
}

export class DocumentParser {
  static async parseWordDocument(file: File): Promise<StandardizedBlog> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      return this.parseHtmlContentToBlocks(result.value, file.name);
    } catch (error) {
      console.error('Error parsing Word document:', error);
      throw new Error('Failed to parse Word document');
    }
  }

  static async parsePdfDocument(file: File): Promise<StandardizedBlog> {
    try {
      // For PDF parsing, we'll use a simple text extraction approach
      // In a production environment, you might want to use a more sophisticated PDF parser
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Simple PDF text extraction (basic implementation)
      const text = await this.extractTextFromPdf(uint8Array);
      
      return this.parseTextContentToBlocks(text, file.name);
    } catch (error) {
      console.error('Error parsing PDF document:', error);
      throw new Error('Failed to parse PDF document');
    }
  }

  private static async extractTextFromPdf(uint8Array: Uint8Array): Promise<string> {
    // This is a simplified PDF text extraction
    // For production, consider using pdf-lib or pdf2pic for better parsing
    const decoder = new TextDecoder();
    const text = decoder.decode(uint8Array);
    
    // Extract text between stream objects (very basic)
    const streamMatches = text.match(/stream\s*(.*?)\s*endstream/gs);
    if (streamMatches) {
      return streamMatches.join(' ').replace(/stream|endstream/g, '').trim();
    }
    
    return text;
  }

  private static parseHtmlContentToBlocks(html: string, fileName: string): StandardizedBlog {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const rawBlocks: DocumentBlock[] = [];
    const extractedImages: string[] = [];
    
    // Extract title (first h1 or strong text)
    const titleElement = doc.querySelector('h1, h2, h3, strong');
    const title = titleElement?.textContent?.trim() || fileName.replace(/\.[^/.]+$/, '') || 'Untitled Document';
    
    // Process all elements sequentially to maintain order
    const elements = Array.from(doc.body.querySelectorAll('*')).filter(el => {
      // Only include direct content elements, not nested ones
      const parent = el.parentElement;
      return !parent || ['body', 'div', 'article', 'section'].includes(parent.tagName.toLowerCase());
    });

    elements.forEach((element) => {
      const tagName = element.tagName.toLowerCase();
      const content = element.textContent?.trim() || '';
      
      if (!content && tagName !== 'img') return;
      
      switch (tagName) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
          if (content.length > 0) {
            const level = parseInt(tagName.charAt(1));
            rawBlocks.push({ type: 'heading', level, content });
          }
          break;
        case 'p':
          if (content.length > 0) {
            rawBlocks.push({ type: 'paragraph', content });
          }
          break;
        case 'ul':
        case 'ol':
          const listItems = Array.from(element.querySelectorAll('li')).map(li => li.textContent?.trim() || '');
          if (listItems.length > 0) {
            rawBlocks.push({ type: 'list', content: tagName, items: listItems });
          }
          break;
        case 'img':
          const src = element.getAttribute('src');
          if (src) {
            extractedImages.push(src);
            rawBlocks.push({ type: 'image', content: src });
          }
          break;
        case 'table':
          rawBlocks.push({ type: 'table', content: element.outerHTML });
          break;
      }
    });
    
    // Convert to standardized blog blocks
    const standardizedBlocks = this.convertToStandardizedBlocks(rawBlocks);
    const excerpt = this.generateExcerptFromBlocks(standardizedBlocks);
    
    return {
      title,
      featuredImage: extractedImages[0] || '',
      author: 'Document Upload',
      date: new Date().toISOString(),
      blocks: standardizedBlocks,
      excerpt
    };
  }

  private static parseTextContentToBlocks(text: string, fileName: string): StandardizedBlog {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const rawBlocks: DocumentBlock[] = [];
    
    let title = fileName.replace(/\.[^/.]+$/, '') || 'Untitled Document';
    let foundTitle = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (!foundTitle && trimmedLine.length > 0) {
        title = trimmedLine;
        foundTitle = true;
        rawBlocks.push({ type: 'heading', level: 1, content: trimmedLine });
        continue;
      }
      
      // Detect headings (lines that are shorter and don't end with punctuation)
      if (trimmedLine.length < 100 && !trimmedLine.match(/[.!?]$/)) {
        rawBlocks.push({ type: 'heading', level: 2, content: trimmedLine });
      } else if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.match(/^\d+\./)) {
        // List items
        const content = trimmedLine.replace(/^[•\-\d+\.]\s*/, '');
        rawBlocks.push({ type: 'list', content: 'ul', items: [content] });
      } else {
        rawBlocks.push({ type: 'paragraph', content: trimmedLine });
      }
    }
    
    // Convert to standardized blog blocks
    const standardizedBlocks = this.convertToStandardizedBlocks(rawBlocks);
    const excerpt = this.generateExcerptFromBlocks(standardizedBlocks);
    
    return {
      title,
      featuredImage: '',
      author: 'Document Upload',
      date: new Date().toISOString(),
      blocks: standardizedBlocks,
      excerpt
    };
  }

  private static convertToStandardizedBlocks(rawBlocks: DocumentBlock[]): ContentBlock[] {
    const standardizedBlocks: ContentBlock[] = [];
    let imageLayoutToggle = true; // Alternates between left-right and right-left layouts
    let blockId = 1;
    
    for (let i = 0; i < rawBlocks.length; i++) {
      const block = rawBlocks[i];
      const nextBlock = rawBlocks[i + 1];
      
      switch (block.type) {
        case 'heading':
          // Convert headings to full-width text blocks with appropriate styling
          const fontSize = block.level === 1 ? 'xl' : block.level === 2 ? 'lg' : 'base';
          const fontWeight = block.level <= 2 ? 'bold' : 'semibold';
          
          standardizedBlocks.push({
            id: `block-${blockId++}`,
            type: 'full-width-text',
            content: {
              text: block.content,
              alignment: 'left',
              fontSize,
              fontWeight,
              textColor: 'hsl(var(--foreground))',
              width: 100
            }
          });
          break;
          
        case 'paragraph':
          // Check if next block is an image - if so, create combined layout
          if (nextBlock && nextBlock.type === 'image') {
            const layoutType = imageLayoutToggle ? 'left-image-right-text' : 'right-image-left-text';
            imageLayoutToggle = !imageLayoutToggle;
            
            standardizedBlocks.push({
              id: `block-${blockId++}`,
              type: layoutType,
              content: {
                text: block.content,
                imageUrl: nextBlock.content,
                alignment: 'left',
                fontSize: 'base',
                fontWeight: 'normal',
                textColor: 'hsl(var(--foreground))',
                width: 100,
                hasShadow: true
              }
            });
            i++; // Skip the next image block since we've processed it
          } else {
            // Standalone text block
            standardizedBlocks.push({
              id: `block-${blockId++}`,
              type: 'full-width-text',
              content: {
                text: block.content,
                alignment: 'left',
                fontSize: 'base',
                fontWeight: 'normal',
                textColor: 'hsl(var(--foreground))',
                width: 100
              }
            });
          }
          break;
          
        case 'image':
          // Standalone image with caption
          standardizedBlocks.push({
            id: `block-${blockId++}`,
            type: 'image-caption',
            content: {
              imageUrl: block.content,
              caption: 'Uploaded image',
              alignment: 'center',
              width: 80,
              hasShadow: true,
              hasBorder: false
            }
          });
          break;
          
        case 'list':
          // Convert lists to formatted text blocks
          let listText = '';
          if (block.items) {
            const listType = block.content === 'ol' ? 'numbered' : 'bullet';
            listText = block.items.map((item, index) => {
              const prefix = listType === 'numbered' ? `${index + 1}. ` : '• ';
              return `${prefix}${item}`;
            }).join('\n');
          }
          
          standardizedBlocks.push({
            id: `block-${blockId++}`,
            type: 'full-width-text',
            content: {
              text: listText,
              alignment: 'left',
              fontSize: 'base',
              fontWeight: 'normal',
              textColor: 'hsl(var(--foreground))',
              width: 100
            }
          });
          break;
          
        case 'table':
          // Parse table HTML and convert to table block
          const parser = new DOMParser();
          const tableDoc = parser.parseFromString(block.content, 'text/html');
          const tableElement = tableDoc.querySelector('table');
          
          if (tableElement) {
            const headers = Array.from(tableElement.querySelectorAll('th')).map(th => th.textContent?.trim() || '');
            const rows = Array.from(tableElement.querySelectorAll('tr')).slice(headers.length > 0 ? 1 : 0).map(tr => 
              Array.from(tr.querySelectorAll('td')).map(td => td.textContent?.trim() || '')
            );
            
            if (headers.length > 0 || rows.length > 0) {
              standardizedBlocks.push({
                id: `block-${blockId++}`,
                type: 'table',
                content: {
                  tableData: {
                    headers: headers.length > 0 ? headers : ['Column 1', 'Column 2', 'Column 3'],
                    rows: rows.length > 0 ? rows : [['Data 1', 'Data 2', 'Data 3']]
                  },
                  width: 100,
                  alignment: 'center'
                }
              });
            }
          }
          break;
      }
    }
    
    return standardizedBlocks;
  }

  private static generateExcerptFromBlocks(blocks: ContentBlock[]): string {
    // Find the first text block
    const textBlock = blocks.find(block => 
      block.content.text && 
      block.content.text.length > 0 &&
      !block.content.text.match(/^(#|##|###)/) // Skip headings
    );
    
    if (!textBlock || !textBlock.content.text) return '';
    
    const text = textBlock.content.text;
    return text.length > 160 ? text.substring(0, 157) + '...' : text;
  }
}