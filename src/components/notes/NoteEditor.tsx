
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Note, ViewMode } from '@/lib/types';
import { toast } from 'sonner';
import { addNote, getNotes, updateNote } from '@/lib/storage';
import EditorHeader from './EditorHeader';
import EditorArea from './EditorArea';
import useEditorFormatting from '@/hooks/useEditorFormatting';

interface NoteEditorProps {
  noteId?: string;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ noteId }) => {
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    if (noteId && noteId !== 'new') {
      const notes = getNotes();
      const foundNote = notes.find(n => n.id === noteId);
      
      if (foundNote) {
        setNote(foundNote as Note);
        setContent(foundNote.content);
      }
    } else if (noteId === 'new') {
      const newNote: Note = {
        id: 'new',
        type: 'note',
        title: 'Untitled Note',
        content: '',
        tags: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        isFavorite: false
      };
      setNote(newNote);
    }
  }, [noteId]);
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const saveNote = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      if (noteId === 'new' && note) {
        // For new notes, use addNote which expects certain properties
        const newNote = addNote({
          title: note.title,
          content,
          tags: note.tags,
          isFavorite: note.isFavorite,
          folderId: note.folderId,
          type: 'note'
        });
        
        setNote(newNote);
        navigate(`/editor/${newNote.id}`, { replace: true });
      } else if (note) {
        // For existing notes, use updateNote which expects a Note object
        // The issue was that we were passing content directly to updateNote
        // But updateNote expects a fully formed Note object
        const updatedNote = updateNote(note);
        
        // Since the note hasn't been updated with the new content yet,
        // we need to create a new object with the updated content
        const noteWithUpdatedContent: Note = {
          ...updatedNote as Note,
          content,
          updatedAt: new Date()
        };
        
        setNote(noteWithUpdatedContent);
      }
      
      setIsSaving(false);
      toast.success("Note saved successfully", {
        icon: <Check className="h-4 w-4 text-green-500" />
      });
    }, 500);
  };
  
  const toggleFavorite = () => {
    if (note) {
      // Create a new note object with the toggled favorite status
      const updatedNoteWithFavoriteToggled: Note = { 
        ...note, 
        isFavorite: !note.isFavorite
      };
      
      // Pass the updated note to updateNote and cast the result back to Note
      const result = updateNote(updatedNoteWithFavoriteToggled) as Note;
      
      // Update the local state with the result
      setNote(result);
      toast.success(note.isFavorite ? "Removed from favorites" : "Added to favorites");
    }
  };
  
  const handleNoteChange = (updatedNote: Note) => {
    setNote(updatedNote);
  };
  
  const scrollToHeading = (headingId: string) => {
    const previewContainer = document.querySelector('.markdown-preview');
    if (previewContainer) {
      const headingElement = previewContainer.querySelector(`#${headingId}`);
      if (headingElement) {
        headingElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };
  
  const { 
    contextMenu,
    handleContextMenu,
    closeContextMenu,
    handleCopy,
    handleCut,
    handlePaste,
    handleFormatBold,
    handleFormatItalic,
    handleFormatUnderline,
    handleFormatHeading1,
    handleFormatHeading2,
    handleFormatBulletList,
    handleFormatNumberedList,
    handleFormatBlockquote,
    handleInsertCodeSnippet,
    handleInsertDiagram
  } = useEditorFormatting({ content, setContent });
  
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
      <EditorHeader 
        note={note}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onNoteChange={handleNoteChange}
        toggleFavorite={toggleFavorite}
        saveNote={saveNote}
        isSaving={isSaving}
      />
      
      <EditorArea 
        content={content}
        viewMode={viewMode}
        onContentChange={handleContentChange}
        contextMenu={contextMenu}
        onContextMenu={handleContextMenu}
        closeContextMenu={closeContextMenu}
        handleCopy={handleCopy}
        handleCut={handleCut}
        handlePaste={handlePaste}
        handleFormatBold={handleFormatBold}
        handleFormatItalic={handleFormatItalic}
        handleFormatUnderline={handleFormatUnderline}
        handleFormatHeading1={handleFormatHeading1}
        handleFormatHeading2={handleFormatHeading2}
        handleFormatBulletList={handleFormatBulletList}
        handleFormatNumberedList={handleFormatNumberedList}
        handleFormatBlockquote={handleFormatBlockquote}
        handleInsertCodeSnippet={handleInsertCodeSnippet}
        handleInsertDiagram={handleInsertDiagram}
        onScrollTo={scrollToHeading}
      />
    </div>
  );
};

export default NoteEditor;
