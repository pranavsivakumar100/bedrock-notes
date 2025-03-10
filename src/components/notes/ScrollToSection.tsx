
import React, { useState, useEffect } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { extractHeadings } from '@/lib/utils';

interface ScrollToSectionProps {
  content: string;
  onScrollTo: (elementId: string) => void;
}

const ScrollToSection: React.FC<ScrollToSectionProps> = ({ content, onScrollTo }) => {
  const [headings, setHeadings] = useState<{ text: string; level: number; id: string }[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setHeadings(extractHeadings(content));
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-50">
      <div className="relative">
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full shadow-md bg-background/80 backdrop-blur-sm"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
        </Button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-background/90 backdrop-blur-md rounded-lg shadow-lg border border-border/50 p-2">
            <ScrollArea className="max-h-[40vh]">
              <div className="space-y-1 px-1 py-2">
                {headings.map((heading) => (
                  <button
                    key={heading.id}
                    onClick={() => {
                      onScrollTo(heading.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-sm rounded-md hover:bg-muted transition-colors
                      ${heading.level === 1 ? 'font-bold' : ''}
                      ${heading.level === 2 ? 'font-medium pl-4' : ''}
                      ${heading.level === 3 ? 'font-normal pl-6 text-xs' : ''}
                    `}
                  >
                    {heading.text}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScrollToSection;
