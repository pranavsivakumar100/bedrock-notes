import React, { useState } from 'react';
import { Canvas, Object as FabricObject, Group, Line, IText, Rect, Circle, Triangle, Ellipse, Path, Polygon, XY } from 'fabric';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Palette,
  Settings,
  Layers,
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronRight,
  Search,
  Plus,
  ZoomIn,
  ZoomOut,
  Eye,
  Grid,
  Ruler,
  FileText,
  BadgeCheck,
  EyeOff,
  Square as SquareIcon,
  ArrowRight as ArrowRightIcon,
  Circle as CircleIcon,
  Triangle as TriangleIcon,
  Type,
  Hexagon,
  Pentagon,
  Diamond
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

interface DiagramSidebarProps {
  canvas: Canvas | null;
  selectedElement: FabricObject | null;
  setSelectedElement: (element: FabricObject | null) => void;
}

const DiagramSidebar: React.FC<DiagramSidebarProps> = ({ 
  canvas, 
  selectedElement,
  setSelectedElement 
}) => {
  const [opacity, setOpacity] = useState(100);
  const [activeTab, setActiveTab] = useState("properties");
  const [searchTerm, setSearchTerm] = useState("");
  const [showGrid, setShowGrid] = useState(true);
  const [showPageView, setShowPageView] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [paperSize, setPaperSize] = useState("letter");
  const [orientation, setOrientation] = useState("portrait");
  const [scale, setScale] = useState(100);
  
  const handleDelete = () => {
    if (!canvas || !selectedElement) return;
    
    canvas.remove(selectedElement);
    setSelectedElement(null);
    canvas.renderAll();
  };
  
  const handleDuplicate = () => {
    if (!canvas || !selectedElement) return;
    
    const clonedObj = selectedElement.toObject();
    
    let newObj: FabricObject | null = null;
    
    const options = {
      ...clonedObj,
      left: (selectedElement.left || 0) + 20,
      top: (selectedElement.top || 0) + 20,
      evented: true,
    };
    
    if (selectedElement.type === 'rect') {
      newObj = new Rect(options);
    } else if (selectedElement.type === 'circle') {
      newObj = new (selectedElement.constructor as any)(options);
    } else if (selectedElement.type === 'triangle') {
      newObj = new (selectedElement.constructor as any)(options);
    } else if (selectedElement.type === 'i-text') {
      newObj = new IText((selectedElement as IText).text || '', options);
    } else if (selectedElement.type === 'path') {
      newObj = new (selectedElement.constructor as any)(options);
    } else if (selectedElement.type === 'group') {
      console.warn('Group cloning not fully implemented');
      return;
    } else {
      try {
        newObj = new (selectedElement.constructor as any)(options);
      } catch (error) {
        console.error('Failed to clone object:', error);
        return;
      }
    }
    
    if (newObj) {
      canvas.add(newObj);
      canvas.setActiveObject(newObj);
      canvas.renderAll();
      setSelectedElement(newObj);
    }
  };
  
  const handleBringForward = () => {
    if (!canvas || !selectedElement) return;
    
    const objects = canvas.getObjects();
    const index = objects.indexOf(selectedElement);
    
    if (index < objects.length - 1) {
      objects.splice(index, 1);
      objects.splice(index + 1, 0, selectedElement);
      
      canvas.renderAll();
    }
  };
  
  const handleSendBackward = () => {
    if (!canvas || !selectedElement) return;
    
    const objects = canvas.getObjects();
    const index = objects.indexOf(selectedElement);
    
    if (index > 0) {
      objects.splice(index, 1);
      objects.splice(index - 1, 0, selectedElement);
      
      canvas.renderAll();
    }
  };
  
  const handleAlign = (alignment: string) => {
    if (!canvas || !selectedElement) return;
    
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();
    const objWidth = selectedElement.getScaledWidth();
    const objHeight = selectedElement.getScaledHeight();
    
    switch (alignment) {
      case 'left':
        selectedElement.set({ left: 0 });
        break;
      case 'center':
        selectedElement.set({ left: (canvasWidth - objWidth) / 2 });
        break;
      case 'right':
        selectedElement.set({ left: canvasWidth - objWidth });
        break;
      case 'top':
        selectedElement.set({ top: 0 });
        break;
      case 'middle':
        selectedElement.set({ top: (canvasHeight - objHeight) / 2 });
        break;
      case 'bottom':
        selectedElement.set({ top: canvasHeight - objHeight });
        break;
    }
    
    canvas.renderAll();
  };
  
  const handleOpacityChange = (value: number[]) => {
    if (!canvas || !selectedElement) return;
    
    const opacityValue = value[0];
    setOpacity(opacityValue);
    
    selectedElement.set({ opacity: opacityValue / 100 });
    canvas.renderAll();
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !selectedElement) return;
    
    const color = e.target.value;
    
    if (selectedElement.type === 'i-text') {
      selectedElement.set({ fill: color });
    } else {
      selectedElement.set({ stroke: color });
    }
    
    canvas.renderAll();
  };
  
  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !selectedElement) return;
    
    const width = parseInt(e.target.value);
    selectedElement.set({ strokeWidth: width });
    canvas.renderAll();
  };
  
  const handlePositionChange = (axis: 'x' | 'y', value: string) => {
    if (!canvas || !selectedElement) return;
    
    const numValue = parseInt(value);
    
    if (isNaN(numValue)) return;
    
    if (axis === 'x') {
      selectedElement.set({ left: numValue });
    } else {
      selectedElement.set({ top: numValue });
    }
    
    canvas.renderAll();
  };
  
  const handleSizeChange = (dimension: 'width' | 'height', value: string) => {
    if (!canvas || !selectedElement) return;
    
    const numValue = parseInt(value);
    
    if (isNaN(numValue)) return;
    
    if (dimension === 'width') {
      selectedElement.set({ scaleX: numValue / (selectedElement as any).width });
    } else {
      selectedElement.set({ scaleY: numValue / (selectedElement as any).height });
    }
    
    canvas.renderAll();
  };
  
  const getObjectDimensions = () => {
    if (!selectedElement) return { width: 0, height: 0 };
    
    return {
      width: Math.round(selectedElement.getScaledWidth()),
      height: Math.round(selectedElement.getScaledHeight())
    };
  };
  
  const getObjectPosition = () => {
    if (!selectedElement) return { x: 0, y: 0 };
    
    return {
      x: Math.round(selectedElement.left || 0),
      y: Math.round(selectedElement.top || 0)
    };
  };
  
  const handleZoom = (direction: 'in' | 'out') => {
    if (!canvas) return;
    
    const zoomFactor = direction === 'in' ? 1.1 : 0.9;
    const zoom = canvas.getZoom() * zoomFactor;
    
    if (zoom > 0.1 && zoom < 10) {
      canvas.setZoom(zoom);
      setScale(Math.round(zoom * 100));
      canvas.renderAll();
    }
  };
  
  const handleGridToggle = (checked: boolean) => {
    setShowGrid(checked);
    
    if (canvas) {
      const gridObjects = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
      
      gridObjects.forEach(obj => {
        obj.set({ opacity: checked ? 1 : 0 });
      });
      
      canvas.renderAll();
    }
  };
  
  const handleBackgroundColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setBackgroundColor(color);
    
    if (canvas) {
      canvas.backgroundColor = color;
      canvas.renderAll();
    }
  };
  
  const dimensions = getObjectDimensions();
  const position = getObjectPosition();
  
  const handleAddShape = (shapeType: string) => {
    if (!canvas) {
      toast.error("Canvas not initialized");
      return;
    }
    
    let shape: FabricObject | null = null;
    const centerX = canvas.getWidth() / 2;
    const centerY = canvas.getHeight() / 2;
    
    switch (shapeType) {
      case 'rectangle':
        shape = new Rect({
          left: centerX - 50,
          top: centerY - 50,
          width: 100,
          height: 100,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'square':
        shape = new Rect({
          left: centerX - 50,
          top: centerY - 50,
          width: 100,
          height: 100,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'round-rectangle':
        shape = new Rect({
          left: centerX - 50,
          top: centerY - 50,
          width: 100,
          height: 70,
          rx: 10,
          ry: 10,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'text-box':
        shape = new Rect({
          left: centerX - 60,
          top: centerY - 30,
          width: 120,
          height: 60,
          rx: 0,
          ry: 0,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        const text = new IText('Text', {
          left: centerX,
          top: centerY,
          originX: 'center',
          originY: 'center',
          fill: '#333333',
          fontSize: 16,
          fontFamily: 'Arial',
          objectCaching: false,
        });
        
        canvas.add(shape);
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
        setSelectedElement(text);
        toast.success(`Added text box`);
        return;
        
      case 'circle':
        shape = new Circle({
          left: centerX - 50,
          top: centerY - 50,
          radius: 50,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'ellipse':
        shape = new Ellipse({
          left: centerX - 60,
          top: centerY - 40,
          rx: 60,
          ry: 40,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'triangle':
        shape = new Triangle({
          left: centerX - 50,
          top: centerY - 50,
          width: 100,
          height: 100,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'right-triangle':
        shape = new Polygon({
          left: centerX - 50,
          top: centerY - 50,
          points: [
            { x: 0, y: 0 },
            { x: 100, y: 100 },
            { x: 0, y: 100 }
          ],
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'diamond':
        shape = new Polygon({
          left: centerX - 50,
          top: centerY - 50,
          points: [
            { x: 50, y: 0 },
            { x: 100, y: 50 },
            { x: 50, y: 100 },
            { x: 0, y: 50 }
          ],
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'pentagon':
        shape = new Polygon({
          left: centerX - 50,
          top: centerY - 50,
          points: [
            { x: 50, y: 0 },
            { x: 100, y: 40 },
            { x: 80, y: 100 },
            { x: 20, y: 100 },
            { x: 0, y: 40 }
          ],
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'hexagon':
        shape = new Polygon({
          left: centerX - 50,
          top: centerY - 50,
          points: [
            { x: 25, y: 0 },
            { x: 75, y: 0 },
            { x: 100, y: 50 },
            { x: 75, y: 100 },
            { x: 25, y: 100 },
            { x: 0, y: 50 }
          ],
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'octagon':
        shape = new Polygon({
          left: centerX - 50,
          top: centerY - 50,
          points: [
            { x: 30, y: 0 },
            { x: 70, y: 0 },
            { x: 100, y: 30 },
            { x: 100, y: 70 },
            { x: 70, y: 100 },
            { x: 30, y: 100 },
            { x: 0, y: 70 },
            { x: 0, y: 30 }
          ],
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'trapezoid':
        shape = new Polygon({
          left: centerX - 50,
          top: centerY - 50,
          points: [
            { x: 20, y: 0 },
            { x: 80, y: 0 },
            { x: 100, y: 100 },
            { x: 0, y: 100 }
          ],
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'parallelogram':
        shape = new Polygon({
          left: centerX - 50,
          top: centerY - 50,
          points: [
            { x: 25, y: 0 },
            { x: 100, y: 0 },
            { x: 75, y: 100 },
            { x: 0, y: 100 }
          ],
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'cylinder':
        // Create group with rect and two ellipses
        const cylinderRect = new Rect({
          left: 0,
          top: 15,
          width: 80,
          height: 70,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
        });
        
        const topEllipse = new Ellipse({
          left: 0,
          top: 0,
          rx: 40,
          ry: 15,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
        });
        
        const bottomEllipse = new Ellipse({
          left: 0,
          top: 70,
          rx: 40,
          ry: 15,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
        });
        
        const cylinderGroup = new Group([cylinderRect, topEllipse, bottomEllipse], {
          left: centerX - 40,
          top: centerY - 50,
          objectCaching: false,
        });
        
        shape = cylinderGroup;
        break;
        
      case 'document':
        // Shape with folded corner
        const points = [
          { x: 0, y: 0 },
          { x: 80, y: 0 },
          { x: 100, y: 20 },
          { x: 100, y: 100 },
          { x: 0, y: 100 }
        ];
        
        const documentShape = new Polygon({
          points: points,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
        });
        
        // Fix Line constructor to use the correct number of points (4 total points, not 8)
        const foldLine = new Line([
          80, 0, 
          100, 20
        ], {
          stroke: '#333333',
          strokeWidth: 1,
          fill: '',
        });
        
        const documentGroup = new Group([documentShape, foldLine], {
          left: centerX - 50,
          top: centerY - 50,
          objectCaching: false,
        });
        
        shape = documentGroup;
        break;
        
      case 'cloud':
        // Create a cloud shape using path data with proper SVG path format
        shape = new Path({
          path: 'M25,60 C10,60 10,45 25,35 C10,35 10,10 40,10 C80,10 80,35 95,35 C95,50 95,60 80,60 Z',
          left: centerX - 50,
          top: centerY - 35,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'speech-bubble':
        // Create speech bubble using proper SVG path format
        shape = new Path({
          path: 'M10,0 C0,0 0,10 0,10 L0,70 C0,80 10,80 10,80 L50,80 L60,100 L70,80 L90,80 C100,80 100,70 100,70 L100,10 C100,0 90,0 90,0 Z',
          left: centerX - 50,
          top: centerY - 50,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'note':
        // Create note using proper SVG path format
        shape = new Path({
          path: 'M0,0 L70,0 L70,70 L85,55 L85,100 L0,100 Z',
          left: centerX - 42.5,
          top: centerY - 50,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'person':
        // Create simple stick figure
        const head = new Circle({
          radius: 15,
          left: 0,
          top: 0,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
        });
        
        // Fix Line constructor to use proper format
        const body = new Line([
          15, 30, 
          15, 70
        ], {
          stroke: '#333333',
          strokeWidth: 2,
        });
        
        const leftArm = new Line([
          15, 40, 
          0, 55
        ], {
          stroke: '#333333',
          strokeWidth: 2,
        });
        
        const rightArm = new Line([
          15, 40, 
          30, 55
        ], {
          stroke: '#333333',
          strokeWidth: 2,
        });
        
        const leftLeg = new Line([
          15, 70, 
          0, 100
        ], {
          stroke: '#333333',
          strokeWidth: 2,
        });
        
        const rightLeg = new Line([
          15, 70, 
          30, 100
        ], {
          stroke: '#333333',
          strokeWidth: 2,
        });
        
        const personGroup = new Group([head, body, leftArm, rightArm, leftLeg, rightLeg], {
          left: centerX - 20,
          top: centerY - 50,
          objectCaching: false,
        });
        
        shape = personGroup;
        break;
        
      case 'arrow':
        // Fix Line constructor to use proper format
        const arrowLine = new Line([
          0, 0, 
          100, 0
        ], {
          stroke: '#333333',
          strokeWidth: 2,
          objectCaching: false,
        });
        
        (arrowLine as any).strokeLineCap = 'round';
        (arrowLine as any).strokeLineJoin = 'round';
        
        // Add arrowhead
        const arrowHead = new Triangle({
          width: 16,
          height: 16,
          left: 100,
          top: 0,
          angle: 90,
          fill: '#333333',
          originX: 'center',
          originY: 'center',
        });
        
        // Group arrow with arrowhead
        const arrowGroup = new Group([arrowLine, arrowHead], {
          left: centerX - 50,
          top: centerY,
          objectCaching: false,
        });
        
        shape = arrowGroup;
        break;
        
      case 'line':
        // Fix Line constructor to use proper format
        shape = new Line([
          0, 0, 
          100, 0
        ], {
          stroke: '#333333',
          strokeWidth: 2,
          left: centerX - 50,
          top: centerY,
          objectCaching: false,
        });
        break;
        
      case 'curved-line':
        // Create curved line using proper SVG path format
        shape = new Path({
          path: 'M0,0 Q50,-50 100,0',
          fill: '',
          stroke: '#333333',
          strokeWidth: 2,
          left: centerX - 50,
          top: centerY,
          objectCaching: false,
        });
        break;
        
      case 'text':
        shape = new IText('Text', {
          left: centerX - 50,
          top: centerY - 25,
          fill: '#333333',
          fontSize: 20,
          fontFamily: 'Arial',
          objectCaching: false,
        });
        break;
        
      default:
        toast.error("Unknown shape type");
        return;
    }
    
    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
      setSelectedElement(shape);
      
      toast.success(`Added ${shapeType}`);
    }
  };
  
  return (
    <div className="w-full h-full border-l border-border/40 flex flex-col bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 p-0 h-10">
          <TabsTrigger value="shapes" className="rounded-none">Shapes</TabsTrigger>
          <TabsTrigger value="properties" className="rounded-none">Properties</TabsTrigger>
          <TabsTrigger value="style" className="rounded-none">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="shapes" className="flex-1 overflow-hidden p-0 m-0">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search Shapes"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
          
          <ScrollArea className="flex-1 invisible-scrollbar">
            <Accordion type="multiple" defaultValue={["general", "basic"]}>
              <AccordionItem value="scratchpad">
                <AccordionTrigger className="px-2 py-1 text-sm">
                  Scratchpad
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-1">
                  <div className="grid grid-cols-3 gap-1 px-2">
                    {/* Scratchpad items would go here */}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="general">
                <AccordionTrigger className="px-2 py-1 text-sm">
                  General
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-1">
                  <div className="grid grid-cols-5 gap-1 px-2">
                    {/* First row */}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('rectangle')}
                    >
                      <div className="border border-foreground w-full h-full"></div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('round-rectangle')}
                    >
                      <div className="border border-foreground w-full h-full rounded-md"></div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('text')}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-xs">Text</span>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('text-box')}
                    >
                      <div className="border border-foreground w-full h-2/3 flex items-center justify-center">
                        <span className="text-[8px]">Text</span>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('ellipse')}
                    >
                      <div className="border border-foreground w-full h-full rounded-full"></div>
                    </Button>
                    
                    {/* Second row */}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('square')}
                    >
                      <div className="border border-foreground w-full h-full"></div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('circle')}
                    >
                      <div className="border border-foreground w-full h-full rounded-full"></div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('triangle')}
                    >
                      <div className="border border-foreground w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent mx-auto my-auto"></div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('right-triangle')}
                    >
                      <div className="border-b border-r border-foreground w-full h-full"></div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('diamond')}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2/3 h-2/3 border border-foreground rotate-45"></div>
                      </div>
                    </Button>
                    
                    {/* Third row */}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('pentagon')}
                    >
                      <Pentagon className="w-6 h-6 text-foreground" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('hexagon')}
                    >
                      <Hexagon className="w-6 h-6 text-foreground" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('octagon')}
                    >
                      <div className="w-5 h-5 border border-foreground relative">
                        <div className="absolute -top-[3px] -left-[3px] -right-[3px] -bottom-[3px] overflow-hidden">
                          <div className="absolute top-0 left-0 w-[5px] h-[5px] bg-background"></div>
                          <div className="absolute top-0 right-0 w-[5px] h-[5px] bg-background"></div>
                          <div className="absolute bottom-0 left-0 w-[5px] h-[5px] bg-background"></div>
                          <div className="absolute bottom-0 right-0 w-[5px] h-[5px] bg-background"></div>
                        </div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('trapezoid')}
                    >
                      <div className="w-full h-1/2 border-t border-l border-r border-foreground" style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', width: '100%', height: '0', borderTop: '20px solid currentColor' }}></div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('parallelogram')}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-5/6 h-2/3 border border-foreground skew-x-12"></div>
                      </div>
                    </Button>
                    
                    {/* Fourth row */}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('cylinder')}
                    >
                      <div className="relative w-4/5 h-4/5">
                        <div className="w-full h-3/4 border-l border-r border-foreground mt-1"></div>
                        <div className="w-full h-[6px] border border-foreground rounded-full absolute top-1"></div>
                        <div className="w-full h-[6px] border border-foreground rounded-full absolute bottom-1"></div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('cloud')}
                    >
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-5 h-3 border border-foreground rounded-full relative">
                          <div className="absolute -top-1.5 -left-1 w-3 h-3 border border-foreground rounded-full"></div>
                          <div className="absolute -top-1 left-1.5 w-2.5 h-2.5 border border-foreground rounded-full"></div>
                          <div className="absolute -top-0.5 right-0 w-2 h-2 border border-foreground rounded-full"></div>
                        </div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('speech-bubble')}
                    >
                      <div className="relative w-4/5 h-3/5 border border-foreground rounded-md">
                        <div className="absolute -bottom-1.5 left-1/4 w-0 h-0 border-l-8 border-t-8 border-r-0 border-l-transparent border-t-foreground transform rotate-10"></div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('document')}
                    >
                      <div className="relative w-4/5 h-4/5 border border-foreground">
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-r-8 border-t-background border-r-background"></div>
                        <div className="absolute top-0 right-0 w-2 h-2 border-b border-l border-foreground transform rotate-45"></div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('note')}
                    >
                      <div className="relative w-4/5 h-4/5 border border-foreground">
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-background"></div>
                        <div className="absolute bottom-0 right-0 w-0 h-0 border-b-8 border-r-8 border-b-foreground border-r-foreground transform rotate-0"></div>
                      </div>
                    </Button>
                    
                    {/* Fifth row */}
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('person')}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 border border-foreground rounded-full"></div>
                        <div className="w-0.5 h-5 bg-foreground mt-0.5"></div>
                        <div className="flex w-4 justify-between mt-[-8px]">
                          <div className="w-0.5 h-2.5 bg-foreground rotate-45 origin-top"></div>
                          <div className="w-0.5 h-2.5 bg-foreground -rotate-45 origin-top"></div>
                        </div>
                        <div className="flex w-4 justify-between">
                          <div className="w-0.5 h-3 bg-foreground rotate-25 origin-top"></div>
                          <div className="w-0.5 h-3 bg-foreground -rotate-25 origin-top"></div>
                        </div>
                      </div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('arrow')}
                    >
                      <ArrowRightIcon className="w-6 h-6 text-foreground" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('line')}
                    >
                      <div className="w-full h-0.5 bg-foreground"></div>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center p-1"
                      onClick={() => handleAddShape('curved-line')}
                    >
                      <div className="w-4/5 h-4/5 flex items-center justify-center">
                        <div className="w-full h-3/5 border-t border-foreground rounded-t-full"></div>
                      </div>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="basic">
                <AccordionTrigger className="px-2 py-1 text-sm">
                  Basic
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-1">
                  <div className="grid grid-cols-5 gap-1 px-2">
                    {/* Add basic shapes here */}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="flowchart">
                <AccordionTrigger className="px-2 py-1 text-sm">
                  Flowchart
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-1">
                  <div className="grid grid-cols-5 gap-1 px-2">
                    {/* Add flowchart shapes here */}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="uml">
                <AccordionTrigger className="px-2 py-1 text-sm">
                  UML
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-1">
                  <div className="grid grid-cols-5 gap-1 px-2">
                    {/* Add UML shapes here */}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="wireframe">
                <AccordionTrigger className="px-2 py-1 text-sm">
                  Wireframe
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-1">
                  <div className="grid grid-cols-5 gap-1 px-2">
                    {/* Add wireframe shapes here */}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="properties" className="flex-1 overflow-hidden p-0 m-0">
          <ScrollArea className="h-full p-4">
            {selectedElement ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Position</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="position-x" className="text-xs">X</Label>
                      <Input
                        id="position-x"
                        type="number"
                        value={position.x}
                        onChange={(e) => handlePositionChange('x', e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="position-y" className="text-xs">Y</Label>
                      <Input
                        id="position-y"
                        type="number"
                        value={position.y}
                        onChange={(e) => handlePositionChange('y', e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Size</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="size-width" className="text-xs">Width</Label>
                      <Input
                        id="size-width"
                        type="number"
                        value={dimensions.width}
                        onChange={(e) => handleSizeChange('width', e.target.value)}
                        className="h-8"
                      />
                    </div>
                    <div>
                      <Label htmlFor="size-height" className="text-xs">Height</Label>
                      <Input
                        id="size-height"
                        type="number"
                        value={dimensions.height}
                        onChange={(e) => handleSizeChange('height', e.target.value)}
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleDelete}
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleDuplicate}
                      className="flex items-center gap-1"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      Duplicate
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleBringForward}
                      className="flex items-center gap-1"
                    >
                      Bring Forward
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={handleSendBackward}
                      className="flex items-center gap-1"
                    >
                      Send Backward
                    </Button>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Alignment</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => handleAlign('left')}
                    >
                      <AlignLeft className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => handleAlign('center')}
                    >
                      <AlignCenter className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => handleAlign('right')}
                    >
                      <AlignRight className="h-3.5 w-3.5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => handleAlign('top')}
                    >
                      <AlignLeft className="h-3.5 w-3.5 rotate-90" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => handleAlign('middle')}
                    >
                      <AlignCenter className="h-3.5 w-3.5 rotate-90" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={() => handleAlign('bottom')}
                    >
                      <AlignRight className="h-3.5 w-3.5 rotate-90" />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Settings className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-sm">Select an element to edit its properties</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="style" className="flex-1 overflow-hidden p-0 m-0">
          <ScrollArea className="h-full p-4">
            {selectedElement ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Fill & Stroke</h3>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor="color" className="text-xs">Color</Label>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 border rounded-md overflow-hidden">
                          <input
                            type="color"
                            id="color"
                            onChange={handleColorChange}
                            className="w-10 h-10 -ml-1 -mt-1 cursor-pointer"
                          />
                        </div>
                        <Input
                          value="#333333"
                          className="h-8 flex-1"
                          readOnly
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="stroke-width" className="text-xs">Stroke Width</Label>
                      <Input
                        id="stroke-width"
                        type="number"
                        min="0"
                        max="20"
                        defaultValue="1"
                        onChange={handleStrokeWidthChange}
                        className="h-8"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Opacity</h3>
                  <div className="space-y-2">
                    <Slider
                      value={[opacity]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={handleOpacityChange}
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>0%</span>
                      <span>{opacity}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
                
                {selectedElement.type === 'i-text' && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Text Options</h3>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="font-family" className="text-xs">Font Family</Label>
                        <Select defaultValue="Arial">
                          <SelectTrigger className="h-8">
                            <SelectValue placeholder="Select font" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Arial">Arial</SelectItem>
                            <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                            <SelectItem value="Courier New">Courier New</SelectItem>
                            <SelectItem value="Georgia">Georgia</SelectItem>
                            <SelectItem value="Verdana">Verdana</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="font-size" className="text-xs">Font Size</Label>
                        <Input
                          id="font-size"
                          type="number"
                          min="8"
                          max="72"
                          defaultValue="16"
                          className="h-8"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs">Text Alignment</Label>
                        <div className="flex border rounded-md mt-1 divide-x">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none flex-1">
                            <AlignLeft className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none flex-1">
                            <AlignCenter className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none flex-1">
                            <AlignRight className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none flex-1">
                            <AlignJustify className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <Palette className="h-12 w-12 mb-4 opacity-20" />
                <p className="text-sm">Select an element to edit its style</p>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiagramSidebar;
