
import React, { useEffect, useRef } from 'react';
import { extractCodeBlocks, extractHeadings } from '@/lib/utils';
import CodeSnippet from './CodeSnippet';

interface MarkdownPreviewProps {
  content: string;
  previewRef: React.RefObject<HTMLDivElement>;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content, previewRef }) => {
  const blocks = extractCodeBlocks(content);
  
  useEffect(() => {
    if (previewRef.current) {
      const codeBlocks = previewRef.current.querySelectorAll('pre[data-code]');
      codeBlocks.forEach((block) => {
        const code = decodeURIComponent(block.getAttribute('data-code') || '');
        const language = block.getAttribute('data-language') || 'plaintext';
        
        if (code && !block.hasAttribute('data-hydrated')) {
          block.setAttribute('data-hydrated', 'true');
          
          const div = document.createElement('div');
          block.parentNode?.replaceChild(div, block);
          
          const codeSnippet = document.createElement('div');
          codeSnippet.className = 'code-snippet-container';
          codeSnippet.innerHTML = `
            <div class="rounded-lg overflow-hidden border border-border/50 my-4">
              <div class="bg-muted/50 px-4 py-2 flex items-center justify-between">
                <div class="text-sm font-medium">${language}</div>
              </div>
              <pre class="p-4 overflow-auto text-sm font-mono"><code>${code}</code></pre>
            </div>
          `;
          div.appendChild(codeSnippet);
        }
      });
      
      const headings = extractHeadings(content);
      headings.forEach(heading => {
        const headingElements = previewRef.current?.querySelectorAll(`h${heading.level}`);
        if (headingElements) {
          headingElements.forEach(el => {
            if (el.textContent === heading.text) {
              el.id = heading.id;
            }
          });
        }
      });
    }
  }, [content, previewRef]);
  
  return (
    <div className="markdown-preview">
      {blocks.map((block, index) => {
        if (!block.isCodeBlock) {
          return (
            <div 
              key={`text-${index}`} 
              dangerouslySetInnerHTML={{ __html: renderMarkdown(block.content) }} 
            />
          );
        } else {
          return (
            <CodeSnippet 
              key={`code-${index}`} 
              code={block.content} 
              language={block.language} 
            />
          );
        }
      })}
    </div>
  );
};

// Import this from utils to avoid circular dependency
const renderMarkdown = (text: string): string => {
  // This is a placeholder that should import from utils
  // In a real implementation, this would be imported from utils
  return text;
};

export default MarkdownPreview;
