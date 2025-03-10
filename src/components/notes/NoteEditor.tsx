
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Note, ViewMode, ContextMenuPosition } from '@/lib/types';
import { toast } from 'sonner';
import { addNote, getNotes, updateNote } from '@/lib/storage';
import NoteEditorHeader from './NoteEditorHeader';
import MarkdownEditor from './MarkdownEditor';
import MarkdownPreview from './MarkdownPreview';

interface NoteEditorProps {
  noteId?: string;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ noteId }) => {
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
  const [isSaving, setIsSaving] = useState(false);
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
  }, [note, noteId]);
  
  const handleContentChange = (newContent: string) => {
    setContent(newContent);
  };
  
  const handleTitleChange = (title: string) => {
    if (note) {
      setNote({ ...note, title });
    }
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
          folderId: note?.folderId
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
  
  return (
    <div className="flex flex-col h-full">
      <NoteEditorHeader 
        note={note}
        isSaving={isSaving}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onTitleChange={handleTitleChange}
        onToggleFavorite={toggleFavorite}
        onSave={saveNote}
      />
      
      <div className="flex-1 overflow-hidden">
        {viewMode === ViewMode.EDIT && (
          <MarkdownEditor
            content={content}
            onChange={handleContentChange}
            contextMenu={contextMenu}
            onContextMenu={handleContextMenu}
            onCloseContextMenu={closeContextMenu}
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
          />
        )}
        
        {viewMode === ViewMode.PREVIEW && (
          <MarkdownPreview content={content} />
        )}
        
        {viewMode === ViewMode.SPLIT && (
          <div className="grid grid-cols-2 h-full gap-4 divide-x">
            <MarkdownEditor
              content={content}
              onChange={handleContentChange}
              contextMenu={contextMenu}
              onContextMenu={handleContextMenu}
              onCloseContextMenu={closeContextMenu}
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
            />
            <MarkdownPreview content={content} />
          </div>
        )}
      </div>
    </div>
  );
};

export default NoteEditor;
