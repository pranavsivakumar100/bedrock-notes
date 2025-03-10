
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, BookText, Code, File, Tag as TagIcon, Clock, Heart, User, Database, LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NoteCard from '@/components/notes/NoteCard';
import { getUser, getNotes, updateNote, deleteNote } from '@/lib/storage';
import { Note } from '@/lib/types';
import { toast } from 'sonner';
import AuthDialog from '@/components/auth/AuthDialog';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [user, setUser] = useState(getUser());
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  
  useEffect(() => {
    // Load notes from storage
    setNotes(getNotes());
  }, []);
  
  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    setNotes(getNotes());
    toast.success("Note deleted successfully");
  };
  
  const handleToggleFavorite = (id: string) => {
    const noteToUpdate = notes.find(note => note.id === id);
    if (noteToUpdate) {
      const updatedNote = { ...noteToUpdate, isFavorite: !noteToUpdate.isFavorite };
      updateNote(updatedNote);
      setNotes(getNotes());
      
      toast.success(noteToUpdate.isFavorite 
        ? "Removed from favorites" 
        : "Added to favorites"
      );
    }
  };
  
  return (
    <div className="container max-w-7xl py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
      {!user && (
        <div className="bg-muted/30 border rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Welcome to CodeChime Notes</h2>
              <p className="text-muted-foreground max-w-xl">
                Sign in to save your notes, create folders, and access your content from anywhere.
              </p>
            </div>
            <Button onClick={() => setAuthDialogOpen(true)} className="gap-2">
              <User className="h-4 w-4" />
              Sign In
            </Button>
          </div>
        </div>
      )}
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
          Welcome to CodeChime Notes
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl">
          Your all-in-one platform for computer science notes, code snippets, and technical diagrams.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        <div className="col-span-1 md:col-span-3 lg:col-span-4">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        </div>
        
        <Link to="/editor/new" className="block">
          <div className="bg-muted/40 hover:bg-muted/60 border border-border/50 rounded-lg p-6 h-full transition-colors flex flex-col items-center justify-center text-center">
            <div className="bg-background h-14 w-14 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-lg mb-1">New Note</h3>
            <p className="text-muted-foreground text-sm">Create a blank note</p>
          </div>
        </Link>
        
        <Link to="/code-snippets/new" className="block">
          <div className="bg-muted/40 hover:bg-muted/60 border border-border/50 rounded-lg p-6 h-full transition-colors flex flex-col items-center justify-center text-center">
            <div className="bg-background h-14 w-14 rounded-full flex items-center justify-center mb-4">
              <Code className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-lg mb-1">Code Snippet</h3>
            <p className="text-muted-foreground text-sm">Add a new code snippet</p>
          </div>
        </Link>
        
        <Link to="/diagram/new" className="block">
          <div className="bg-muted/40 hover:bg-muted/60 border border-border/50 rounded-lg p-6 h-full transition-colors flex flex-col items-center justify-center text-center">
            <div className="bg-background h-14 w-14 rounded-full flex items-center justify-center mb-4">
              <File className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-lg mb-1">Diagram</h3>
            <p className="text-muted-foreground text-sm">Create a new diagram</p>
          </div>
        </Link>
        
        <Link to="/templates" className="block">
          <div className="bg-muted/40 hover:bg-muted/60 border border-border/50 rounded-lg p-6 h-full transition-colors flex flex-col items-center justify-center text-center">
            <div className="bg-background h-14 w-14 rounded-full flex items-center justify-center mb-4">
              <BookText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-medium text-lg mb-1">Templates</h3>
            <p className="text-muted-foreground text-sm">Use a premade template</p>
          </div>
        </Link>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Notes</h2>
          <Button variant="outline" asChild>
            <Link to="/notes">View all</Link>
          </Button>
        </div>
        
        <Tabs defaultValue="recent" className="w-full">
          <TabsList>
            <TabsTrigger value="recent" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              Recent
            </TabsTrigger>
            <TabsTrigger value="favorites" className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              Favorites
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="recent" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes
                .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                .slice(0, 6)
                .map(note => (
                  <NoteCard 
                    key={note.id} 
                    note={note} 
                    onDelete={handleDeleteNote}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))
              }
              
              {notes.length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">No notes yet. Create your first note to get started.</p>
                  <Button onClick={() => navigate('/editor/new')} className="mt-4">
                    Create Note
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes
                .filter(note => note.isFavorite)
                .map(note => (
                  <NoteCard 
                    key={note.id} 
                    note={note} 
                    onDelete={handleDeleteNote}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))
              }
              
              {notes.filter(note => note.isFavorite).length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">No favorite notes yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* New Navigation Section */}
      <div className="mt-10 space-y-6">
        <h2 className="text-xl font-semibold">Navigation</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link to="/notes" className="block">
            <div className="flex items-center p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                <BookText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Notes</h3>
                <p className="text-sm text-muted-foreground">View all notes</p>
              </div>
            </div>
          </Link>
          
          <Link to="/code-snippets" className="block">
            <div className="flex items-center p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                <Code className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Code Snippets</h3>
                <p className="text-sm text-muted-foreground">Manage snippets</p>
              </div>
            </div>
          </Link>
          
          <Link to="/diagrams" className="block">
            <div className="flex items-center p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                <Database className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Diagrams</h3>
                <p className="text-sm text-muted-foreground">View all diagrams</p>
              </div>
            </div>
          </Link>
          
          <Link to="/templates" className="block">
            <div className="flex items-center p-4 bg-muted/30 hover:bg-muted/50 rounded-lg transition-colors">
              <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center mr-3">
                <LayoutTemplate className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Templates</h3>
                <p className="text-sm text-muted-foreground">Use templates</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
      
      {/* Auth Dialog */}
      <AuthDialog
        isOpen={authDialogOpen}
        onClose={() => {
          setAuthDialogOpen(false);
          setUser(getUser());
        }}
      />
    </div>
  );
};

export default Index;
