import React, { useState, useEffect } from 'react';
import { Canvas, Rect, Circle as FabricCircle, Triangle as FabricTriangle, Path, IText, Group, Line, util as fabricUtil } from 'fabric';
import { 
  MousePointer, 
  Pencil, 
  Type, 
  ArrowRight,
  GitBranch,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Trash2,
  ZoomIn,
  ZoomOut,
  Copy,
  Scissors,
  Grid,
  FileOutput,
  Move,
  BoxSelect
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface DiagramToolbarProps {
  canvas: Canvas | null;
}

type Tool = 
  | 'select' 
  | 'draw' 
  | 'text' 
  | 'square' 
  | 'circle' 
  | 'triangle'
  | 'diamond'
  | 'arrow'
  | 'database'
  | 'server'
  | 'branch'
  | 'component'
  | 'message'
  | 'router'
  | 'code'
  | 'lineConnect'
  | 'bezierConnect'
  | 'eraser';

type ConnectionStyle = 'straight' | 'curved' | 'orthogonal';

const DiagramToolbar: React.FC<DiagramToolbarProps> = ({ canvas }) => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [drawingWidth, setDrawingWidth] = useState(2);
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [fill, setFill] = useState('transparent');
  const [connectionStyle, setConnectionStyle] = useState<ConnectionStyle>('straight');
  const [zoomPercent, setZoomPercent] = useState(100);
  
  const { undo: handleHistoryUndo, redo: handleHistoryRedo } = useCanvasHistory(canvas);
  
  useEffect(() => {
    if (!canvas) return;
    
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = drawingWidth;
      canvas.freeDrawingBrush.color = drawingColor;
      console.log("Updated brush:", canvas.freeDrawingBrush);
    } else {
      console.error("Free drawing brush not available in effect");
    }
    
    canvas.isDrawingMode = activeTool === 'draw' || activeTool === 'eraser';
    console.log("Drawing mode:", canvas.isDrawingMode, "Active tool:", activeTool);
  }, [canvas, drawingWidth, drawingColor, activeTool]);

  const handleToolSelect = (tool: Tool) => {
    if (!canvas) return;
    
    console.log("Selecting tool:", tool);
    setActiveTool(tool);
    
    if (tool === 'draw') {
      if (!canvas.freeDrawingBrush) {
        console.error("Free drawing brush not available in handleToolSelect");
      } else {
        canvas.freeDrawingBrush.width = drawingWidth;
        canvas.freeDrawingBrush.color = drawingColor;
      }
      canvas.isDrawingMode = true;
      console.log("Set drawing mode to:", canvas.isDrawingMode);
    } else if (tool === 'eraser') {
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = drawingWidth * 2;
        canvas.freeDrawingBrush.color = '#ffffff';
      }
      canvas.isDrawingMode = true;
    } else {
      canvas.isDrawingMode = false;
      canvas.selection = tool === 'select';
    }
    
    canvas.off('mouse:down');
    canvas.off('mouse:up');
    
    if (tool === 'lineConnect' || tool === 'bezierConnect') {
      canvas.on('mouse:down', (options) => {
        if (options.target) {
          canvas.customData = { ...canvas.customData, connectionStart: options.target };
        }
      });
      
      canvas.on('mouse:up', (options) => {
        if (options.target && canvas.customData?.connectionStart && options.target !== canvas.customData.connectionStart) {
          createConnection(canvas.customData.connectionStart, options.target, tool === 'bezierConnect' ? 'curved' : connectionStyle);
          canvas.customData = { ...canvas.customData, connectionStart: null };
        }
      });
    }
    
    canvas.discardActiveObject();
    canvas.renderAll();
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setDrawingColor(color);
    
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }
  };
  
  const handleFillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFill(e.target.value);
  };

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const width = parseInt(e.target.value);
    setDrawingWidth(width);
    
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.width = width;
    }
  };

  const createConnection = (fromObj: any, toObj: any, style: ConnectionStyle = 'straight') => {
    if (!canvas) return;
    
    const fromCenter = fromObj.getCenterPoint();
    const toCenter = toObj.getCenterPoint();
    
    let path;
    
    switch (style) {
      case 'straight':
        path = new Path(`M ${fromCenter.x} ${fromCenter.y} L ${toCenter.x} ${toCenter.y}`, {
          stroke: drawingColor,
          strokeWidth: 2,
          fill: 'transparent',
          selectable: true
        });
        
        const dx = toCenter.x - fromCenter.x;
        const dy = toCenter.y - fromCenter.y;
        const angle = Math.atan2(dy, dx);
        
        const headLength = 15;
        const headAngle = Math.PI / 6;
        
        const arrowHead = new Path(
          `M ${toCenter.x} ${toCenter.y} ` +
          `L ${toCenter.x - headLength * Math.cos(angle - headAngle)} ${toCenter.y - headLength * Math.sin(angle - headAngle)} ` +
          `L ${toCenter.x - headLength * Math.cos(angle + headAngle)} ${toCenter.y - headLength * Math.sin(angle + headAngle)} Z`,
          {
            fill: drawingColor,
            stroke: drawingColor,
            selectable: true
          }
        );
        
        canvas.add(path);
        canvas.add(arrowHead);
        break;
        
      case 'curved':
        const midX = (fromCenter.x + toCenter.x) / 2;
        const midY = (fromCenter.y + toCenter.y) / 2;
        const offset = 50;
        
        const ctrlX = midX + offset;
        const ctrlY = midY - offset;
        
        path = new Path(
          `M ${fromCenter.x} ${fromCenter.y} Q ${ctrlX} ${ctrlY}, ${toCenter.x} ${toCenter.y}`,
          {
            stroke: drawingColor,
            strokeWidth: 2,
            fill: 'transparent',
            selectable: true
          }
        );
        
        canvas.add(path);
        break;
        
      case 'orthogonal':
        const x1 = fromCenter.x;
        const y1 = fromCenter.y;
        const x2 = toCenter.x;
        const y2 = toCenter.y;
        
        path = new Path(
          `M ${x1} ${y1} H ${(x1 + x2) / 2} V ${y2} H ${x2}`,
          {
            stroke: drawingColor,
            strokeWidth: 2,
            fill: 'transparent',
            selectable: true
          }
        );
        
        canvas.add(path);
        break;
    }
    
    canvas.renderAll();
  };

  const addShape = (shapeType: string) => {
    if (!canvas) return;
    
    let shape: any;
    
    switch (shapeType) {
      case 'text':
        shape = new IText('Text', {
          left: 100,
          top: 100,
          fontFamily: 'Arial',
          fill: drawingColor,
          fontSize: 20,
          editable: true
        });
        break;
        
      default:
        toast.error("Unknown shape type");
        return;
    }
    
    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
    setActiveTool('select');
  };

  const handleAddShape = (shapeType: Tool) => {
    handleToolSelect('select');
    
    switch (shapeType) {
      case 'text':
        addShape('text');
        break;
        
      default:
        toast.error("This shape type is not implemented yet");
        break;
    }
  };

  const handleZoom = (direction: 'in' | 'out' | 'reset') => {
    if (!canvas) return;
    
    let newZoom: number;
    
    if (direction === 'reset') {
      newZoom = 1;
    } else {
      const zoomFactor = direction === 'in' ? 1.1 : 0.9;
      newZoom = canvas.getZoom() * zoomFactor;
    }
    
    if (newZoom > 0.1 && newZoom < 10) {
      canvas.setZoom(newZoom);
      setZoomPercent(Math.round(newZoom * 100));
      canvas.renderAll();
    }
  };
  
  const handleUndo = () => {
    if (!canvas) return;
    try {
      handleHistoryUndo();
      toast.info("Undo successful");
    } catch (error) {
      toast.info("Nothing to undo");
    }
  };
  
  const handleRedo = () => {
    if (!canvas) return;
    try {
      handleHistoryRedo();
      toast.info("Redo successful");
    } catch (error) {
      toast.info("Nothing to redo");
    }
  };
  
  const handleDelete = () => {
    if (!canvas) return;
    
    const activeObject = canvas.getActiveObject();
    if (activeObject) {
      canvas.remove(activeObject);
      canvas.renderAll();
    }
  };
  
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
      fabricUtil.enlivenObjects([JSON.parse(clipboard)]).then((objects: any[]) => {
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

  return (
    <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="flex items-center px-4 py-2">
        <div className="flex items-center gap-1 mr-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => handleZoom('out')}>
                  <ZoomOut className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom Out</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <div className="min-w-[48px] text-sm text-center">{zoomPercent}%</div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={() => handleZoom('in')}>
                  <ZoomIn className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Zoom In</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Separator orientation="vertical" className="h-8 mx-2" />
        
        <div className="flex items-center gap-1 mr-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handleUndo}>
                  <UndoIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Undo (Ctrl+Z)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handleRedo}>
                  <RedoIcon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Redo (Ctrl+Y)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Separator orientation="vertical" className="h-8 mx-2" />
        
        <div className="flex items-center gap-1 mr-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handleDelete}>
                  <Trash2 className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Delete (Del)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handleCopy}>
                  <Copy className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy (Ctrl+C)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10" onClick={handleCut}>
                  <Scissors className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Cut (Ctrl+X)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Separator orientation="vertical" className="h-8 mx-2" />
        
        <div className="flex items-center gap-1 mr-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={activeTool === 'select'}
                  onPressedChange={() => handleToolSelect('select')}
                  aria-label="Select tool"
                  className="h-10 w-10 data-[state=on]:bg-accent"
                >
                  <MousePointer className="h-5 w-5" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Select (V)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={activeTool === 'draw'}
                  onPressedChange={() => handleToolSelect('draw')}
                  aria-label="Draw tool"
                  className="h-10 w-10 data-[state=on]:bg-accent"
                >
                  <Pencil className="h-5 w-5" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Pencil (P)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={activeTool === 'text'}
                  onPressedChange={() => handleAddShape('text')}
                  aria-label="Text tool"
                  className="h-10 w-10 data-[state=on]:bg-accent"
                >
                  <Type className="h-5 w-5" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Text (T)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <Separator orientation="vertical" className="h-8 mx-2" />
        
        <div className="flex items-center gap-1 mr-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={activeTool === 'lineConnect'}
                  onPressedChange={() => handleToolSelect('lineConnect')}
                  aria-label="Connect tool"
                  className="h-10 w-10 data-[state=on]:bg-accent"
                >
                  <ArrowRight className="h-5 w-5" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Connect Objects</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Toggle
                  pressed={activeTool === 'bezierConnect'}
                  onPressedChange={() => handleToolSelect('bezierConnect')}
                  aria-label="Bezier Connect tool"
                  className="h-10 w-10 data-[state=on]:bg-accent"
                >
                  <GitBranch className="h-5 w-5" />
                </Toggle>
              </TooltipTrigger>
              <TooltipContent>
                <p>Curved Connection</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-1">
            <label htmlFor="stroke-width" className="text-xs whitespace-nowrap">Width:</label>
            <input 
              type="range" 
              id="stroke-width"
              min="1"
              max="20"
              value={drawingWidth}
              onChange={handleWidthChange}
              className="w-20 h-6"
              aria-label="Stroke width"
            />
            <span className="text-xs">{drawingWidth}px</span>
          </div>
          
          <div className="flex items-center gap-1">
            <label htmlFor="stroke-color" className="text-xs whitespace-nowrap">Stroke:</label>
            <input 
              type="color" 
              id="stroke-color"
              value={drawingColor}
              onChange={handleColorChange}
              className="w-6 h-6 border-0"
              aria-label="Stroke color"
            />
          </div>
          
          <div className="flex items-center gap-1">
            <label htmlFor="fill-color" className="text-xs whitespace-nowrap">Fill:</label>
            <input 
              type="color" 
              id="fill-color"
              value={fill === 'transparent' ? '#ffffff' : fill}
              onChange={handleFillChange}
              className="w-6 h-6 border-0"
              aria-label="Fill color"
            />
            <Toggle
              pressed={fill === 'transparent'}
              onPressedChange={() => setFill(fill === 'transparent' ? '#ffffff' : 'transparent')}
              aria-label="Toggle transparent fill"
              className="h-6 w-6"
            >
              <BoxSelect className="h-3 w-3" />
            </Toggle>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagramToolbar;
