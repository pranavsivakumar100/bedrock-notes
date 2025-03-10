
import React from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { Button } from '@/components/ui/button';
import { handleAddShape } from '../utils/shapeCreationUtils';

interface BasicShapesProps {
  canvas: Canvas | null;
  setSelectedElement: (element: FabricObject | null) => void;
}

const BasicShapes: React.FC<BasicShapesProps> = ({ canvas, setSelectedElement }) => {
  return (
    <div className="grid grid-cols-5 gap-1 px-2">
      {/* Add basic shapes here - for now just placeholder content */}
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
        onClick={() => handleAddShape({ canvas, shapeType: 'circle', setSelectedElement })}
      >
        <div className="border border-foreground w-full h-full rounded-full"></div>
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-full aspect-square flex items-center justify-center p-1"
        onClick={() => handleAddShape({ canvas, shapeType: 'triangle', setSelectedElement })}
      >
        <div className="border border-foreground w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent mx-auto my-auto"></div>
      </Button>
    </div>
  );
};

export default BasicShapes;
