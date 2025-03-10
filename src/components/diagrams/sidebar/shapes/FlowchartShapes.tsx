
import React from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { Button } from '@/components/ui/button';
import { handleAddShape } from '../utils/shapeCreationUtils';

interface FlowchartShapesProps {
  canvas: Canvas | null;
  setSelectedElement: (element: FabricObject | null) => void;
}

const FlowchartShapes: React.FC<FlowchartShapesProps> = ({ canvas, setSelectedElement }) => {
  return (
    <div className="grid grid-cols-5 gap-1 px-2">
      {/* Add flowchart shapes here - for now just placeholder content */}
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-full aspect-square flex items-center justify-center p-1"
        onClick={() => handleAddShape({ canvas, shapeType: 'diamond', setSelectedElement })}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-2/3 h-2/3 border border-foreground rotate-45"></div>
        </div>
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-full aspect-square flex items-center justify-center p-1"
        onClick={() => handleAddShape({ canvas, shapeType: 'arrow', setSelectedElement })}
      >
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-4/5 h-0.5 bg-foreground"></div>
          <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-l-[10px] border-t-transparent border-b-transparent border-l-foreground ml-[-2px]"></div>
        </div>
      </Button>
    </div>
  );
};

export default FlowchartShapes;
