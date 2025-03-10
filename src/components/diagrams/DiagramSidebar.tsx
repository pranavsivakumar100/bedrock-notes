
import React, { useState } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ShapesList from './sidebar/ShapesList';
import PropertiesPanel from './sidebar/PropertiesPanel';
import StylePanel from './sidebar/StylePanel';

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
  const [activeTab, setActiveTab] = useState("properties");
  const [searchTerm, setSearchTerm] = useState("");
  
  return (
    <div className="w-full h-full border-l border-border/40 flex flex-col bg-background">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 p-0 h-10">
          <TabsTrigger value="shapes" className="rounded-none">Shapes</TabsTrigger>
          <TabsTrigger value="properties" className="rounded-none">Properties</TabsTrigger>
          <TabsTrigger value="style" className="rounded-none">Style</TabsTrigger>
        </TabsList>
        
        <TabsContent value="shapes" className="flex-1 overflow-hidden p-0 m-0">
          <ShapesList 
            canvas={canvas} 
            setSelectedElement={setSelectedElement}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </TabsContent>
        
        <TabsContent value="properties" className="flex-1 overflow-hidden p-0 m-0">
          <PropertiesPanel 
            canvas={canvas} 
            selectedElement={selectedElement} 
            setSelectedElement={setSelectedElement} 
          />
        </TabsContent>
        
        <TabsContent value="style" className="flex-1 overflow-hidden p-0 m-0">
          <StylePanel 
            canvas={canvas} 
            selectedElement={selectedElement} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiagramSidebar;
