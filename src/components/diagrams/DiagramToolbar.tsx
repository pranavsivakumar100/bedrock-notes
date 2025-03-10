
import React, { useState } from 'react';
import { Canvas, Rect, Circle, Triangle, Path, IText } from 'fabric';
import { 
  MousePointer, 
  Pencil, 
  Type, 
  Square, 
  Circle as CircleIcon, 
  Triangle as TriangleIcon,
  ArrowRight,
  Database,
  Server,
  GitBranch,
  Component,
  Lock,
  MessageSquare,
  Terminal,
  Router,
  Code,
  Key
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

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
  | 'arrow'
  | 'database'
  | 'server'
  | 'branch'
  | 'component'
  | 'message'
  | 'router'
  | 'terminal'
  | 'code'
  | 'lock'
  | 'key';

const DiagramToolbar: React.FC<DiagramToolbarProps> = ({ canvas }) => {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [drawingWidth, setDrawingWidth] = useState(2);
  const [drawingColor, setDrawingColor] = useState('#000000');

  const handleToolSelect = (tool: Tool) => {
    if (!canvas) return;
    
    setActiveTool(tool);
    canvas.isDrawingMode = tool === 'draw';
    
    if (tool === 'draw') {
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = drawingWidth;
        canvas.freeDrawingBrush.color = drawingColor;
      }
    } else {
      canvas.selection = tool === 'select';
    }
    
    // Deselect any selected objects when switching tools
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

  const addShape = (shapeType: string) => {
    if (!canvas) return;
    
    let shape: any;
    
    switch (shapeType) {
      case 'square':
        shape = new Rect({
          width: 100,
          height: 100,
          fill: 'transparent',
          stroke: drawingColor,
          strokeWidth: 2,
          left: 100,
          top: 100
        });
        break;
        
      case 'circle':
        shape = new Circle({
          radius: 50,
          fill: 'transparent',
          stroke: drawingColor,
          strokeWidth: 2,
          left: 100,
          top: 100
        });
        break;
        
      case 'triangle':
        shape = new Triangle({
          width: 100,
          height: 100,
          fill: 'transparent',
          stroke: drawingColor,
          strokeWidth: 2,
          left: 100,
          top: 100
        });
        break;
        
      case 'database':
        // Create database shape using path
        shape = new Path('M 0 20 Q 0 0 50 0 Q 100 0 100 20 L 100 80 Q 100 100 50 100 Q 0 100 0 80 Z M 0 20 Q 0 40 50 40 Q 100 40 100 20 M 0 40 Q 0 60 50 60 Q 100 60 100 40 M 0 60 Q 0 80 50 80 Q 100 80 100 60', {
          fill: 'transparent',
          stroke: drawingColor,
          strokeWidth: 2,
          left: 100,
          top: 100,
          scaleX: 0.8,
          scaleY: 0.8
        });
        break;
        
      case 'server':
        shape = new Rect({
          width: 80,
          height: 120,
          fill: 'transparent',
          stroke: drawingColor,
          strokeWidth: 2,
          left: 100,
          top: 100,
          rx: 5,
          ry: 5
        });
        
        // Add server detail lines
        const serverDetails = new fabric.Group([
          new fabric.Line([10, 30, 70, 30], {
            stroke: drawingColor,
            strokeWidth: 1
          }),
          new fabric.Line([10, 50, 70, 50], {
            stroke: drawingColor,
            strokeWidth: 1
          }),
          new fabric.Line([10, 70, 70, 70], {
            stroke: drawingColor,
            strokeWidth: 1
          })
        ], {
          left: 100 + 5,
          top: 100 + 20
        });
        
        canvas.add(serverDetails);
        break;
        
      case 'arrow':
        // Create arrow
        shape = new Path('M 0 10 L 180 10 L 170 0 L 180 10 L 170 20', {
          fill: 'transparent',
          stroke: drawingColor,
          strokeWidth: 2,
          left: 100,
          top: 100
        });
        break;
        
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
        
      case 'component':
        // Create component symbol
        shape = new Rect({
          width: 120,
          height: 80,
          fill: 'transparent',
          stroke: drawingColor,
          strokeWidth: 2,
          left: 100,
          top: 100,
          rx: 2,
          ry: 2
        });
        
        // Add component ports
        const componentPorts = new fabric.Group([
          new fabric.Rect({
            width: 10,
            height: 20,
            fill: 'transparent',
            stroke: drawingColor,
            strokeWidth: 2,
            left: -10,
            top: 20
          }),
          new fabric.Rect({
            width: 10,
            height: 20,
            fill: 'transparent',
            stroke: drawingColor,
            strokeWidth: 2,
            left: 120,
            top: 20
          })
        ], {
          left: 100,
          top: 100 + 10
        });
        
        canvas.add(componentPorts);
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
      case 'square':
      case 'circle':
      case 'triangle':
      case 'database':
      case 'server':
      case 'arrow':
      case 'component':
        addShape(shapeType);
        break;
        
      case 'text':
        addShape('text');
        break;
        
      default:
        toast.error("This shape type is not implemented yet");
        break;
    }
  };

  return (
    <div className="border-b border-border/40 p-2 flex items-center bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-1 mr-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={activeTool === 'select'}
                onPressedChange={() => handleToolSelect('select')}
                aria-label="Select tool"
              >
                <MousePointer className="h-4 w-4" />
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
              >
                <Pencil className="h-4 w-4" />
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
              >
                <Type className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Text (T)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Separator orientation="vertical" className="h-8 mx-2" />
      
      <div className="flex items-center gap-1 mr-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={false}
                onPressedChange={() => handleAddShape('square')}
                aria-label="Square shape"
              >
                <Square className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Square</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={false}
                onPressedChange={() => handleAddShape('circle')}
                aria-label="Circle shape"
              >
                <Circle className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Circle</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={false}
                onPressedChange={() => handleAddShape('triangle')}
                aria-label="Triangle shape"
              >
                <Triangle className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Triangle</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={false}
                onPressedChange={() => handleAddShape('arrow')}
                aria-label="Arrow"
              >
                <ArrowRight className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Arrow</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Separator orientation="vertical" className="h-8 mx-2" />
      
      <div className="flex items-center gap-1 mr-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={false}
                onPressedChange={() => handleAddShape('database')}
                aria-label="Database"
              >
                <Database className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Database</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={false}
                onPressedChange={() => handleAddShape('server')}
                aria-label="Server"
              >
                <Server className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Server</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={false}
                onPressedChange={() => handleAddShape('component')}
                aria-label="Component"
              >
                <Component className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Component</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={false}
                onPressedChange={() => handleAddShape('router')}
                aria-label="Router"
              >
                <Router className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Router</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      
      <Separator orientation="vertical" className="h-8 mx-2" />
      
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2">
          <label htmlFor="stroke-color" className="text-sm">Color:</label>
          <input 
            type="color" 
            id="stroke-color"
            value={drawingColor}
            onChange={handleColorChange}
            className="w-6 h-6 border-0"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <label htmlFor="stroke-width" className="text-sm">Width:</label>
          <input 
            type="range" 
            id="stroke-width"
            min="1"
            max="20"
            value={drawingWidth}
            onChange={(e) => {
              const width = parseInt(e.target.value);
              setDrawingWidth(width);
              if (canvas && canvas.freeDrawingBrush) {
                canvas.freeDrawingBrush.width = width;
              }
            }}
            className="w-24"
          />
        </div>
      </div>
    </div>
  );
};

export default DiagramToolbar;
