import React, { useState } from 'react';
import { Canvas, Object as FabricObject, Group, Line, IText, Rect, Circle, Triangle } from 'fabric';
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
  Type
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
        
      case 'arrow':
        shape = new Line([centerX - 50, centerY, centerX + 50, centerY], {
          stroke: '#333333',
          strokeWidth: 2,
          objectCaching: false,
        });
        
        (shape as any).strokeLineCap = 'round';
        (shape as any).strokeLineJoin = 'round';
        (shape as any).arrow = true;
        (shape as any).arrowHead = 'end';
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
                  <div className="grid grid-cols-3 gap-1 px-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center"
                      onClick={() => handleAddShape('rectangle')}
                    >
                      <SquareIcon className="h-6 w-6" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center"
                      onClick={() => handleAddShape('circle')}
                    >
                      <CircleIcon className="h-6 w-6" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center"
                      onClick={() => handleAddShape('triangle')}
                    >
                      <TriangleIcon className="h-6 w-6" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="basic">
                <AccordionTrigger className="px-2 py-1 text-sm">
                  Basic
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-1">
                  <div className="grid grid-cols-3 gap-1 px-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center"
                      onClick={() => handleAddShape('rectangle')}
                    >
                      <SquareIcon className="h-6 w-6" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center"
                      onClick={() => handleAddShape('circle')}
                    >
                      <CircleIcon className="h-6 w-6" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center"
                      onClick={() => handleAddShape('triangle')}
                    >
                      <TriangleIcon className="h-6 w-6" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="arrows">
                <AccordionTrigger className="px-2 py-1 text-sm">
                  Arrows
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-1">
                  <div className="grid grid-cols-3 gap-1 px-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center"
                      onClick={() => handleAddShape('arrow')}
                    >
                      <ArrowRightIcon className="h-6 w-6" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="text">
                <AccordionTrigger className="px-2 py-1 text-sm">
                  Text
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-1">
                  <div className="grid grid-cols-3 gap-1 px-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center"
                      onClick={() => handleAddShape('text')}
                    >
                      <Type className="h-6 w-6" />
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="flowchart">
                <AccordionTrigger className="px-2 py-1 text-sm">
                  Flowchart
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-1">
                  <div className="grid grid-cols-3 gap-1 px-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center"
                      onClick={() => handleAddShape('rectangle')}
                    >
                      <div className="w-6 h-6 border-2 rounded-sm"></div>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="entity-relation">
                <AccordionTrigger className="px-2 py-1 text-sm">
                  Entity Relation
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-1">
                  <div className="grid grid-cols-3 gap-1 px-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center"
                      onClick={() => handleAddShape('rectangle')}
                    >
                      <div className="w-5 h-5 border-2 rounded-sm"></div>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="uml">
                <AccordionTrigger className="px-2 py-1 text-sm">
                  UML
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-1">
                  <div className="grid grid-cols-3 gap-1 px-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-10 w-full aspect-square flex items-center justify-center"
                      onClick={() => handleAddShape('text')}
                    >
                      <div className="h-6 w-6 border-2 flex flex-col">
                        <div className="border-b h-1/3 w-full"></div>
                      </div>
                    </Button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <div className="p-2">
              <Button size="sm" className="w-full" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                More Shapes
              </Button>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="properties" className="flex-1 overflow-hidden p-0 m-0">
          <ScrollArea className="h-full invisible-scrollbar">
            <div className="space-y-2 p-4">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Element Properties</h3>
                <div className="flex items-center gap-1">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleDuplicate}
                    disabled={!selectedElement}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={handleDelete}
                    disabled={!selectedElement}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="position-x">X Position</Label>
                    <Input 
                      id="position-x" 
                      type="number" 
                      value={position.x}
                      onChange={(e) => handlePositionChange('x', e.target.value)}
                      disabled={!selectedElement}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="position-y">Y Position</Label>
                    <Input 
                      id="position-y" 
                      type="number" 
                      value={position.y}
                      onChange={(e) => handlePositionChange('y', e.target.value)}
                      disabled={!selectedElement}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label htmlFor="element-width">Width</Label>
                    <Input 
                      id="element-width" 
                      type="number" 
                      value={dimensions.width}
                      onChange={(e) => handleSizeChange('width', e.target.value)}
                      disabled={!selectedElement}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="element-height">Height</Label>
                    <Input 
                      id="element-height" 
                      type="number" 
                      value={dimensions.height}
                      onChange={(e) => handleSizeChange('height', e.target.value)}
                      disabled={!selectedElement}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Alignment</Label>
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleAlign('left')}
                      disabled={!selectedElement}
                    >
                      <AlignLeft className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleAlign('center')}
                      disabled={!selectedElement}
                    >
                      <AlignCenter className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleAlign('right')}
                      disabled={!selectedElement}
                    >
                      <AlignRight className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleAlign('top')}
                      disabled={!selectedElement}
                    >
                      <AlignJustify className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Zoom</Label>
                  <div className="flex gap-2 items-center">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleZoom('out')}
                    >
                      <ZoomOut className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 text-center text-sm">
                      {scale}%
                    </div>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => handleZoom('in')}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">View</h3>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="show-grid" 
                    checked={showGrid} 
                    onCheckedChange={(checked) => handleGridToggle(!!checked)}
                  />
                  <Label htmlFor="show-grid" className="cursor-pointer">Grid</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="page-view" 
                    checked={showPageView} 
                    onCheckedChange={(checked) => setShowPageView(!!checked)}
                  />
                  <Label htmlFor="page-view" className="cursor-pointer">Page View</Label>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="background-color">Background Color</Label>
                  <div className="flex gap-2">
                    <div className="h-8 w-8 overflow-hidden rounded border">
                      <input 
                        type="color" 
                        id="background-color" 
                        value={backgroundColor}
                        onChange={handleBackgroundColorChange}
                        className="h-10 w-10 transform -translate-x-1 -translate-y-1 cursor-pointer"
                      />
                    </div>
                    <Input 
                      value={backgroundColor}
                      onChange={handleBackgroundColorChange}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Paper Size</h3>
                
                <div className="space-y-2">
                  <Select 
                    value={paperSize} 
                    onValueChange={setPaperSize}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select paper size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="letter">US Letter (8.5" x 11")</SelectItem>
                      <SelectItem value="legal">US Legal (8.5" x 14")</SelectItem>
                      <SelectItem value="a4">A4 (210mm x 297mm)</SelectItem>
                      <SelectItem value="a3">A3 (297mm x 420mm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Orientation</Label>
                  <RadioGroup 
                    value={orientation} 
                    onValueChange={setOrientation}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="portrait" id="portrait" />
                      <Label htmlFor="portrait">Portrait</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="landscape" id="landscape" />
                      <Label htmlFor="landscape">Landscape</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="style" className="flex-1 overflow-hidden p-0 m-0">
          <ScrollArea className="h-full invisible-scrollbar">
            <div className="space-y-2 p-4">
              <h3 className="text-sm font-medium">Style Options</h3>
              <Separator />
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label htmlFor="element-color">Color</Label>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 overflow-hidden rounded border">
                      <input 
                        type="color" 
                        id="element-color"
                        className="h-10 w-10 transform -translate-x-1 -translate-y-1 cursor-pointer"
                        onChange={handleColorChange}
                        disabled={!selectedElement}
                      />
                    </div>
                    <Input 
                      value={selectedElement && selectedElement.type === 'i-text' 
                        ? (selectedElement.fill as string) 
                        : (selectedElement?.stroke as string) || ''}
                      onChange={handleColorChange}
                      disabled={!selectedElement}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <Label htmlFor="element-opacity">Opacity</Label>
                    <span className="text-xs text-muted-foreground">{opacity}%</span>
                  </div>
                  <Slider 
                    id="element-opacity"
                    defaultValue={[100]} 
                    max={100} 
                    step={1}
                    value={[opacity]}
                    onValueChange={handleOpacityChange}
                    disabled={!selectedElement}
                  />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor="stroke-width">Stroke Width</Label>
                  <Input 
                    id="stroke-width" 
                    type="number" 
                    min="0" 
                    max="20"
                    value={selectedElement?.strokeWidth || 0}
                    onChange={handleStrokeWidthChange}
                    disabled={!selectedElement || selectedElement.type === 'i-text'}
                  />
                </div>
                
                {selectedElement && selectedElement.type === 'i-text' && (
                  <div className="space-y-1">
                    <Label htmlFor="font-family">Font</Label>
                    <Select 
                      defaultValue="Arial" 
                      onValueChange={(value) => {
                        if (canvas && selectedElement && selectedElement.type === 'i-text') {
                          (selectedElement as IText).set({ fontFamily: value });
                          canvas.renderAll();
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a font" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Arial">Arial</SelectItem>
                        <SelectItem value="Helvetica">Helvetica</SelectItem>
                        <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                        <SelectItem value="Courier New">Courier New</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Verdana">Verdana</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <Separator />
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Layer Controls</h3>
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleBringForward}
                      disabled={!selectedElement}
                    >
                      Bring Forward
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleSendBackward}
                      disabled={!selectedElement}
                    >
                      Send Backward
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiagramSidebar;
