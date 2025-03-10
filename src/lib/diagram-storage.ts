import { toast } from 'sonner';
import { Diagram } from '@/lib/types';
import { getItems, updateNote, deleteNote } from '@/lib/storage';

export interface DiagramData {
  id: string;
  title: string;
  json: string;
  createdAt: Date;
  updatedAt: Date;
}

const STORAGE_KEY = 'cs-diagram-app-diagrams';

export function getDiagrams(): Diagram[] {
  try {
    const allItems = getItems();
    return allItems.filter(item => item.type === 'diagram') as Diagram[];
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

export function saveDiagram(id: string, diagramData: Omit<DiagramData, 'id'>): Diagram {
  try {
    const now = new Date();
    const isNew = id === 'new';
    const diagramId = isNew ? `diagram-${Date.now()}` : id;
    
    // Create diagram item to be saved in the main storage
    const diagram: Diagram = {
      id: diagramId,
      title: diagramData.title,
      content: diagramData.json, // Map json to content which is used in the Diagram type
      createdAt: isNew ? now : new Date(diagramData.createdAt),
      updatedAt: now,
      isFavorite: false,
      type: 'diagram'
    };
    
    // Save to main storage using updateNote function
    updateNote(diagram);
    
    return diagram;
  } catch (error) {
    console.error('Error saving diagram:', error);
    toast.error('Error saving diagram');
    throw error;
  }
}

export function deleteDiagram(id: string): boolean {
  try {
    deleteNote(id);
    return true;
  } catch (error) {
    console.error('Error deleting diagram:', error);
    toast.error('Error deleting diagram');
    return false;
  }
}
