
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to extract code blocks from markdown
export function extractCodeBlocks(markdown: string): { 
  content: string; 
  language: string; 
  isCodeBlock: boolean;
}[] {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const blocks: { content: string; language: string; isCodeBlock: boolean }[] = [];
  
  let lastIndex = 0;
  let match;
  
  while ((match = codeBlockRegex.exec(markdown)) !== null) {
    // Add text before the code block
    if (match.index > lastIndex) {
      const text = markdown.slice(lastIndex, match.index);
      if (text.trim()) {
        blocks.push({
          content: text,
          language: '',
          isCodeBlock: false
        });
      }
    }
    
    // Add the code block
    blocks.push({
      content: match[2],
      language: match[1] || 'plaintext',
      isCodeBlock: true
    });
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add any remaining text after the last code block
  if (lastIndex < markdown.length) {
    const text = markdown.slice(lastIndex);
    if (text.trim()) {
      blocks.push({
        content: text,
        language: '',
        isCodeBlock: false
      });
    }
  }
  
  return blocks;
}

// Enhanced markdown renderer that supports code blocks with language detection
export function renderMarkdown(markdown: string): string {
  const blocks = extractCodeBlocks(markdown);
  
  return blocks.map(block => {
    if (!block.isCodeBlock) {
      // Process regular markdown for text blocks
      return block.content
        // Headers
        .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
        .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
        .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
        // Inline code
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Paragraphs (must be after other transformations)
        .replace(/^(?!<h|<pre|<ul|<ol|<p)(.*?)$/gm, '<p>$1</p>');
    } else {
      // For code blocks, we'll use special data attributes to identify them for React hydration
      return `<pre data-code="${encodeURIComponent(block.content)}" data-language="${block.language}"></pre>`;
    }
  }).join('');
}
