
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
  Check,
  FileCode,
  Image
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Note, ViewMode, ContextMenuPosition } from '@/lib/types';
import { cn, renderMarkdown, extractCodeBlocks, extractHeadings } from '@/lib/utils';
import { toast } from 'sonner';
import CodeSnippet from './CodeSnippet';
import { addNote, getNotes, updateNote } from '@/lib/storage';
import EditorContextMenu from '@/components/ui/context-menu/EditorContextMenu';
import ScrollToSection from './ScrollToSection';

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const [contextMenu, setContextMenu] = useState<ContextMenuPosition | null>(null);
  
  useEffect(() => {
    if (noteId && noteId !== 'new') {
      const notes = getNotes();
      const foundNote = notes.find(n => n.id === noteId);
      
      if (foundNote) {
        setNote(foundNote);
        setContent(foundNote.content);
      }
    }
  }, [noteId]);
  
  useEffect(() => {
    if (previewRef.current && (viewMode === ViewMode.PREVIEW || viewMode === ViewMode.SPLIT)) {
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
  }, [content, viewMode]);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const saveNote = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      if (noteId === 'new') {
        const newNote = addNote({
          title: note?.title || 'Untitled Note',
          content,
          tags: note?.tags || [],
          isFavorite: note?.isFavorite || false,
          folderId: note?.folderId,
          type: 'note'
        });
        
        setNote(newNote);
        navigate(`/editor/${newNote.id}`, { replace: true });
      } else if (note) {
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
  
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };
  
  const closeContextMenu = () => {
    setContextMenu(null);
  };
  
  const handleCopy = () => {
    if (textareaRef.current) {
      const selected = textareaRef.current.value.substring(
        textareaRef.current.selectionStart,
        textareaRef.current.selectionEnd
      );
      navigator.clipboard.writeText(selected);
      toast.success("Copied to clipboard");
    }
    closeContextMenu();
  };
  
  const handleCut = () => {
    if (textareaRef.current) {
      const selected = textareaRef.current.value.substring(
        textareaRef.current.selectionStart,
        textareaRef.current.selectionEnd
      );
      navigator.clipboard.writeText(selected);
      
      const beforeSelection = textareaRef.current.value.substring(0, textareaRef.current.selectionStart);
      const afterSelection = textareaRef.current.value.substring(textareaRef.current.selectionEnd);
      setContent(beforeSelection + afterSelection);
      
      toast.success("Cut to clipboard");
    }
    closeContextMenu();
  };
  
  const handlePaste = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      
      if (textareaRef.current) {
        const cursorPosition = textareaRef.current.selectionStart;
        const beforeCursor = content.substring(0, cursorPosition);
        const afterCursor = content.substring(cursorPosition);
        
        setContent(beforeCursor + clipboardText + afterCursor);
      }
    } catch (error) {
      toast.error("Unable to paste from clipboard");
    }
    closeContextMenu();
  };
  
  const insertAtCursor = (before: string, after: string = '') => {
    if (textareaRef.current) {
      const cursorPosition = textareaRef.current.selectionStart;
      const selectionEnd = textareaRef.current.selectionEnd;
      const selectedText = content.substring(cursorPosition, selectionEnd);
      
      const beforeCursor = content.substring(0, cursorPosition);
      const afterCursor = content.substring(selectionEnd);
      
      setContent(beforeCursor + before + selectedText + after + afterCursor);
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.setSelectionRange(
            cursorPosition + before.length,
            cursorPosition + before.length + selectedText.length
          );
        }
      }, 0);
    }
    closeContextMenu();
  };
  
  const handleFormatBold = () => insertAtCursor('**', '**');
  const handleFormatItalic = () => insertAtCursor('*', '*');
  const handleFormatUnderline = () => insertAtCursor('<u>', '</u>');
  const handleFormatHeading1 = () => insertAtCursor('# ');
  const handleFormatHeading2 = () => insertAtCursor('## ');
  const handleFormatBulletList = () => insertAtCursor('- ');
  const handleFormatNumberedList = () => insertAtCursor('1. ');
  const handleFormatBlockquote = () => insertAtCursor('> ');
  
  const handleInsertCodeSnippet = () => {
    insertAtCursor('```javascript\n// Your code here\n```');
  };
  
  const handleInsertDiagram = () => {
    toast.info("Diagram insertion will open the diagram editor in a future update");
    // In a real implementation, this would open a diagram modal or navigate to the diagram editor
    closeContextMenu();
  };
  
  const scrollToHeading = (headingId: string) => {
    if (previewRef.current) {
      const headingElement = previewRef.current.querySelector(`#${headingId}`);
      if (headingElement) {
        headingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
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
  
  if (!note && noteId === 'new') {
    setNote({
      id: 'new',
      title: 'Untitled Note',
      content: '',
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isFavorite: false,
      type: 'note'
    });
  }
  
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
      
      <div className="flex-1 overflow-hidden relative">
        {(viewMode === ViewMode.PREVIEW || viewMode === ViewMode.SPLIT) && (
          <ScrollToSection 
            content={content} 
            onScrollTo={scrollToHeading} 
          />
        )}
        
        {viewMode === ViewMode.EDIT && (
          <EditorContextMenu
            position={contextMenu}
            onClose={closeContextMenu}
            onCopy={handleCopy}
            onCut={handleCut}
            onPaste={handlePaste}
            onFormatBold={handleFormatBold}
            onFormatItalic={handleFormatItalic}
            onFormatUnderline={handleFormatUnderline}
            onFormatHeading1={handleFormatHeading1}
            onFormatHeading2={handleFormatHeading2}
            onFormatBulletList={handleFormatBulletList}
            onFormatNumberedList={handleFormatNumberedList}
            onFormatBlockquote={handleFormatBlockquote}
            onInsertCodeSnippet={handleInsertCodeSnippet}
            onInsertDiagram={handleInsertDiagram}
          >
            <textarea
              ref={textareaRef}
              value={content}
              onChange={handleContentChange}
              placeholder="Start writing..."
              className="markdown-editor"
              onContextMenu={handleContextMenu}
            />
          </EditorContextMenu>
        )}
        
        {viewMode === ViewMode.PREVIEW && (
          <div ref={previewRef} className="h-full overflow-auto p-6">
            {renderPreview()}
          </div>
        )}
        
        {viewMode === ViewMode.SPLIT && (
          <div className="grid grid-cols-2 h-full gap-4 divide-x">
            <EditorContextMenu
              position={contextMenu}
              onClose={closeContextMenu}
              onCopy={handleCopy}
              onCut={handleCut}
              onPaste={handlePaste}
              onFormatBold={handleFormatBold}
              onFormatItalic={handleFormatItalic}
              onFormatUnderline={handleFormatUnderline}
              onFormatHeading1={handleFormatHeading1}
              onFormatHeading2={handleFormatHeading2}
              onFormatBulletList={handleFormatBulletList}
              onFormatNumberedList={handleFormatNumberedList}
              onFormatBlockquote={handleFormatBlockquote}
              onInsertCodeSnippet={handleInsertCodeSnippet}
              onInsertDiagram={handleInsertDiagram}
            >
              <textarea
                ref={textareaRef}
                value={content}
                onChange={handleContentChange}
                placeholder="Start writing..."
                className="markdown-editor"
                onContextMenu={handleContextMenu}
              />
            </EditorContextMenu>
            <div ref={previewRef} className="h-full overflow-auto p-6">
              {renderPreview()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;
