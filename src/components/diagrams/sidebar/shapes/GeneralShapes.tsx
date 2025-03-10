
import React from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { Button } from '@/components/ui/button';
import { Pentagon, Hexagon } from 'lucide-react';
import { handleAddShape } from '../utils/shapeCreationUtils';

interface GeneralShapesProps {
  canvas: Canvas | null;
  setSelectedElement: (element: FabricObject | null) => void;
}

const GeneralShapes: React.FC<GeneralShapesProps> = ({ canvas, setSelectedElement }) => {
  return (
    <div className="grid grid-cols-5 gap-1 px-2">
      {/* First row */}
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
        onClick={() => handleAddShape({ canvas, shapeType: 'round-rectangle', setSelectedElement })}
      >
        <div className="border border-foreground w-full h-full rounded-md"></div>
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
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-full aspect-square flex items-center justify-center p-1"
        onClick={() => handleAddShape({ canvas, shapeType: 'text-box', setSelectedElement })}
      >
        <div className="border border-foreground w-full h-2/3 flex items-center justify-center">
          <span className="text-[8px]">Text</span>
        </div>
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-full aspect-square flex items-center justify-center p-1"
        onClick={() => handleAddShape({ canvas, shapeType: 'ellipse', setSelectedElement })}
      >
        <div className="border border-foreground w-full h-full rounded-full"></div>
      </Button>
      
      {/* Second row */}
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-full aspect-square flex items-center justify-center p-1"
        onClick={() => handleAddShape({ canvas, shapeType: 'square', setSelectedElement })}
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
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-full aspect-square flex items-center justify-center p-1"
        onClick={() => handleAddShape({ canvas, shapeType: 'right-triangle', setSelectedElement })}
      >
        <div className="border-b border-r border-foreground w-full h-full"></div>
      </Button>
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
      
      {/* Third row */}
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-full aspect-square flex items-center justify-center p-1"
        onClick={() => handleAddShape({ canvas, shapeType: 'pentagon', setSelectedElement })}
      >
        <Pentagon className="w-6 h-6 text-foreground" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-full aspect-square flex items-center justify-center p-1"
        onClick={() => handleAddShape({ canvas, shapeType: 'hexagon', setSelectedElement })}
      >
        <Hexagon className="w-6 h-6 text-foreground" />
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-full aspect-square flex items-center justify-center p-1"
        onClick={() => handleAddShape({ canvas, shapeType: 'octagon', setSelectedElement })}
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
        onClick={() => handleAddShape({ canvas, shapeType: 'trapezoid', setSelectedElement })}
      >
        <div className="w-full h-1/2 border-t border-l border-r border-foreground" style={{ borderLeft: '5px solid transparent', borderRight: '5px solid transparent', width: '100%', height: '0', borderTop: '20px solid currentColor' }}></div>
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-full aspect-square flex items-center justify-center p-1"
        onClick={() => handleAddShape({ canvas, shapeType: 'parallelogram', setSelectedElement })}
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
        onClick={() => handleAddShape({ canvas, shapeType: 'cylinder', setSelectedElement })}
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
        onClick={() => handleAddShape({ canvas, shapeType: 'cloud', setSelectedElement })}
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
        onClick={() => handleAddShape({ canvas, shapeType: 'speech-bubble', setSelectedElement })}
      >
        <div className="relative w-4/5 h-3/5 border border-foreground rounded-md">
          <div className="absolute -bottom-1.5 left-1/4 w-0 h-0 border-l-8 border-t-8 border-r-0 border-l-transparent border-t-foreground transform rotate-10"></div>
        </div>
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-full aspect-square flex items-center justify-center p-1"
        onClick={() => handleAddShape({ canvas, shapeType: 'document', setSelectedElement })}
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
        onClick={() => handleAddShape({ canvas, shapeType: 'note', setSelectedElement })}
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
        onClick={() => handleAddShape({ canvas, shapeType: 'person', setSelectedElement })}
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
        onClick={() => handleAddShape({ canvas, shapeType: 'arrow', setSelectedElement })}
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
        onClick={() => handleAddShape({ canvas, shapeType: 'line', setSelectedElement })}
      >
        <div className="w-full h-0.5 bg-foreground"></div>
      </Button>
      <Button 
        variant="outline" 
        size="icon" 
        className="h-10 w-full aspect-square flex items-center justify-center p-1"
        onClick={() => handleAddShape({ canvas, shapeType: 'curved-line', setSelectedElement })}
      >
        <div className="w-4/5 h-4/5 flex items-center justify-center">
          <div className="w-full h-3/5 border-t border-foreground rounded-t-full"></div>
        </div>
      </Button>
    </div>
  );
};

export default GeneralShapes;
