
import React from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { Button } from '@/components/ui/button';
import { handleAddShape } from '../utils/shapeCreationUtils';

interface UMLShapesProps {
  canvas: Canvas | null;
  setSelectedElement: (element: FabricObject | null) => void;
}

const UMLShapes: React.FC<UMLShapesProps> = ({ canvas, setSelectedElement }) => {
  return (
    <div className="grid grid-cols-5 gap-1 px-2">
      {/* Add UML shapes here - for now just placeholder content */}
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
        onClick={() => handleAddShape({ canvas, shapeType: 'line', setSelectedElement })}
      >
        <div className="w-full h-0.5 bg-foreground"></div>
      </Button>
    </div>
  );
};

export default UMLShapes;
