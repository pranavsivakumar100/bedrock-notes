import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, util } from 'fabric';
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
  PanelRight,
  ArrowLeft,
  Layers,
  Undo,
  Redo,
  Clipboard,
  Copy,
  Scissors
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import DiagramToolbar from '@/components/diagrams/DiagramToolbar';
import DiagramSidebar from '@/components/diagrams/DiagramSidebar';
import DiagramCanvas from '@/components/diagrams/DiagramCanvas';
import { saveDiagram, getDiagram, deleteDiagram } from '@/lib/diagram-storage';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCanvasHistory } from '@/hooks/useCanvasHistory';

const DiagramEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [title, setTitle] = useState('Untitled Diagram');
  const [selectedElement, setSelectedElement] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [lastSavedState, setLastSavedState] = useState<string | null>(null);
  const [templateData, setTemplateData] = useState<any | null>(null);
  
  const { undo: handleUndo, redo: handleRedo } = useCanvasHistory(canvas);
  
  useEffect(() => {
    document.title = `${title} - Diagram Editor`;
    
    // Apply a class to the body to ensure full viewport usage
    document.body.classList.add('overflow-hidden');
    
    // Check for template data
    const storedTemplateData = localStorage.getItem('diagram_template');
    
    if (id === 'new' && storedTemplateData) {
      try {
        const template = JSON.parse(storedTemplateData);
        
        if (template.title) {
          setTitle(template.title);
        }
        
        if (template.json) {
          setTemplateData(template.json);
        }
        
        // Show a toast notification
        toast.success('Template applied!');
        
        // Clear the template data to prevent applying it again on refresh
        localStorage.removeItem('diagram_template');
      } catch (error) {
        console.error('Error parsing template data:', error);
      }
    } else if (id && id !== 'new' && canvas) {
      try {
        const diagram = getDiagram(id);
        if (diagram) {
          setTitle(diagram.title);
        }
      } catch (error) {
        console.error("Error loading diagram details:", error);
      }
    }
    
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [id, title, canvas]);
  
  useEffect(() => {
    if (canvas && templateData) {
      try {
        canvas.loadFromJSON(templateData, () => {
          canvas.renderAll();
          setTemplateData(null); // Clear template data after applying
        });
      } catch (error) {
        console.error('Error applying template to canvas:', error);
        toast.error('Failed to apply template');
      }
    }
  }, [canvas, templateData]);
  
  useEffect(() => {
    if (!canvas) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') {
          e.preventDefault();
          handleUndo();
        } else if (e.key === 'y' || (e.shiftKey && e.key === 'z')) {
          e.preventDefault();
          handleRedo();
        } else if (e.key === 's') {
          e.preventDefault();
          handleSaveDiagram();
        } else if (e.key === 'c') {
          e.preventDefault();
          if (canvas.getActiveObject()) {
            handleCopy();
          }
        } else if (e.key === 'v') {
          e.preventDefault();
          handlePaste();
        } else if (e.key === 'x') {
          e.preventDefault();
          if (canvas.getActiveObject()) {
            handleCut();
          }
        }
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (canvas.getActiveObject() && document.activeElement === document.body) {
          e.preventDefault();
          canvas.remove(canvas.getActiveObject());
          canvas.renderAll();
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, handleUndo, handleRedo]);
  
  const handleCopy = () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    activeObject.clone((clonedObj) => {
      localStorage.setItem('cs-diagram-clipboard', JSON.stringify(clonedObj.toJSON()));
      toast.success("Copied to clipboard");
    });
  };
  
  const handlePaste = () => {
    if (!canvas) return;
    
    const clipboard = localStorage.getItem('cs-diagram-clipboard');
    if (!clipboard) {
      toast.error("Nothing to paste");
      return;
    }
    
    try {
      util.enlivenObjects([JSON.parse(clipboard)]).then((objects: any[]) => {
        objects.forEach(obj => {
          obj.set({
            left: obj.left + 20,
            top: obj.top + 20,
          });
          canvas.add(obj);
          canvas.setActiveObject(obj);
        });
        canvas.renderAll();
      });
      toast.success("Pasted from clipboard");
    } catch (error) {
      toast.error("Failed to paste object");
      console.error("Paste error:", error);
    }
  };
  
  const handleCut = () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    handleCopy();
    canvas.remove(activeObject);
    canvas.renderAll();
  };
  
  const handleSaveDiagram = () => {
    if (!canvas) return;
    
    try {
      const json = canvas.toJSON();
      const jsonString = JSON.stringify(json);
      
      if (lastSavedState === jsonString) {
        toast.info("No changes to save");
        return;
      }
      
      const diagramId = id || `diagram-${Date.now()}`;
      
      saveDiagram(diagramId, {
        title,
        json: jsonString,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      setLastSavedState(jsonString);
      toast.success("Diagram saved successfully");
      
      if (id === 'new') {
        navigate(`/diagram/${diagramId}`, { replace: true });
      }
    } catch (error) {
      toast.error("Failed to save diagram");
      console.error("Save error:", error);
    }
  };
  
  const handleExportDiagram = (format: 'png' | 'svg' | 'json') => {
    if (!canvas) return;
    
    try {
      let dataUrl, filename, blob;
      
      switch (format) {
        case 'png':
          dataUrl = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2
          });
          filename = `${title.replace(/\s+/g, '-').toLowerCase()}.png`;
          break;
          
        case 'svg':
          dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(canvas.toSVG());
          filename = `${title.replace(/\s+/g, '-').toLowerCase()}.svg`;
          break;
          
        case 'json':
          const json = JSON.stringify(canvas.toJSON(), null, 2);
          blob = new Blob([json], { type: 'application/json' });
          const jsonUrl = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = jsonUrl;
          a.download = `${title.replace(/\s+/g, '-').toLowerCase()}.json`;
          a.click();
          
          URL.revokeObjectURL(jsonUrl);
          setShowExportDialog(false);
          toast.success(`Exported as JSON`);
          return;
      }
      
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      a.click();
      
      setShowExportDialog(false);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error(`Failed to export as ${format.toUpperCase()}`);
      console.error("Export error:", error);
    }
  };
  
  const handleDeleteDiagram = () => {
    if (id && id !== 'new') {
      try {
        deleteDiagram(id);
        toast.success("Diagram deleted");
        navigate('/diagrams');
      } catch (error) {
        toast.error("Failed to delete diagram");
        console.error("Delete error:", error);
      }
    }
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="diagram-editor-container h-screen flex flex-col">
      <header className="border-b border-border/40 p-2 flex items-center justify-between glass-morphism relative z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <a href="/diagrams">
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
            className="h-8 gap-1"
            onClick={toggleSidebar}
          >
            <PanelRight className="h-4 w-4 mr-1" />
            {sidebarOpen ? 'Hide' : 'Show'} Tools
          </Button>
          
          <Button 
            onClick={handleSaveDiagram} 
            className="h-8 gap-1"
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline"
                className="h-8 gap-1"
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Export As</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleExportDiagram('png')}>
                PNG Image
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportDiagram('svg')}>
                SVG Vector
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportDiagram('json')}>
                JSON File
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {id && id !== 'new' && (
            <Button 
              variant="outline"
              className="h-8 gap-1 text-destructive hover:bg-destructive/10"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </header>
      
      <div className="relative flex-1 h-[calc(100vh-48px)]">
        {/* Main Canvas Area */}
        <div className="w-full h-full">
          <DiagramToolbar canvas={canvas} />
          <div className="flex-1 relative h-[calc(100vh-90px)] bg-white">
            <DiagramCanvas 
              setCanvas={setCanvas} 
              diagramId={id} 
              setSelectedElement={setSelectedElement}
            />
          </div>
        </div>
        
        {/* Right Sidebar */}
        {sidebarOpen && (
          <div className="absolute top-[42px] right-0 bottom-0 w-[300px] border-l border-border/40 bg-background z-10 shadow-lg">
            <DiagramSidebar 
              canvas={canvas} 
              selectedElement={selectedElement} 
              setSelectedElement={setSelectedElement}
            />
          </div>
        )}
      </div>
      
      <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Diagram</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this diagram? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteDiagram}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DiagramEditor;
