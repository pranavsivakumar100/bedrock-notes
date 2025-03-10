import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Heart } from 'lucide-react';
import { Note } from '@/lib/types';

const Notes: React.FC = () => {
  const navigate = useNavigate();

  // Sample notes for illustration
  const notes: Note[] = [
    {
      id: '1',
      title: 'Introduction to Algorithms',
      content: 'Algorithm analysis is an important part of computational complexity theory...',
      tags: ['algorithms', 'computer science'],
      createdAt: new Date(2023, 4, 10),
      updatedAt: new Date(2023, 4, 15),
      isFavorite: true
    },
    {
      id: '2',
      title: 'Data Structures Overview',
      content: 'Data structures are a way of organizing and storing data...',
      tags: ['data structures', 'computer science'],
      createdAt: new Date(2023, 5, 5),
      updatedAt: new Date(2023, 5, 7),
      isFavorite: false
    }
  ];

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Notes</h1>
        <Button onClick={() => navigate('/editor/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Note
        </Button>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No notes yet</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Create your first note to get started with Bedrock.
          </p>
          <Button onClick={() => navigate('/editor/new')}>
            Create Note
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div 
              key={note.id} 
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer note-card"
              onClick={() => navigate(`/editor/${note.id}`)}
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-medium">{note.title}</h3>
                {note.isFavorite && <Heart className="h-4 w-4 text-rose-500 fill-rose-500" />}
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {note.content}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex gap-1 flex-wrap">
                  {note.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="text-xs text-muted-foreground">
                  {note.updatedAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notes;
