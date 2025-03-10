
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart } from 'lucide-react';

const Favorites: React.FC = () => {
  // This would typically come from a state management solution or API
  const favoriteNotes = [];

  return (
    <div className="container mx-auto px-4 py-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Favorites</h1>

      {favoriteNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Heart className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No favorite notes yet</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            Mark notes as favorites to quickly access them from here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {favoriteNotes.map((note) => (
            <Card key={note.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{note.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground truncate">
                  {note.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
