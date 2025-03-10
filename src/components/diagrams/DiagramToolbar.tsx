
import React, { useState } from 'react';
import { Canvas, Rect, Circle as FabricCircle, Triangle as FabricTriangle, Path, IText, Group, Line } from 'fabric';
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
  Key,
  Cloud,
  Cylinder,
  Laptop,
  Monitor,
  Smartphone,
  HardDrive,
  Wifi,
  Cable,
  Settings,
  BookOpen,
  FileText,
  Table,
  BoxSelect,
  Eraser,
  Diamond
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  | 'diamond'
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
  | 'key'
  | 'cloud'
  | 'cylinder'
  | 'laptop'
  | 'monitor'
  | 'smartphone'
  | 'harddrive'
  | 'wifi'
  | 'cable'
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
  const [activeCategory, setActiveCategory] = useState('basic');

  const handleToolSelect = (tool: Tool) => {
    if (!canvas) return;
    
    setActiveTool(tool);
    canvas.isDrawingMode = tool === 'draw';
    
    if (tool === 'draw') {
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = drawingWidth;
        canvas.freeDrawingBrush.color = drawingColor;
      }
    } else if (tool === 'eraser') {
      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.width = drawingWidth * 2;
        canvas.freeDrawingBrush.color = '#ffffff';
      }
      canvas.isDrawingMode = true;
    } else if (tool === 'lineConnect' || tool === 'bezierConnect') {
      // Store the connection starting object
      canvas.on('mouse:down', (options) => {
        if (options.target) {
          canvas.data = { ...canvas.data, connectionStart: options.target };
        }
      });
      
      // Create connection on mouse up
      canvas.on('mouse:up', (options) => {
        if (options.target && canvas.data?.connectionStart && options.target !== canvas.data.connectionStart) {
          createConnection(canvas.data.connectionStart, options.target, tool === 'bezierConnect' ? 'curved' : connectionStyle);
          canvas.data = { ...canvas.data, connectionStart: null };
        }
      });
    } else {
      canvas.selection = tool === 'select';
      // Remove any connection event handlers
      canvas.off('mouse:down');
      canvas.off('mouse:up');
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
  
  const handleFillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFill(e.target.value);
  };

  // Create a connection between two objects
  const createConnection = (fromObj: any, toObj: any, style: ConnectionStyle = 'straight') => {
    if (!canvas) return;
    
    const fromCenter = fromObj.getCenterPoint();
    const toCenter = toObj.getCenterPoint();
    
    let path;
    
    switch (style) {
      case 'straight':
        // Create a straight line with arrow
        path = new Path(`M ${fromCenter.x} ${fromCenter.y} L ${toCenter.x} ${toCenter.y}`, {
          stroke: drawingColor,
          strokeWidth: 2,
          fill: 'transparent',
          selectable: true
        });
        
        // Add arrow head
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
        // Create a Bezier curve
        const midX = (fromCenter.x + toCenter.x) / 2;
        const midY = (fromCenter.y + toCenter.y) / 2;
        const offset = 50;
        
        // Create control point offset from the midpoint
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
        // Create an orthogonal (right-angled) connection
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
      case 'square':
        shape = new Rect({
          width: 100,
          height: 100,
          fill: fill,
          stroke: drawingColor,
          strokeWidth: 2,
          left: 100,
          top: 100
        });
        break;
        
      case 'circle':
        shape = new FabricCircle({
          radius: 50,
          fill: fill,
          stroke: drawingColor,
          strokeWidth: 2,
          left: 100,
          top: 100
        });
        break;
        
      case 'triangle':
        shape = new FabricTriangle({
          width: 100,
          height: 100,
          fill: fill,
          stroke: drawingColor,
          strokeWidth: 2,
          left: 100,
          top: 100
        });
        break;
        
      case 'diamond':
        shape = new Path('M 50 0 L 100 50 L 50 100 L 0 50 Z', {
          fill: fill,
          stroke: drawingColor,
          strokeWidth: 2,
          left: 100,
          top: 100
        });
        break;
        
      case 'database':
        // Create database shape using path
        shape = new Path('M 0 20 Q 0 0 50 0 Q 100 0 100 20 L 100 80 Q 100 100 50 100 Q 0 100 0 80 Z M 0 20 Q 0 40 50 40 Q 100 40 100 20 M 0 40 Q 0 60 50 60 Q 100 60 100 40 M 0 60 Q 0 80 50 80 Q 100 80 100 60', {
          fill: fill,
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
          fill: fill,
          stroke: drawingColor,
          strokeWidth: 2,
          left: 100,
          top: 100,
          rx: 5,
          ry: 5
        });
        
        // Add server detail lines
        const serverDetails = new Group([
          new Line([10, 30, 70, 30], {
            stroke: drawingColor,
            strokeWidth: 1
          }),
          new Line([10, 50, 70, 50], {
            stroke: drawingColor,
            strokeWidth: 1
          }),
          new Line([10, 70, 70, 70], {
            stroke: drawingColor,
            strokeWidth: 1
          })
        ], {
          left: 100 + 5,
          top: 100 + 20
        });
        
        canvas.add(serverDetails);
        break;
        
      case 'cloud':
        // Simplified cloud shape
        shape = new Path('M 25,60 a 20,20 0 0,1 0,-40 a 30,30 0 0,1 50,0 a 20,20 0 0,1 0,40 z', {
          fill: fill,
          stroke: drawingColor,
          strokeWidth: 2,
          left: 100,
          top: 100,
          scaleX: 1.5,
          scaleY: 1.5
        });
        break;
        
      case 'cylinder':
        // Cylinder shape for storage
        shape = new Path('M 10,10 h 80 v 80 h -80 z M 10,10 a 40,10 0 0,0 80,0 a 40,10 0 0,0 -80,0 M 10,90 a 40,10 0 0,0 80,0', {
          fill: fill,
          stroke: drawingColor,
          strokeWidth: 2,
          left: 100,
          top: 100
        });
        break;
        
      case 'laptop':
        // Simplified laptop shape
        shape = new Group([
          // screen part
          new Rect({
            width: 100,
            height: 70,
            fill: fill,
            stroke: drawingColor,
            strokeWidth: 2
          }),
          // base part
          new Path('M 0,70 L 0,80 L 10,90 L 90,90 L 100,80 L 100,70', {
            fill: fill,
            stroke: drawingColor,
            strokeWidth: 2
          })
        ], {
          left: 100,
          top: 100
        });
        break;
        
      case 'monitor':
        // Monitor shape
        shape = new Group([
          // screen
          new Rect({
            width: 100,
            height: 80,
            fill: fill,
            stroke: drawingColor,
            strokeWidth: 2,
            rx: 2,
            ry: 2
          }),
          // stand
          new Path('M 40,80 L 40,90 L 60,90 L 60,80 M 30,90 L 70,90 L 70,95 L 30,95', {
            fill: fill,
            stroke: drawingColor,
            strokeWidth: 2
          })
        ], {
          left: 100,
          top: 100
        });
        break;
        
      case 'smartphone':
        // Smartphone shape
        shape = new Rect({
          width: 50,
          height: 90,
          fill: fill,
          stroke: drawingColor,
          strokeWidth: 2,
          rx: 5,
          ry: 5,
          left: 100,
          top: 100
        });
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
          fill: fill,
          stroke: drawingColor,
          strokeWidth: 2,
          left: 100,
          top: 100,
          rx: 2,
          ry: 2
        });
        
        // Add component ports
        const componentPorts = new Group([
          new Rect({
            width: 10,
            height: 20,
            fill: fill,
            stroke: drawingColor,
            strokeWidth: 2,
            left: -10,
            top: 20
          }),
          new Rect({
            width: 10,
            height: 20,
            fill: fill,
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
        
      case 'message':
        // Message bubble shape
        shape = new Path('M 0,0 h 100 v 70 h -30 l -20,20 l 0,-20 h -50 z', {
          fill: fill,
          stroke: drawingColor,
          strokeWidth: 2,
          left: 100,
          top: 100
        });
        break;
        
      case 'router':
        // Router shape
        shape = new Group([
          new Rect({
            width: 100,
            height: 30,
            fill: fill,
            stroke: drawingColor,
            strokeWidth: 2,
            rx: 2,
            ry: 2
          }),
          // Antenna 1
          new Path('M 20,0 L 20,-20', {
            stroke: drawingColor,
            strokeWidth: 2
          }),
          // Antenna 2
          new Path('M 80,0 L 80,-20', {
            stroke: drawingColor,
            strokeWidth: 2
          })
        ], {
          left: 100,
          top: 100
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
      case 'square':
      case 'circle':
      case 'triangle':
      case 'diamond':
      case 'database':
      case 'server':
      case 'cloud':
      case 'cylinder':
      case 'laptop':
      case 'monitor':
      case 'smartphone':
      case 'arrow':
      case 'component':
      case 'message':
      case 'router':
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
    <div className="border-b border-border/40 p-2 flex flex-col bg-background/80 backdrop-blur-sm">
      <div className="flex items-center gap-1 mb-2">
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
                pressed={activeTool === 'eraser'}
                onPressedChange={() => handleToolSelect('eraser')}
                aria-label="Eraser tool"
              >
                <Eraser className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Eraser (E)</p>
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
        
        <Separator orientation="vertical" className="h-8 mx-2" />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                pressed={activeTool === 'lineConnect'}
                onPressedChange={() => handleToolSelect('lineConnect')}
                aria-label="Connect tool"
              >
                <ArrowRight className="h-4 w-4" />
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
              >
                <GitBranch className="h-4 w-4" />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>
              <p>Curved Connection</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Separator orientation="vertical" className="h-8 mx-2" />
        
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="stroke-color" className="text-sm">Stroke:</label>
            <input 
              type="color" 
              id="stroke-color"
              value={drawingColor}
              onChange={handleColorChange}
              className="w-6 h-6 border-0"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <label htmlFor="fill-color" className="text-sm">Fill:</label>
            <input 
              type="color" 
              id="fill-color"
              value={fill === 'transparent' ? '#ffffff' : fill}
              onChange={handleFillChange}
              className="w-6 h-6 border-0"
            />
            <Toggle
              pressed={fill === 'transparent'}
              onPressedChange={() => setFill(fill === 'transparent' ? '#ffffff' : 'transparent')}
              aria-label="Toggle transparent fill"
              className="h-7 w-7"
            >
              <BoxSelect className="h-4 w-4" />
            </Toggle>
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
      
      <Tabs defaultValue="basic" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="grid grid-cols-5 w-96">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="flowchart">Flowchart</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="other">Other</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="mt-1 flex flex-wrap gap-1">
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('square')}
            aria-label="Square shape"
            className="h-8 w-8 p-0"
          >
            <Square className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('circle')}
            aria-label="Circle shape"
            className="h-8 w-8 p-0"
          >
            <CircleIcon className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('triangle')}
            aria-label="Triangle shape"
            className="h-8 w-8 p-0"
          >
            <TriangleIcon className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('diamond')}
            aria-label="Diamond shape"
            className="h-8 w-8 p-0"
          >
            <Diamond className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('arrow')}
            aria-label="Arrow"
            className="h-8 w-8 p-0"
          >
            <ArrowRight className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('text')}
            aria-label="Text"
            className="h-8 w-8 p-0"
          >
            <Type className="h-4 w-4" />
          </Toggle>
        </TabsContent>
        
        <TabsContent value="flowchart" className="mt-1 flex flex-wrap gap-1">
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('diamond')}
            aria-label="Decision"
            className="h-8 w-8 p-0"
          >
            <Diamond className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('database')}
            aria-label="Database"
            className="h-8 w-8 p-0"
          >
            <Database className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('component')}
            aria-label="Component"
            className="h-8 w-8 p-0"
          >
            <Component className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('message')}
            aria-label="Message"
            className="h-8 w-8 p-0"
          >
            <MessageSquare className="h-4 w-4" />
          </Toggle>
        </TabsContent>
        
        <TabsContent value="network" className="mt-1 flex flex-wrap gap-1">
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('cloud')}
            aria-label="Cloud"
            className="h-8 w-8 p-0"
          >
            <Cloud className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('server')}
            aria-label="Server"
            className="h-8 w-8 p-0"
          >
            <Server className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('router')}
            aria-label="Router"
            className="h-8 w-8 p-0"
          >
            <Router className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('wifi')}
            aria-label="WiFi"
            className="h-8 w-8 p-0"
          >
            <Wifi className="h-4 w-4" />
          </Toggle>
        </TabsContent>
        
        <TabsContent value="system" className="mt-1 flex flex-wrap gap-1">
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('laptop')}
            aria-label="Laptop"
            className="h-8 w-8 p-0"
          >
            <Laptop className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('monitor')}
            aria-label="Monitor"
            className="h-8 w-8 p-0"
          >
            <Monitor className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('smartphone')}
            aria-label="Smartphone"
            className="h-8 w-8 p-0"
          >
            <Smartphone className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('cylinder')}
            aria-label="Storage"
            className="h-8 w-8 p-0"
          >
            <Cylinder className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('harddrive')}
            aria-label="Hard Drive"
            className="h-8 w-8 p-0"
          >
            <HardDrive className="h-4 w-4" />
          </Toggle>
        </TabsContent>
        
        <TabsContent value="other" className="mt-1 flex flex-wrap gap-1">
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('lock')}
            aria-label="Lock"
            className="h-8 w-8 p-0"
          >
            <Lock className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('key')}
            aria-label="Key"
            className="h-8 w-8 p-0"
          >
            <Key className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('code')}
            aria-label="Code"
            className="h-8 w-8 p-0"
          >
            <Code className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('terminal')}
            aria-label="Terminal"
            className="h-8 w-8 p-0"
          >
            <Terminal className="h-4 w-4" />
          </Toggle>
          
          <Toggle
            pressed={false}
            onPressedChange={() => handleAddShape('settings')}
            aria-label="Settings"
            className="h-8 w-8 p-0"
          >
            <Settings className="h-4 w-4" />
          </Toggle>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiagramToolbar;
