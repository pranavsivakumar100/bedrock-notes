
import { toast } from 'sonner';

export interface Diagram {
  id: string;
  title: string;
  json: string;
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = 'cs-diagram-app-diagrams';

export function getDiagrams(): Diagram[] {
  try {
    const storedDiagrams = localStorage.getItem(STORAGE_KEY);
    if (!storedDiagrams) return [];
    
    const diagrams = JSON.parse(storedDiagrams);
    
    // Convert string dates to Date objects
    return diagrams.map((diagram: any) => ({
      ...diagram,
      createdAt: new Date(diagram.createdAt),
      updatedAt: new Date(diagram.updatedAt)
    }));
  } catch (error) {
    console.error('Error getting diagrams:', error);
    toast.error('Error loading diagrams');
    return [];
  }
}

export function getDiagram(id: string): Diagram | null {
  const diagrams = getDiagrams();
  return diagrams.find(diagram => diagram.id === id) || null;
}

export function saveDiagram(id: string, diagramData: Omit<Diagram, 'id'>): Diagram {
  try {
    const diagrams = getDiagrams();
    
    // Check if diagram with this ID already exists
    const existingDiagramIndex = diagrams.findIndex(diagram => diagram.id === id);
    
    let newDiagram: Diagram;
    
    if (existingDiagramIndex >= 0) {
      // Update existing diagram
      newDiagram = {
        ...diagrams[existingDiagramIndex],
        title: diagramData.title,
        json: diagramData.json,
        updatedAt: new Date()
      };
      
      diagrams[existingDiagramIndex] = newDiagram;
    } else {
      // Create new diagram
      newDiagram = {
        id: id === 'new' ? `diagram-${Date.now()}` : id,
        title: diagramData.title,
        json: diagramData.json,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      diagrams.push(newDiagram);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(diagrams));
    return newDiagram;
  } catch (error) {
    console.error('Error saving diagram:', error);
    toast.error('Error saving diagram');
    throw error;
  }
}

export function deleteDiagram(id: string): boolean {
  try {
    const diagrams = getDiagrams();
    const filteredDiagrams = diagrams.filter(diagram => diagram.id !== id);
    
    if (filteredDiagrams.length === diagrams.length) {
      return false; // No diagram with that ID found
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDiagrams));
    return true;
  } catch (error) {
    console.error('Error deleting diagram:', error);
    toast.error('Error deleting diagram');
    return false;
  }
}
