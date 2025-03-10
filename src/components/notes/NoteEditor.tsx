
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Eye, 
  Code, 
  Split, 
  Heart, 
  Save, 
  ArrowLeft, 
  Tag as TagIcon,
  AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Note, ViewMode } from '@/lib/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

// For demo purposes, we'll use a mockup note
const getMockNote = (id: string): Note => ({
  id,
  title: 'Understanding Data Structures',
  content: `# Understanding Data Structures

## Introduction
Data structures are specialized formats for organizing, processing, retrieving and storing data. There are several basic and advanced types of data structures, all designed to arrange data to suit a specific purpose.

## Arrays
Arrays are a simple data structure where elements are stored in contiguous memory locations:

\`\`\`javascript
// Creating an array
const array = [1, 2, 3, 4, 5];

// Accessing elements
console.log(array[0]); // Output: 1
\`\`\`

## Linked Lists
A linked list is a sequence of data structures, connected via links:

\`\`\`python
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

class LinkedList:
    def __init__(self):
        self.head = None
\`\`\`

## Trees
Trees are hierarchical data structures:

\`\`\`java
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    
    TreeNode(int x) { 
        val = x; 
    }
}
\`\`\``,
  tags: ['data-structures', 'algorithms', 'computer-science'],
  createdAt: new Date('2023-10-15T14:48:00'),
  updatedAt: new Date('2023-10-16T09:22:00'),
  isFavorite: false
});

const NoteEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (id && id !== 'new') {
      // In a real app, we'd fetch the note from an API
      const mockNote = getMockNote(id);
      setNote(mockNote);
      setContent(mockNote.content);
    }
  }, [id]);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const saveNote = () => {
    setIsSaving(true);
    // In a real app, we'd send this to an API
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Note saved successfully");
    }, 800);
  };
  
  const toggleFavorite = () => {
    if (note) {
      setNote({ ...note, isFavorite: !note.isFavorite });
      toast.success(note.isFavorite ? "Removed from favorites" : "Added to favorites");
    }
  };
  
  if (!note && id !== 'new') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
          <h2 className="text-xl font-medium">Note not found</h2>
          <p className="text-muted-foreground">The note you're looking for doesn't exist or has been deleted.</p>
          <Button asChild>
            <a href="/">Go back home</a>
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <header className="border-b border-border/40 p-4 flex items-center justify-between glass-morphism">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </a>
          </Button>
          
          <input
            type="text"
            placeholder="Untitled Note"
            value={note?.title || ''}
            onChange={(e) => note && setNote({ ...note, title: e.target.value })}
            className="bg-transparent border-none outline-none focus:ring-0 text-xl font-medium w-full max-w-md"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <div className="border border-border/40 rounded-lg p-1 flex bg-background/40 backdrop-blur-sm">
            <Button
              variant={viewMode === ViewMode.EDIT ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode(ViewMode.EDIT)}
              className="rounded-md h-8"
            >
              <Code className="h-4 w-4 mr-1" />
              Edit
            </Button>
            
            <Button
              variant={viewMode === ViewMode.PREVIEW ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode(ViewMode.PREVIEW)}
              className="rounded-md h-8"
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>
            
            <Button
              variant={viewMode === ViewMode.SPLIT ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode(ViewMode.SPLIT)}
              className="rounded-md h-8"
            >
              <Split className="h-4 w-4 mr-1" />
              Split
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleFavorite}
            className={cn(
              "h-9 w-9",
              note?.isFavorite && "text-red-500"
            )}
          >
            <Heart className="h-5 w-5" fill={note?.isFavorite ? "currentColor" : "none"} />
            <span className="sr-only">Toggle favorite</span>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
          >
            <TagIcon className="h-5 w-5" />
            <span className="sr-only">Manage tags</span>
          </Button>
          
          <Button 
            onClick={saveNote} 
            disabled={isSaving}
            className="h-9 gap-1"
          >
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        {viewMode === ViewMode.EDIT && (
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing..."
            className="markdown-editor"
          />
        )}
        
        {viewMode === ViewMode.PREVIEW && (
          <div 
            className="markdown-preview"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        )}
        
        {viewMode === ViewMode.SPLIT && (
          <div className="grid grid-cols-2 h-full gap-4 divide-x">
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing..."
              className="markdown-editor"
            />
            <div 
              className="markdown-preview"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

// Simple markdown renderer for demo purposes
// In a real app, we'd use a proper markdown library
function renderMarkdown(markdown: string): string {
  let html = markdown
    // Headers
    .replace(/^# (.*?)$/gm, '<h1>$1</h1>')
    .replace(/^## (.*?)$/gm, '<h2>$1</h2>')
    .replace(/^### (.*?)$/gm, '<h3>$1</h3>')
    // Code blocks
    .replace(/```(.*?)\n([\s\S]*?)```/gm, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Paragraphs (must be after other transformations)
    .replace(/^(?!<h|<pre|<ul|<ol|<p)(.*?)$/gm, '<p>$1</p>');
  
  return html;
}

export default NoteEditor;
