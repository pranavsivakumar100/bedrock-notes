
import React, { useRef, useEffect } from 'react';
import { extractCodeBlocks } from '@/lib/utils';
import CodeSnippet from './CodeSnippet';

interface MarkdownPreviewProps {
  content: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  const previewRef = useRef<HTMLDivElement>(null);
  
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
    }
  }, [content]);
  
  const renderPreview = () => {
    const blocks = extractCodeBlocks(content);
    
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

  // Import this function from utils to avoid duplication
  const renderMarkdown = (markdown: string): string => {
    // Process regular markdown for text blocks
    return markdown
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
  };

  return (
    <div ref={previewRef}>
      {renderPreview()}
    </div>
  );
};

export default MarkdownPreview;
