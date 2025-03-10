
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, BookText, Code, File, Tag as TagIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NoteCard from '@/components/notes/NoteCard';
import { Note } from '@/lib/types';
import { toast } from 'sonner';

// Mock data for demonstration
const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Understanding Data Structures',
    content: 'Data structures are specialized formats for organizing, processing, retrieving and storing data. There are several basic and advanced types of data structures, all designed to arrange data to suit a specific purpose.',
    tags: ['data-structures', 'algorithms'],
    createdAt: new Date('2023-10-15T14:48:00'),
    updatedAt: new Date('2023-10-16T09:22:00'),
    isFavorite: true
  },
  {
    id: '2',
    title: 'Introduction to Algorithms',
    content: 'In mathematics and computer science, an algorithm is a finite sequence of well-defined, computer-implementable instructions, typically to solve a class of problems or to perform a computation.',
    tags: ['algorithms', 'complexity'],
    createdAt: new Date('2023-10-10T11:32:00'),
    updatedAt: new Date('2023-10-12T16:49:00'),
    isFavorite: false
  },
  {
    id: '3',
    title: 'Graph Theory Basics',
    content: 'Graph theory is the study of graphs, which are mathematical structures used to model pairwise relations between objects. A graph in this context is made up of vertices (also called nodes or points) which are connected by edges (also called links or lines).',
    tags: ['graph-theory', 'discrete-math'],
    createdAt: new Date('2023-09-28T09:14:00'),
    updatedAt: new Date('2023-09-30T15:20:00'),
    isFavorite: false
  },
  {
    id: '4',
    title: 'Recursion Techniques',
    content: 'Recursion in computer science is a method of solving a problem where the solution depends on solutions to smaller instances of the same problem. Such problems can generally be solved by iteration, but this needs to identify and index the smaller instances at programming time.',
    tags: ['recursion', 'algorithms'],
    createdAt: new Date('2023-09-22T13:45:00'),
    updatedAt: new Date('2023-09-23T10:31:00'),
    isFavorite: true
  },
  {
    id: '5',
    title: 'Dynamic Programming',
    content: 'Dynamic programming is both a mathematical optimization method and a computer programming method. The method was developed by Richard Bellman in the 1950s and has found applications in numerous fields, from aerospace engineering to economics.',
    tags: ['dynamic-programming', 'optimization'],
    createdAt: new Date('2023-09-18T16:22:00'),
    updatedAt: new Date('2023-09-20T11:16:00'),
    isFavorite: false
  }
];

const Index: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  
  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
    toast.success("Note deleted successfully");
  };
  
  const handleToggleFavorite = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id 
        ? { ...note, isFavorite: !note.isFavorite } 
        : note
    ));
    
    const note = notes.find(n => n.id === id);
    if (note) {
      toast.success(note.isFavorite 
        ? "Removed from favorites" 
        : "Added to favorites"
      );
    }
  };
  
  return (
    <div className="container max-w-7xl py-6 px-4 sm:px-6 lg:px-8 animate-fade-in">
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
        
        <Link to="/diagrams/new" className="block">
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
              <TagIcon className="h-4 w-4" />
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
    </div>
  );
};

export default Index;
