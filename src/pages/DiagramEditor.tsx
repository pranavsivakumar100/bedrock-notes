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

const DiagramEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [title, setTitle] = useState('Untitled Diagram');
  const [selectedElement, setSelectedElement] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [lastSavedState, setLastSavedState] = useState<string | null>(null);
  
  useEffect(() => {
    document.title = `${title} - Diagram Editor`;
    
    if (id && id !== 'new' && canvas) {
      try {
        const diagram = getDiagram(id);
        if (diagram) {
          setTitle(diagram.title);
        }
      } catch (error) {
        console.error("Error loading diagram details:", error);
      }
    }
  }, [id, title, canvas]);
  
  useEffect(() => {
    if (!canvas) return;
    
    const captureCanvasState = () => {
      if (canvas) {
        const jsonState = JSON.stringify(canvas.toJSON());
        setUndoStack(prev => [...prev, jsonState]);
        setRedoStack([]);
      }
    };
    
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
          captureCanvasState();
        }
      }
    };
    
    canvas.on('object:modified', captureCanvasState);
    canvas.on('object:added', captureCanvasState);
    canvas.on('object:removed', captureCanvasState);
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      canvas.off('object:modified', captureCanvasState);
      canvas.off('object:added', captureCanvasState);
      canvas.off('object:removed', captureCanvasState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canvas, undoStack, redoStack]);
  
  const handleUndo = () => {
    if (undoStack.length <= 1 || !canvas) return;
    
    const currentState = undoStack[undoStack.length - 1];
    const previousState = undoStack[undoStack.length - 2];
    
    setRedoStack(prev => [...prev, currentState]);
    setUndoStack(prev => prev.slice(0, -1));
    
    canvas.loadFromJSON(previousState, () => {
      canvas.renderAll();
    });
  };
  
  const handleRedo = () => {
    if (redoStack.length === 0 || !canvas) return;
    
    const nextState = redoStack[redoStack.length - 1];
    
    setUndoStack(prev => [...prev, nextState]);
    setRedoStack(prev => prev.slice(0, -1));
    
    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
    });
  };
  
  const handleCopy = () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    
    canvas.getActiveObject()?.clone().then((clonedObj: any) => {
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
    <div className="flex flex-col h-full">
      <header className="border-b border-border/40 p-4 flex items-center justify-between glass-morphism">
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
            onClick={handleUndo}
            disabled={undoStack.length <= 1}
          >
            <Undo className="h-4 w-4" />
            <span className="sr-only">Undo</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRedo}
            disabled={redoStack.length === 0}
          >
            <Redo className="h-4 w-4" />
            <span className="sr-only">Redo</span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Clipboard className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleCopy} disabled={!selectedElement}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handlePaste}>
                <Clipboard className="h-4 w-4 mr-2" />
                Paste
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCut} disabled={!selectedElement}>
                <Scissors className="h-4 w-4 mr-2" />
                Cut
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => canvas?.clear()}>
                <Trash2 className="h-4 w-4 mr-2 text-destructive" />
                <span className="text-destructive">Clear Canvas</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline"
                className="h-9 gap-1"
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
              className="h-9 gap-1 text-destructive hover:bg-destructive/10"
              onClick={() => setConfirmDelete(true)}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
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
