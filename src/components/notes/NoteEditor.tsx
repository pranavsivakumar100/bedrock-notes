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
import { getTags, updateTagsForNote } from '@/lib/tags-storage';

interface NoteEditorProps {
  noteId?: string;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ noteId }) => {
  const navigate = useNavigate();
  const [note, setNote] = useState<Note | null>(null);
  const [content, setContent] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
  const [isSaving, setIsSaving] = useState(false);
  
  // Load tags to display in the header
  const [tags, setTags] = useState(getTags());
  
  useEffect(() => {
    // Refresh tags when component mounts
    setTags(getTags());
    
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
        const newNote = addNote({
          title: note.title,
          content,
          tags: note.tags,
          isFavorite: note.isFavorite,
          folderId: note.folderId,
          type: 'note'
        });
        
        setNote(newNote);
        
        // Also update tags-notes relationship
        updateTagsForNote(newNote.id, note.tags);
        
        navigate(`/editor/${newNote.id}`, { replace: true });
      } else if (note) {
        const updatedNote = {
          ...note,
          content,
          updatedAt: new Date()
        };
        
        const savedNote = updateNote(updatedNote) as Note;
        setNote(savedNote);
        
        // Also update tags-notes relationship
        updateTagsForNote(savedNote.id, savedNote.tags);
      }
      
      setIsSaving(false);
      toast.success("Note saved successfully", {
        icon: <Check className="h-4 w-4 text-green-500" />
      });
    }, 500);
  };
  
  const toggleFavorite = () => {
    if (note) {
      const updatedNoteWithFavoriteToggled: Note = { 
        ...note, 
        isFavorite: !note.isFavorite
      };
      
      const result = updateNote(updatedNoteWithFavoriteToggled) as Note;
      
      setNote(result);
      toast.success(note.isFavorite ? "Removed from favorites" : "Added to favorites");
    }
  };
  
  const handleNoteChange = (updatedNote: Note) => {
    setNote(updatedNote);
  };
  
  const toggleTag = (tagId: string) => {
    if (!note) return;
    
    const hasTag = note.tags.includes(tagId);
    const updatedTags = hasTag
      ? note.tags.filter(id => id !== tagId)
      : [...note.tags, tagId];
    
    const updatedNote = {
      ...note,
      tags: updatedTags
    };
    
    setNote(updatedNote);
    
    // Only update in storage if it's not a new note
    if (note.id !== 'new') {
      updateNote(updatedNote);
      // Update the tags for this note in the tags storage
      updateTagsForNote(note.id, updatedTags);
    }
    
    toast.success(hasTag ? "Tag removed from note" : "Tag added to note");
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
        availableTags={tags}
        onToggleTag={toggleTag}
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
