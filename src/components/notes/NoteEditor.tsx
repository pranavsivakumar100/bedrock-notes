
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  Code, 
  Split, 
  Heart, 
  Save, 
  ArrowLeft, 
  Tag as TagIcon,
  AlertCircle,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Note, ViewMode } from '@/lib/types';
import { cn, renderMarkdown, extractCodeBlocks } from '@/lib/utils';
import { toast } from 'sonner';
import CodeSnippet from './CodeSnippet';
import { addNote, getNotes, updateNote } from '@/lib/storage';

interface NoteEditorProps {
  noteId?: string;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ noteId }) => {
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
  const [isSaving, setIsSaving] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (noteId && noteId !== 'new') {
      // Load the note from storage
      const notes = getNotes();
      const foundNote = notes.find(n => n.id === noteId);
      
      if (foundNote) {
        setNote(foundNote);
        setContent(foundNote.content);
      }
    }
  }, [noteId]);
  
  useEffect(() => {
    // After rendering markdown, hydrate the code blocks with our React component
    if (previewRef.current && (viewMode === ViewMode.PREVIEW || viewMode === ViewMode.SPLIT)) {
      const codeBlocks = previewRef.current.querySelectorAll('pre[data-code]');
      codeBlocks.forEach((block) => {
        const code = decodeURIComponent(block.getAttribute('data-code') || '');
        const language = block.getAttribute('data-language') || 'plaintext';
        
        // Create a React root and render our component
        if (code && !block.hasAttribute('data-hydrated')) {
          block.setAttribute('data-hydrated', 'true');
          
          // Replace the pre tag with our CodeSnippet component
          const div = document.createElement('div');
          block.parentNode?.replaceChild(div, block);
          
          // Render the CodeSnippet in the div
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
  }, [content, viewMode]);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const saveNote = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      if (noteId === 'new') {
        // Create a new note
        const newNote = addNote({
          title: note?.title || 'Untitled Note',
          content,
          tags: note?.tags || [],
          isFavorite: note?.isFavorite || false,
          folderId: note?.folderId
        });
        
        setNote(newNote);
        navigate(`/editor/${newNote.id}`, { replace: true });
      } else if (note) {
        // Update existing note
        const updatedNote = updateNote({
          ...note,
          content,
        });
        
        setNote(updatedNote);
      }
      
      setIsSaving(false);
      toast.success("Note saved successfully", {
        icon: <Check className="h-4 w-4 text-green-500" />
      });
    }, 500);
  };
  
  const toggleFavorite = () => {
    if (note) {
      const updatedNote = { ...note, isFavorite: !note.isFavorite };
      updateNote(updatedNote);
      setNote(updatedNote);
      toast.success(note.isFavorite ? "Removed from favorites" : "Added to favorites");
    }
  };
  
  if (!note && noteId !== 'new') {
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
  
  // For new notes, create a default note object
  if (!note && noteId === 'new') {
    setNote({
      id: 'new',
      title: 'Untitled Note',
      content: '',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false
    });
  }
  
  const renderPreview = () => {
    // Extract code blocks to render them with our CodeSnippet component
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
          <div ref={previewRef}>
            {renderPreview()}
          </div>
        )}
        
        {viewMode === ViewMode.SPLIT && (
          <div className="grid grid-cols-2 h-full gap-4 divide-x">
            <textarea
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing..."
              className="markdown-editor"
            />
            <div ref={previewRef}>
              {renderPreview()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;
