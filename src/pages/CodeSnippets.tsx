
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, Code } from 'lucide-react';
import { getCodeSnippets } from '@/lib/storage';

const CodeSnippets: React.FC = () => {
  const navigate = useNavigate();
  const snippets = getCodeSnippets();

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Code Snippets</h1>
        <Button onClick={() => navigate('/code-snippets/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Snippet
        </Button>
      </div>

      {snippets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Code className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No code snippets yet</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Create your first code snippet to store and run code directly in your notes.
          </p>
          <Button onClick={() => navigate('/code-snippets/new')}>
            Create Snippet
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {snippets.map((snippet) => (
            <div 
              key={snippet.id} 
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/code-snippets/${snippet.id}`)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded font-mono">
                  {snippet.language}
                </span>
                <span className="text-xs text-muted-foreground">
                  {new Date(snippet.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="font-medium">{snippet.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodeSnippets;
