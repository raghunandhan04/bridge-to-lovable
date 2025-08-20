import mammoth from 'mammoth';

interface ParsedDocument {
  title: string;
  content: string;
  excerpt: string;
  images: string[];
}

interface DocumentBlock {
  type: 'heading' | 'paragraph' | 'list' | 'image' | 'table';
  level?: number;
  content: string;
  items?: string[];
}

export class DocumentParser {
  static async parseWordDocument(file: File): Promise<ParsedDocument> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.convertToHtml({ arrayBuffer });
      
      return this.parseHtmlContent(result.value);
    } catch (error) {
      console.error('Error parsing Word document:', error);
      throw new Error('Failed to parse Word document');
    }
  }

  static async parsePdfDocument(file: File): Promise<ParsedDocument> {
    try {
      // For PDF parsing, we'll use a simple text extraction approach
      // In a production environment, you might want to use a more sophisticated PDF parser
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      
      // Simple PDF text extraction (basic implementation)
      const text = await this.extractTextFromPdf(uint8Array);
      
      return this.parseTextContent(text);
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

  private static parseHtmlContent(html: string): ParsedDocument {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    const blocks: DocumentBlock[] = [];
    const images: string[] = [];
    
    // Extract title (first h1 or strong text)
    const titleElement = doc.querySelector('h1, h2, h3, strong');
    const title = titleElement?.textContent?.trim() || 'Untitled Document';
    
    // Process all elements
    const elements = doc.body.querySelectorAll('*');
    elements.forEach((element) => {
      const tagName = element.tagName.toLowerCase();
      const content = element.textContent?.trim() || '';
      
      if (!content && tagName !== 'img') return;
      
      switch (tagName) {
        case 'h1':
          blocks.push({ type: 'heading', level: 1, content });
          break;
        case 'h2':
          blocks.push({ type: 'heading', level: 2, content });
          break;
        case 'h3':
          blocks.push({ type: 'heading', level: 3, content });
          break;
        case 'h4':
          blocks.push({ type: 'heading', level: 4, content });
          break;
        case 'h5':
          blocks.push({ type: 'heading', level: 5, content });
          break;
        case 'h6':
          blocks.push({ type: 'heading', level: 6, content });
          break;
        case 'p':
          if (content.length > 0) {
            blocks.push({ type: 'paragraph', content });
          }
          break;
        case 'ul':
        case 'ol':
          const listItems = Array.from(element.querySelectorAll('li')).map(li => li.textContent?.trim() || '');
          if (listItems.length > 0) {
            blocks.push({ type: 'list', content: tagName, items: listItems });
          }
          break;
        case 'img':
          const src = element.getAttribute('src');
          if (src) {
            images.push(src);
            blocks.push({ type: 'image', content: src });
          }
          break;
        case 'table':
          blocks.push({ type: 'table', content: element.outerHTML });
          break;
      }
    });
    
    const richContent = this.convertBlocksToRichText(blocks);
    const excerpt = this.generateExcerpt(blocks);
    
    return {
      title,
      content: richContent,
      excerpt,
      images
    };
  }

  private static parseTextContent(text: string): ParsedDocument {
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const blocks: DocumentBlock[] = [];
    
    let title = 'Untitled Document';
    let foundTitle = false;
    
    for (const line of lines) {
      const trimmedLine = line.trim();
      
      if (!foundTitle && trimmedLine.length > 0) {
        title = trimmedLine;
        foundTitle = true;
        blocks.push({ type: 'heading', level: 1, content: trimmedLine });
        continue;
      }
      
      // Detect headings (lines that are shorter and followed by longer content)
      if (trimmedLine.length < 100 && !trimmedLine.endsWith('.')) {
        blocks.push({ type: 'heading', level: 2, content: trimmedLine });
      } else if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.match(/^\d+\./)) {
        // List items
        const content = trimmedLine.replace(/^[•\-\d+\.]\s*/, '');
        blocks.push({ type: 'list', content: 'ul', items: [content] });
      } else {
        blocks.push({ type: 'paragraph', content: trimmedLine });
      }
    }
    
    const richContent = this.convertBlocksToRichText(blocks);
    const excerpt = this.generateExcerpt(blocks);
    
    return {
      title,
      content: richContent,
      excerpt,
      images: []
    };
  }

  private static convertBlocksToRichText(blocks: DocumentBlock[]): string {
    let html = '';
    let imageAlign = 'left'; // Alternating image alignment
    
    for (const block of blocks) {
      switch (block.type) {
        case 'heading':
          const level = block.level || 2;
          html += `<h${level}>${block.content}</h${level}>`;
          break;
        case 'paragraph':
          html += `<p>${block.content}</p>`;
          break;
        case 'list':
          if (block.items && block.items.length > 0) {
            const listType = block.content === 'ol' ? 'ol' : 'ul';
            html += `<${listType}>`;
            for (const item of block.items) {
              html += `<li>${item}</li>`;
            }
            html += `</${listType}>`;
          }
          break;
        case 'image':
          html += `<div class="image-container" style="text-align: ${imageAlign};">`;
          html += `<img src="${block.content}" alt="Document image" style="max-width: 100%; height: auto;" />`;
          html += `</div>`;
          imageAlign = imageAlign === 'left' ? 'right' : 'left';
          break;
        case 'table':
          html += block.content;
          break;
      }
    }
    
    return html;
  }

  private static generateExcerpt(blocks: DocumentBlock[]): string {
    const paragraphBlocks = blocks.filter(block => block.type === 'paragraph');
    if (paragraphBlocks.length === 0) return '';
    
    const firstParagraph = paragraphBlocks[0].content;
    return firstParagraph.length > 160 
      ? firstParagraph.substring(0, 157) + '...'
      : firstParagraph;
  }
}