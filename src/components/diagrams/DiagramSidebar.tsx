import React, { useState } from 'react';
import { Canvas, Object as FabricObject, Group, Line, IText, Rect, Circle, Triangle, Ellipse, Path, Polygon } from 'fabric';
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
        
        // Fix: Use arrays of numbers instead of strings for Line constructor
        const foldLine = new Line([
          80, 0, 
          100, 20, 
          80, 20, 
          80, 0
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
        // Fix: Create cloud with Path object using points instead of SVG path string
        shape = new Path([
          { x: 25, y: 60 },
          { x: 10, y: 60, control: { x: 10, y: 50 } },
          { x: 25, y: 35, control: { x: 10, y: 35 } },
          { x: 50, y: 10, control: { x: 25, y: 10 } },
          { x: 80, y: 35, control: { x: 80, y: 10 } },
          { x: 95, y: 50, control: { x: 95, y: 35 } },
          { x: 80, y: 60, control: { x: 95, y: 60 } },
          { x: 25, y: 60 }
        ], {
          left: centerX - 50,
          top: centerY - 35,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'speech-bubble':
        // Fix: Create speech bubble with Path object using points instead of SVG path string
        shape = new Path([
          { x: 10, y: 0 },
          { x: 0, y: 10, control: { x: 0, y: 0 } },
          { x: 0, y: 70 },
          { x: 10, y: 80, control: { x: 0, y: 80 } },
          { x: 50, y: 80 },
          { x: 60, y: 100 },
          { x: 70, y: 80 },
          { x: 90, y: 80 },
          { x: 100, y: 70, control: { x: 100, y: 80 } },
          { x: 100, y: 10 },
          { x: 90, y: 0, control: { x: 100, y: 0 } },
          { x: 10, y: 0 }
        ], {
          left: centerX - 50,
          top: centerY - 50,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        break;
        
      case 'note':
        // Fix: Create note with Path object using points instead of SVG path string
        shape = new Path([
          { x: 0, y: 0 },
          { x: 70, y: 0 },
          { x: 70, y: 70 },
          { x: 85, y: 55 },
          { x: 85, y: 100 },
          { x: 0, y: 100 },
          { x: 0, y: 0 }
        ], {
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
        
        // Fix: Use arrays of numbers for Line constructors
        const body = new Line([15, 30, 15, 70], {
          stroke: '#333333',
          strokeWidth: 2,
        });
        
        const leftArm = new Line([15, 40, 0, 55], {
          stroke: '#333333',
          strokeWidth: 2,
        });
        
        const rightArm = new Line([15, 40, 30, 55], {
          stroke: '#333333',
          strokeWidth: 2,
        });
        
        const leftLeg = new Line([15, 70, 0, 100], {
          stroke: '#333333',
          strokeWidth: 2,
        });
        
        const rightLeg = new Line([15, 70, 30, 100], {
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
        // Fix: Use arrays of numbers for Line constructor
        const arrowLine = new Line([0, 0, 100, 0], {
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
        // Fix: Use arrays of numbers for Line constructor
        shape = new Line([0, 0, 100, 0], {
          stroke: '#333333',
          strokeWidth: 2,
          left: centerX - 50,
          top: centerY,
          objectCaching: false,
        });
        break;
        
      case 'curved-line':
        // Fix: Create curved line with Path object using points instead of SVG path string
        shape = new Path([
          { x: 0, y: 0 },
          { x: 100, y: 0, control: { x: 50, y: -50 } }
        ], {
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
                      className="h-10 w-full aspect-square flex items-
