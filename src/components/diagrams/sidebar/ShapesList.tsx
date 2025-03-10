
import React, { useState } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Import shape category components
import GeneralShapes from './shapes/GeneralShapes';
import BasicShapes from './shapes/BasicShapes';
import FlowchartShapes from './shapes/FlowchartShapes';
import UMLShapes from './shapes/UMLShapes';
import WireframeShapes from './shapes/WireframeShapes';

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
              <GeneralShapes canvas={canvas} setSelectedElement={setSelectedElement} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="basic">
            <AccordionTrigger className="px-2 py-1 text-sm">
              Basic
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-1">
              <BasicShapes canvas={canvas} setSelectedElement={setSelectedElement} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="flowchart">
            <AccordionTrigger className="px-2 py-1 text-sm">
              Flowchart
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-1">
              <FlowchartShapes canvas={canvas} setSelectedElement={setSelectedElement} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="uml">
            <AccordionTrigger className="px-2 py-1 text-sm">
              UML
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-1">
              <UMLShapes canvas={canvas} setSelectedElement={setSelectedElement} />
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="wireframe">
            <AccordionTrigger className="px-2 py-1 text-sm">
              Wireframe
            </AccordionTrigger>
            <AccordionContent className="pt-0 pb-1">
              <WireframeShapes canvas={canvas} setSelectedElement={setSelectedElement} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </ScrollArea>
    </>
  );
};

export default ShapesList;
