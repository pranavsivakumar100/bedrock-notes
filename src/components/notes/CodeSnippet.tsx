
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Play, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface CodeSnippetProps {
  code: string;
  language: string;
  onLanguageChange?: (language: string) => void;
}

const supportedLanguages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'bash', label: 'Bash' },
  { value: 'sql', label: 'SQL' },
];

const CodeSnippet: React.FC<CodeSnippetProps> = ({ 
  code, 
  language,
  onLanguageChange 
}) => {
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language || 'javascript');

  const handleLanguageChange = (value: string) => {
    setSelectedLanguage(value);
    if (onLanguageChange) {
      onLanguageChange(value);
    }
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput(null);
    
    try {
      // For JavaScript/TypeScript, we can use the browser's eval
      if (selectedLanguage === 'javascript' || selectedLanguage === 'typescript') {
        try {
          // Create a safe environment for eval
          const console = {
            log: (...args: any[]) => capturedOutput.push(...args.map(arg => String(arg))),
            error: (...args: any[]) => capturedOutput.push(...args.map(arg => String(arg))),
            warn: (...args: any[]) => capturedOutput.push(...args.map(arg => String(arg))),
            info: (...args: any[]) => capturedOutput.push(...args.map(arg => String(arg))),
          };
          
          const capturedOutput: string[] = [];
          
          // Execute the code
          // eslint-disable-next-line no-new-func
          const result = new Function('console', `
            try {
              ${code}
              return { success: true, result: undefined };
            } catch (error) {
              return { success: false, error: error.toString() };
            }
          `)(console);
          
          if (!result.success) {
            capturedOutput.push(`Error: ${result.error}`);
          }
          
          setOutput(capturedOutput.join('\n'));
        } catch (error) {
          setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
        }
      } else {
        // For other languages, we would need a backend service
        // For now, we'll just display a message
        setOutput(`Running ${selectedLanguage} code requires a backend service which is not yet implemented.`);
        toast.info("Backend execution is not available in this preview");
      }
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success("Code copied to clipboard");
  };

  return (
    <div className="rounded-lg overflow-hidden border border-border/50 my-4">
      <div className="bg-muted/50 px-4 py-2 flex items-center justify-between">
        <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-40 h-8">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {supportedLanguages.map(lang => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={copyCode}
          >
            {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </Button>
          
          {(selectedLanguage === 'javascript' || selectedLanguage === 'typescript') && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={runCode} 
              disabled={isRunning}
              className="h-8"
            >
              <Play className="h-3.5 w-3.5 mr-1" />
              {isRunning ? 'Running...' : 'Run'}
            </Button>
          )}
        </div>
      </div>
      
      <pre className={cn(
        "p-4 overflow-auto text-sm font-mono", 
        (selectedLanguage === 'javascript' || selectedLanguage === 'typescript') && "rounded-t-none rounded-b-lg"
      )}>
        <code>{code}</code>
      </pre>
      
      {output !== null && (
        <div className="border-t border-border/50 bg-background/50">
          <div className="px-4 py-2 text-sm font-medium">Output</div>
          <pre className="p-4 overflow-auto max-h-40 text-sm font-mono bg-black/5 dark:bg-white/5">
            {output || 'No output'}
          </pre>
        </div>
      )}
    </div>
  );
};

export default CodeSnippet;
