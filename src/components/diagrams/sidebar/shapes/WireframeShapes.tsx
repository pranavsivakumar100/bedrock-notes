
import React from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { Button } from '@/components/ui/button';
import { handleAddShape } from '../utils/shapeCreationUtils';

interface WireframeShapesProps {
  canvas: Canvas | null;
  setSelectedElement: (element: FabricObject | null) => void;
}

const WireframeShapes: React.FC<WireframeShapesProps> = ({ canvas, setSelectedElement }) => {
  return (
    <div className="grid grid-cols-5 gap-1 px-2">
      {/* Add wireframe shapes here - for now just placeholder content */}
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-full aspect-square flex items-center justify-center p-1"
        onClick={() => handleAddShape({ canvas, shapeType: 'rectangle', setSelectedElement })}
      >
        <div className="border border-foreground w-full h-full"></div>
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-full aspect-square flex items-center justify-center p-1"
        onClick={() => handleAddShape({ canvas, shapeType: 'text', setSelectedElement })}
      >
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-xs">Text</span>
        </div>
      </Button>
    </div>
  );
};

export default WireframeShapes;
