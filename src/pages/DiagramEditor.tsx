
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Canvas, util, Object as FabricObject } from 'fabric';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useCanvasHistory } from '@/hooks/useCanvasHistory';

// Define an interface for the clone method to help TypeScript understand it
interface FabricObjectWithClone extends FabricObject {
  clone(callback?: (cloned: FabricObject) => void): FabricObject;
}

const DiagramEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(true);
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [title, setTitle] = useState('Untitled Diagram');
  const [selectedElement, setSelectedElement] = useState<any | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [lastSavedState, setLastSavedState] = useState<string | null>(null);
  const [templateData, setTemplateData] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<"diagram" | "style" | "outline">("diagram");
  const [showGrid, setShowGrid] = useState(true);
  const [showPage, setShowPage] = useState(true);
  
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
  
  // Apply template to canvas when canvas and template data are available
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
    
    // Cast the object to our interface that properly defines the clone method
    const objectWithClone = activeObject as unknown as FabricObjectWithClone;
    
    // Now we can call clone with a callback
    objectWithClone.clone((clonedObj: FabricObject) => {
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
      // Import util from fabric to use enlivenObjects
      util.enlivenObjects([JSON.parse(clipboard)]).then((objects: FabricObject[]) => {
        objects.forEach(obj => {
          obj.set({
            left: obj.left! + 20,
            top: obj.top! + 20,
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
      
      const diagramId = id === 'new' ? `diagram-${Date.now()}` : id;
      
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
  
  const toggleRightSidebar = () => {
    setRightSidebarOpen(!rightSidebarOpen);
  };
  
  const toggleGrid = () => {
    setShowGrid(!showGrid);
    // Logic to show/hide grid would go here using canvas
  };
  
  const togglePage = () => {
    setShowPage(!showPage);
    // Logic to show/hide page would go here using canvas
  };
  
  return (
    <div className="diagram-editor-container">
      <header className="border-b border-border/40 p-2 flex items-center justify-between relative z-10 bg-white">
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
            <PanelLeft className="h-4 w-4 mr-1" />
            {sidebarOpen ? 'Hide' : 'Show'} Sidebar
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
      
      <div className="flex flex-1 h-[calc(100vh-48px)] relative">
        {sidebarOpen && (
          <DiagramSidebar 
            canvas={canvas} 
            selectedElement={selectedElement} 
            setSelectedElement={setSelectedElement}
          />
        )}
        
        <div className="flex-1 flex flex-col relative h-full">
          <DiagramToolbar canvas={canvas} />
          <div className="flex-1 relative">
            <DiagramCanvas 
              setCanvas={setCanvas} 
              diagramId={id} 
              setSelectedElement={setSelectedElement}
            />
          </div>
        </div>
        
        {rightSidebarOpen && (
          <div className="w-64 border-l border-border/40 flex flex-col bg-white">
            <Tabs defaultValue="diagram" value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="w-full rounded-none border-b">
                <TabsTrigger value="diagram" className="flex-1">Diagram</TabsTrigger>
                <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
                <TabsTrigger value="outline" className="flex-1">Outline</TabsTrigger>
              </TabsList>
              
              <TabsContent value="diagram" className="p-4 space-y-4">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">View</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="grid" 
                        className="checkbox" 
                        checked={showGrid}
                        onChange={toggleGrid}
                      />
                      <label htmlFor="grid" className="text-sm">Grid</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="page-view" 
                        className="checkbox" 
                        checked={showPage}
                        onChange={togglePage}
                      />
                      <label htmlFor="page-view" className="text-sm">Page View</label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Background</h3>
                  <Button variant="outline" size="sm" className="w-full">Change...</Button>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="background-color" className="checkbox" />
                    <label htmlFor="background-color" className="text-sm">Background Color</label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Options</h3>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="connection-arrows" className="checkbox" defaultChecked />
                      <label htmlFor="connection-arrows" className="text-sm">Connection Arrows</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="connection-points" className="checkbox" defaultChecked />
                      <label htmlFor="connection-points" className="text-sm">Connection Points</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="guides" className="checkbox" defaultChecked />
                      <label htmlFor="guides" className="text-sm">Guides</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="autosave" className="checkbox" defaultChecked />
                      <label htmlFor="autosave" className="text-sm">Autosave</label>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Paper Size</h3>
                  <select className="w-full p-2 bg-background border rounded">
                    <option>US-Letter (8.5" x 11")</option>
                    <option>A4 (210mm x 297mm)</option>
                    <option>A3 (297mm x 420mm)</option>
                  </select>
                  
                  <div className="flex gap-2 mt-2">
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="portrait" name="orientation" className="radio" defaultChecked />
                      <label htmlFor="portrait" className="text-sm">Portrait</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="radio" id="landscape" name="orientation" className="radio" />
                      <label htmlFor="landscape" className="text-sm">Landscape</label>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 space-y-2">
                  <Button variant="outline" size="sm" className="w-full">Edit Data...</Button>
                  <Button variant="outline" size="sm" className="w-full">Clear Default Style</Button>
                </div>
              </TabsContent>
              
              <TabsContent value="style" className="p-4">
                {/* Style options would go here */}
                <p className="text-muted-foreground text-sm">Select an element to view style options</p>
              </TabsContent>
              
              <TabsContent value="outline" className="p-4">
                {/* Outline/layers view would go here */}
                <p className="text-muted-foreground text-sm">Layer structure will appear here</p>
              </TabsContent>
            </Tabs>
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
