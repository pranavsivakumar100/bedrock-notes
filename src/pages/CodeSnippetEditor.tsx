
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Save } from 'lucide-react';
import { CodeExecutionResult } from '@/lib/types';
import { toast } from 'sonner';
import Prism from 'prismjs';

const CodeSnippetEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'new';
  
  const [title, setTitle] = useState(isNew ? '' : 'Sample Code Snippet');
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(isNew ? '' : 'function example() {\n  console.log("Hello from Bedrock!");\n}\n\nexample();');
  const [result, setResult] = useState<CodeExecutionResult | null>(null);
  const editorRef = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    // Apply line numbers and adjust textarea height
    if (editorRef.current) {
      editorRef.current.style.height = 'auto';
      editorRef.current.style.height = `${editorRef.current.scrollHeight}px`;
    }
    
    // Highlight code after it changes
    if (editorRef.current) {
      const preElement = document.createElement('pre');
      const codeElement = document.createElement('code');
      codeElement.className = `language-${language}`;
      codeElement.textContent = code;
      preElement.appendChild(codeElement);
      
      Prism.highlightElement(codeElement);
    }
  }, [code, language]);

  const handleSave = () => {
    // This would save to a database in a real app
    toast.success("Code snippet saved successfully");
  };

  const handleRunCode = () => {
    if (language === 'javascript' || language === 'typescript') {
      try {
        // Create a function from the code string and execute it
        const output: string[] = [];
        const originalConsoleLog = console.log;
        
        // Override console.log to capture output
        console.log = (...args) => {
          output.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
          ).join(' '));
        };
        
        // Execute the code
        try {
          // eslint-disable-next-line no-new-func
          const executableCode = new Function(code);
          executableCode();
          setResult({ 
            output: output.join('\n'), 
            isError: false 
          });
        } catch (error) {
          if (error instanceof Error) {
            setResult({ 
              output: `Error: ${error.message}`, 
              error: error.message,
              isError: true 
            });
          }
        }
        
        // Restore original console.log
        console.log = originalConsoleLog;
      } catch (error) {
        if (error instanceof Error) {
          setResult({ 
            output: `Error: ${error.message}`, 
            error: error.message,
            isError: true 
          });
        }
      }
    } else {
      setResult({ 
        output: `Running ${language} code is not supported in the browser. This would be handled by a backend service in a production environment.`, 
        isError: false 
      });
      toast.info("Backend execution is not available in this preview");
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="mb-6">
        <Input
          type="text"
          placeholder="Untitled Code Snippet"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold bg-transparent border-none focus-visible:ring-0 p-0 h-auto text-foreground placeholder:text-muted-foreground/50"
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="w-full md:w-auto">
          <Label htmlFor="language" className="mb-2 block">Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger id="language" className="w-full md:w-[200px]">
              <SelectValue placeholder="Select Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="java">Java</SelectItem>
              <SelectItem value="c">C</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
              <SelectItem value="csharp">C#</SelectItem>
              <SelectItem value="go">Go</SelectItem>
              <SelectItem value="rust">Rust</SelectItem>
              <SelectItem value="ruby">Ruby</SelectItem>
              <SelectItem value="php">PHP</SelectItem>
              <SelectItem value="swift">Swift</SelectItem>
              <SelectItem value="kotlin">Kotlin</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Button onClick={handleSave} variant="outline" className="gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button onClick={handleRunCode} className="gap-2">
            <Play className="h-4 w-4" />
            Run Code
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <Label htmlFor="code-editor" className="mb-2">Code</Label>
          <div className="font-mono text-sm flex-1 rounded-md border min-h-[400px] bg-[#1f2937] overflow-hidden relative">
            <textarea
              ref={editorRef}
              id="code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="font-mono text-sm w-full h-full p-4 resize-none absolute inset-0 bg-transparent text-gray-300 border-0 focus:ring-0 outline-none"
              placeholder="Write your code here..."
              spellCheck="false"
            />
          </div>
        </div>

        <div className="flex flex-col">
          <Label className="mb-2">Output</Label>
          <Card className="flex-1 border-[#374151] bg-[#1f2937] min-h-[400px]">
            <CardContent className="p-0 h-full">
              <pre 
                className={`font-mono text-sm p-4 overflow-auto h-full ${
                  result?.isError ? 'text-red-400' : 'text-gray-300'
                }`}
              >
                {result ? result.output : 'Code output will appear here after running'}
              </pre>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetEditor;
