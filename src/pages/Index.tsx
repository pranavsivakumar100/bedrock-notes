
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, BookText, Code, FileDigit, Tag as TagIcon, Clock, Heart, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NoteCard from '@/components/notes/NoteCard';
import { getUser, getItems, updateNote, deleteNote } from '@/lib/storage';
import { Note, CodeSnippet, Diagram, BaseItem } from '@/lib/types';
import { toast } from 'sonner';
import AuthDialog from '@/components/auth/AuthDialog';

const Index: React.FC = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<(Note | CodeSnippet | Diagram)[]>([]);
  const [user, setUser] = useState(getUser());
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  
  useEffect(() => {
    setItems(getItems());
  }, []);
  
  const handleDelete = (id: string) => {
    deleteNote(id);
    setItems(getItems());
    toast.success("Item deleted successfully");
  };
  
  const handleToggleFavorite = (id: string) => {
    const itemToUpdate = items.find(item => item.id === id);
    if (itemToUpdate) {
      const updatedItem = { ...itemToUpdate, isFavorite: !itemToUpdate.isFavorite };
      updateNote(updatedItem);
      setItems(getItems());
      
      toast.success(itemToUpdate.isFavorite 
        ? "Removed from favorites" 
        : "Added to favorites"
      );
    }
  };

  const getItemPath = (item: BaseItem) => {
    switch (item.type) {
      case 'note':
        return `/editor/${item.id}`;
      case 'code-snippet':
        return `/code-snippets/${item.id}`;
      case 'diagram':
        return `/diagram/${item.id}`;
      default:
        return '/';
    }
  };

  // Helper to render appropriate content for different item types
  const getItemContent = (item: BaseItem) => {
    if (item.type === 'note') {
      return (item as Note).content || 'No content';
    } else if (item.type === 'code-snippet') {
      return (item as CodeSnippet).description || 'No description';
    } else if (item.type === 'diagram') {
      return 'Diagram';
    }
    return '';
  };

  return (
    <div className="container max-w-7xl py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
      {!user && (
        <div className="bg-muted/30 border rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Welcome to Bedrock Notes</h2>
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
          Welcome to Bedrock Notes
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
              <FileDigit className="h-6 w-6 text-primary" />
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
          <h2 className="text-xl font-semibold">Your Content</h2>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/notes">View all notes</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/code-snippets">View snippets</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/diagrams">View diagrams</Link>
            </Button>
          </div>
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
              {items
                .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
                .slice(0, 6)
                .map(item => (
                  <NoteCard 
                    key={item.id} 
                    note={item as Note}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                    href={getItemPath(item)}
                  />
                ))
              }
              
              {items.length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">No content yet. Create your first note, code snippet, or diagram to get started.</p>
                  <Button onClick={() => navigate('/editor/new')} className="mt-4">
                    Create Note
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items
                .filter(item => item.isFavorite)
                .map(item => (
                  <NoteCard 
                    key={item.id} 
                    note={item as Note}
                    onDelete={handleDelete}
                    onToggleFavorite={handleToggleFavorite}
                    href={getItemPath(item)}
                  />
                ))
              }
              
              {items.filter(item => item.isFavorite).length === 0 && (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground">No favorite items yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
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
