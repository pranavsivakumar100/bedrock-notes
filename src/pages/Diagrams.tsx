import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, Trash2, Database, FileCode, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getDiagrams, deleteDiagram } from '@/lib/diagram-storage';
import { Diagram } from '@/lib/types';
import { toast } from 'sonner';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const DiagramTypes = {
  'database': <Database className="h-5 w-5 text-blue-500" />,
  'flowchart': <Activity className="h-5 w-5 text-green-500" />,
  'architecture': <FileCode className="h-5 w-5 text-purple-500" />
};

const DiagramsPage: React.FC = () => {
  const navigate = useNavigate();
  const [diagrams, setDiagrams] = useState<Diagram[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [diagramToDelete, setDiagramToDelete] = useState<string | null>(null);
  
  useEffect(() => {
    loadDiagrams();
  }, []);
  
  const loadDiagrams = () => {
    const loadedDiagrams = getDiagrams();
    setDiagrams(loadedDiagrams);
  };
  
  const handleCreateNew = () => {
    navigate('/diagram/new');
  };
  
  const handleOpenDiagram = (id: string) => {
    navigate(`/diagram/${id}`);
  };
  
  const handleDeleteDiagram = () => {
    if (!diagramToDelete) return;
    
    if (deleteDiagram(diagramToDelete)) {
      toast.success('Diagram deleted successfully');
      loadDiagrams();
    } else {
      toast.error('Failed to delete diagram');
    }
    
    setDiagramToDelete(null);
  };
  
  const filteredDiagrams = diagrams.filter(diagram => 
    diagram.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="container py-8 max-w-5xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Diagrams</h1>
          <p className="text-muted-foreground">Create and manage CS diagrams</p>
        </div>
        
        <Button onClick={handleCreateNew}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Diagram
        </Button>
      </div>
      
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search diagrams..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {filteredDiagrams.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <h3 className="font-medium text-lg mb-2">No diagrams found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery 
              ? 'No diagrams match your search query' 
              : 'Create your first diagram to get started'}
          </p>
          {!searchQuery && (
            <Button onClick={handleCreateNew}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Diagram
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDiagrams.map((diagram) => (
            <div
              key={diagram.id}
              className="border rounded-lg overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div 
                className="h-40 bg-gray-100 dark:bg-gray-800 p-4 flex items-center justify-center cursor-pointer"
                onClick={() => handleOpenDiagram(diagram.id)}
              >
                <div className="text-4xl text-gray-400">
                  {Object.values(DiagramTypes)[Math.floor(Math.random() * Object.values(DiagramTypes).length)]}
                </div>
              </div>
              
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h3 
                    className="font-medium truncate cursor-pointer hover:underline"
                    onClick={() => handleOpenDiagram(diagram.id)}
                  >
                    {diagram.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {new Date(diagram.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => setDiagramToDelete(diagram.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Diagram</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{diagram.title}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setDiagramToDelete(null)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteDiagram}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DiagramsPage;
