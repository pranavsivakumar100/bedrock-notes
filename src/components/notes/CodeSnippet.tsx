import React, { useState, useEffect, useRef } from 'react';
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
import Prism from 'prismjs';
import { ScrollArea } from '@/components/ui/scroll-area';

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

const languageMap: Record<string, string> = {
  javascript: 'language-javascript',
  typescript: 'language-typescript',
  python: 'language-python',
  java: 'language-java',
  c: 'language-c',
  cpp: 'language-cpp',
  csharp: 'language-csharp',
  ruby: 'language-ruby',
  go: 'language-go',
  rust: 'language-rust',
  html: 'language-html',
  css: 'language-css',
  json: 'language-json',
  bash: 'language-bash',
  sql: 'language-sql',
};

const CodeSnippet: React.FC<CodeSnippetProps> = ({ 
  code, 
  language,
  onLanguageChange 
}) => {
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language || 'javascript');
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, selectedLanguage]);

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
      if (selectedLanguage === 'javascript' || selectedLanguage === 'typescript') {
        try {
          const console = {
            log: (...args: any[]) => capturedOutput.push(...args.map(arg => String(arg))),
            error: (...args: any[]) => capturedOutput.push(...args.map(arg => String(arg))),
            warn: (...args: any[]) => capturedOutput.push(...args.map(arg => String(arg))),
            info: (...args: any[]) => capturedOutput.push(...args.map(arg => String(arg))),
          };
          
          const capturedOutput: string[] = [];
          
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
    <div className="rounded-lg overflow-hidden border border-border/50 my-4 bg-[#1f2937] shadow-lg">
      <div className="bg-[#111827] px-4 py-2 flex items-center justify-between border-b border-[#374151]">
        <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-40 h-8 bg-[#1f2937] border-[#374151] text-gray-300">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent className="bg-[#1f2937] border-[#374151]">
            {supportedLanguages.map(lang => (
              <SelectItem key={lang.value} value={lang.value} className="text-gray-300 focus:bg-[#374151] focus:text-white">
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-gray-300 hover:text-white hover:bg-[#374151]" 
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
              className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-700"
            >
              <Play className="h-3.5 w-3.5 mr-1" />
              {isRunning ? 'Running...' : 'Run'}
            </Button>
          )}
        </div>
      </div>
      
      <ScrollArea invisible className="max-h-[500px]">
        <div className="p-4 text-[#e2e8f0]">
          <pre className="!bg-transparent !p-0 !m-0 !overflow-visible">
            <code 
              ref={codeRef}
              className={cn(languageMap[selectedLanguage] || 'language-plaintext')}
            >
              {code}
            </code>
          </pre>
        </div>
      </ScrollArea>
      
      {output !== null && (
        <div className="border-t border-[#374151] bg-[#111827]">
          <div className="px-4 py-2 text-sm font-medium text-gray-300">Output</div>
          <ScrollArea invisible className="max-h-60">
            <pre className="p-4 text-sm font-mono text-gray-300">
              {output || 'No output'}
            </pre>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default CodeSnippet;
