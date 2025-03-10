
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { deleteNote, getNotes, updateNote } from '@/lib/storage';
import { ContextMenuPosition, Note } from '@/lib/types';
import NoteCard from '@/components/notes/NoteCard';
import NoteContextMenu from '@/components/ui/context-menu/NoteContextMenu';
import MoveFolderDialog from '@/components/dialog/MoveFolderDialog';
import { toast } from 'sonner';

const Favorites: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [noteContextMenu, setNoteContextMenu] = useState<{note: Note, position: ContextMenuPosition} | null>(null);
  const [moveDialogState, setMoveDialogState] = useState<{
    isOpen: boolean;
    note: Note | null;
  }>({
    isOpen: false,
    note: null
  });

  useEffect(() => {
    // Load favorite notes from storage
    const allNotes = getNotes();
    setNotes(allNotes.filter(note => note.isFavorite));
  }, []);

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    const allNotes = getNotes();
    setNotes(allNotes.filter(note => note.isFavorite));
    toast.success("Note deleted successfully");
    setNoteContextMenu(null);
  };
  
  const handleToggleFavorite = (id: string) => {
    const noteToUpdate = notes.find(note => note.id === id);
    if (noteToUpdate) {
      const updatedNote = { ...noteToUpdate, isFavorite: !noteToUpdate.isFavorite };
      updateNote(updatedNote);
      const allNotes = getNotes();
      setNotes(allNotes.filter(note => note.isFavorite));
      
      toast.success(noteToUpdate.isFavorite 
        ? "Removed from favorites" 
        : "Added to favorites"
      );
    }
    setNoteContextMenu(null);
  };
  
  const handleDuplicateNote = (id: string) => {
    const noteToDuplicate = notes.find(note => note.id === id);
    if (noteToDuplicate) {
      const newNote = { ...noteToDuplicate };
      delete (newNote as any).id;
      newNote.title = `${noteToDuplicate.title} (Copy)`;
      
      // Add the duplicate note
      const allNotes = getNotes();
      const addedNote = { ...newNote, id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() } as Note;
      const updatedNotes = [...allNotes, addedNote];
      
      // Save to storage
      localStorage.setItem('codechime_notes', JSON.stringify(updatedNotes));
      setNotes(updatedNotes.filter(note => note.isFavorite));
      
      toast.success("Note duplicated successfully");
    }
    setNoteContextMenu(null);
  };
  
  const handleMoveNote = (note: Note) => {
    setMoveDialogState({
      isOpen: true,
      note
    });
    setNoteContextMenu(null);
  };
  
  const handleConfirmMove = (noteId: string, folderId: string | null) => {
    const noteToUpdate = notes.find(note => note.id === noteId);
    if (noteToUpdate) {
      const updatedNote = { ...noteToUpdate, folderId };
      updateNote(updatedNote);
      const allNotes = getNotes();
      setNotes(allNotes.filter(note => note.isFavorite));
      toast.success('Note moved successfully');
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">Favorites</h1>
        
        <div className="relative flex-1 md:w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search favorites..."
            className="pl-9 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-8 w-8"
              onClick={() => setSearchQuery('')}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {filteredNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">
            {searchQuery ? 'No favorites found' : 'No favorite notes yet'}
          </h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            {searchQuery 
              ? `No favorites match "${searchQuery}". Try a different search term.` 
              : 'Mark notes as favorites to quickly access them from here.'}
          </p>
          {!searchQuery && (
            <Button onClick={() => navigate('/notes')}>
              Browse All Notes
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <NoteContextMenu
              key={note.id}
              note={note}
              position={noteContextMenu?.note.id === note.id ? noteContextMenu.position : null}
              onEdit={(id) => navigate(`/editor/${id}`)}
              onDelete={handleDeleteNote}
              onToggleFavorite={handleToggleFavorite}
              onDuplicate={handleDuplicateNote}
              onMove={handleMoveNote}
              onClose={() => setNoteContextMenu(null)}
            >
              <div 
                onContextMenu={(e) => {
                  e.preventDefault();
                  setNoteContextMenu({
                    note,
                    position: { x: e.clientX, y: e.clientY }
                  });
                }}
              >
                <NoteCard
                  note={note}
                  onDelete={handleDeleteNote}
                  onToggleFavorite={handleToggleFavorite}
                />
              </div>
            </NoteContextMenu>
          ))}
        </div>
      )}
      
      {/* Move Note Dialog */}
      <MoveFolderDialog
        isOpen={moveDialogState.isOpen}
        onClose={() => setMoveDialogState({ isOpen: false, note: null })}
        onConfirm={handleConfirmMove}
        note={moveDialogState.note}
      />
    </div>
  );
};

export default Favorites;
