
import React, { useState } from 'react';
import { Canvas, Object as FabricObject, Group, Line, IText, Rect, Circle, Triangle, Ellipse, Path, Polygon } from 'fabric';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Pentagon, Hexagon } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ShapesListProps {
  canvas: Canvas | null;
  setSelectedElement: (element: FabricObject | null) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ShapesList: React.FC<ShapesListProps> = ({ 
  canvas, 
  setSelectedElement,
  searchTerm, 
  setSearchTerm 
}) => {
  
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
        canvas.add(text as unknown as FabricObject);
        canvas.setActiveObject(text as unknown as FabricObject);
        canvas.renderAll();
        setSelectedElement(text as unknown as FabricObject);
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
        
        shape = new Group([cylinderRect, topEllipse, bottomEllipse], {
          left: centerX - 40,
          top: centerY - 50,
          objectCaching: false,
        });
        break;
        
      case 'document':
        const documentShape = new Polygon({
          points: [
            { x: 0, y: 0 },
            { x: 80, y: 0 },
            { x: 100, y: 20 },
            { x: 100, y: 100 },
            { x: 0, y: 100 }
          ],
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
        });
        
        const foldLine = new Line([
          80, 0, 
          100, 20
        ], {
          stroke: '#333333',
          strokeWidth: 1,
        });
        
        shape = new Group([documentShape, foldLine], {
          left: centerX - 50,
          top: centerY - 50,
          objectCaching: false,
        });
        break;
        
      case 'cloud':
        const cloudPath = new Path('M25,60 C10,60 10,45 25,35 C10,35 10,10 40,10 C80,10 80,35 95,35 C95,50 95,60 80,60 Z', {
          left: centerX - 50,
          top: centerY - 35,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        shape = cloudPath;
        break;
        
      case 'speech-bubble':
        const speechBubblePath = new Path('M10,0 C0,0 0,10 0,10 L0,70 C0,80 10,80 10,80 L50,80 L60,100 L70,80 L90,80 C100,80 100,70 100,70 L100,10 C100,0 90,0 90,0 Z', {
          left: centerX - 50,
          top: centerY - 50,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        shape = speechBubblePath;
        break;
        
      case 'note':
        const notePath = new Path('M0,0 L70,0 L70,70 L85,55 L85,100 L0,100 Z', {
          left: centerX - 42.5,
          top: centerY - 50,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
          objectCaching: false,
        });
        shape = notePath;
        break;
        
      case 'person':
        const head = new Circle({
          radius: 15,
          left: 0,
          top: 0,
          fill: '#f0f0f0',
          stroke: '#333333',
          strokeWidth: 1,
        });
        
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
        
        shape = new Group([head, body, leftArm, rightArm, leftLeg, rightLeg], {
          left: centerX - 20,
          top: centerY - 50,
          objectCaching: false,
        });
        break;
        
      case 'arrow':
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
        
        shape = new Group([arrowLine, arrowHead], {
          left: centerX - 50,
          top: centerY,
          objectCaching: false,
        });
        break;
        
      case 'line':
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
        const curvedLinePath = new Path('M0,0 Q50,-50 100,0', {
          fill: '',
          stroke: '#333333',
          strokeWidth: 2,
          left: centerX - 50,
          top: centerY,
          objectCaching: false,
        });
        shape = curvedLinePath;
        break;
        
      case 'text':
        const textObject = new IText('Text', {
          left: centerX - 50,
          top: centerY - 25,
          fill: '#333333',
          fontSize: 20,
          fontFamily: 'Arial',
          objectCaching: false,
        });
        
        canvas.add(textObject as unknown as FabricObject);
        canvas.setActiveObject(textObject as unknown as FabricObject);
        canvas.renderAll();
        setSelectedElement(textObject as unknown as FabricObject);
        
        toast.success(`Added ${shapeType}`);
        return;
        
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
    <>
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
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-4/5 h-0.5 bg-foreground"></div>
                    <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-foreground ml-[-2px]"></div>
                  </div>
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
    </>
  );
};

export default ShapesList;
