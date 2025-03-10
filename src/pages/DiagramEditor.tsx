
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas } from 'fabric';
import { 
  Database, 
  Server, 
  Circle, 
  Square, 
  Triangle, 
  ArrowRight,
  GitBranch,
  Component,
  Maximize,
  Minimize,
  Router,
  Code,
  Terminal,
  MessageSquare,
  Lock,
  Key,
  Save,
  Share,
  Download,
  Trash2,
  PanelLeft,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import DiagramToolbar from '@/components/diagrams/DiagramToolbar';
import DiagramSidebar from '@/components/diagrams/DiagramSidebar';
import DiagramCanvas from '@/components/diagrams/DiagramCanvas';
import { saveDiagram, getDiagram } from '@/lib/diagram-storage';

const DiagramEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [title, setTitle] = useState('Untitled Diagram');
  const [selectedElement, setSelectedElement] = useState<any | null>(null);
  
  const handleSaveDiagram = () => {
    if (!canvas) return;
    
    try {
      const json = canvas.toJSON();
      const diagramId = id || `diagram-${Date.now()}`;
      
      saveDiagram(diagramId, {
        title,
        json: JSON.stringify(json),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      toast.success("Diagram saved successfully");
      
      if (id === 'new') {
        navigate(`/diagram/${diagramId}`, { replace: true });
      }
    } catch (error) {
      toast.error("Failed to save diagram");
      console.error("Save error:", error);
    }
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex flex-col h-full">
      <header className="border-b border-border/40 p-4 flex items-center justify-between glass-morphism">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </a>
          </Button>
          
          <input
            type="text"
            placeholder="Untitled Diagram"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent border-none outline-none focus:ring-0 text-xl font-medium w-full max-w-md"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleSidebar}
          >
            <PanelLeft className="h-4 w-4 mr-1" />
            {sidebarOpen ? 'Hide' : 'Show'} Sidebar
          </Button>
          
          <Button 
            onClick={handleSaveDiagram} 
            className="h-9 gap-1"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          
          <Button 
            variant="outline"
            className="h-9 gap-1"
          >
            <Share className="h-4 w-4" />
            Share
          </Button>
          
          <Button 
            variant="outline"
            className="h-9 gap-1"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {sidebarOpen && (
          <DiagramSidebar 
            canvas={canvas} 
            selectedElement={selectedElement} 
            setSelectedElement={setSelectedElement}
          />
        )}
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <DiagramToolbar canvas={canvas} />
          <DiagramCanvas 
            setCanvas={setCanvas} 
            diagramId={id} 
            setSelectedElement={setSelectedElement}
          />
        </div>
      </div>
    </div>
  );
};

export default DiagramEditor;
