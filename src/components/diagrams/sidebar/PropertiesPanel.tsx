
import React from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings, Trash2, Copy, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface PropertiesPanelProps {
  canvas: Canvas | null;
  selectedElement: FabricObject | null;
  setSelectedElement: (element: FabricObject | null) => void;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  canvas, 
  selectedElement, 
  setSelectedElement 
}) => {
  const handleDelete = () => {
    if (!canvas || !selectedElement) return;
    
    canvas.remove(selectedElement);
    setSelectedElement(null);
    canvas.renderAll();
  };
  
  const handleDuplicate = () => {
    if (!canvas || !selectedElement) return;
    
    selectedElement.clone((cloned: FabricObject) => {
      cloned.set({
        left: (selectedElement.left || 0) + 20,
        top: (selectedElement.top || 0) + 20,
        evented: true,
      });
      
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.renderAll();
      setSelectedElement(cloned);
    });
  };
  
  const handleBringForward = () => {
    if (!canvas || !selectedElement) return;
    
    canvas.bringForward(selectedElement);
    canvas.renderAll();
  };
  
  const handleSendBackward = () => {
    if (!canvas || !selectedElement) return;
    
    canvas.sendBackwards(selectedElement);
    canvas.renderAll();
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
  
  const dimensions = getObjectDimensions();
  const position = getObjectPosition();
  
  return (
    <ScrollArea className="h-full p-4">
      {selectedElement ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Position</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="position-x" className="text-xs">X</Label>
                <Input
                  id="position-x"
                  type="number"
                  value={position.x}
                  onChange={(e) => handlePositionChange('x', e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="position-y" className="text-xs">Y</Label>
                <Input
                  id="position-y"
                  type="number"
                  value={position.y}
                  onChange={(e) => handlePositionChange('y', e.target.value)}
                  className="h-8"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Size</h3>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="size-width" className="text-xs">Width</Label>
                <Input
                  id="size-width"
                  type="number"
                  value={dimensions.width}
                  onChange={(e) => handleSizeChange('width', e.target.value)}
                  className="h-8"
                />
              </div>
              <div>
                <Label htmlFor="size-height" className="text-xs">Height</Label>
                <Input
                  id="size-height"
                  type="number"
                  value={dimensions.height}
                  onChange={(e) => handleSizeChange('height', e.target.value)}
                  className="h-8"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDelete}
                className="flex items-center gap-1"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDuplicate}
                className="flex items-center gap-1"
              >
                <Copy className="h-3.5 w-3.5" />
                Duplicate
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBringForward}
                className="flex items-center gap-1"
              >
                Bring Forward
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSendBackward}
                className="flex items-center gap-1"
              >
                Send Backward
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">Alignment</h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => handleAlign('left')}
              >
                <AlignLeft className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => handleAlign('center')}
              >
                <AlignCenter className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => handleAlign('right')}
              >
                <AlignRight className="h-3.5 w-3.5" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => handleAlign('top')}
              >
                <AlignLeft className="h-3.5 w-3.5 rotate-90" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => handleAlign('middle')}
              >
                <AlignCenter className="h-3.5 w-3.5 rotate-90" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8" 
                onClick={() => handleAlign('bottom')}
              >
                <AlignRight className="h-3.5 w-3.5 rotate-90" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Settings className="h-12 w-12 mb-4 opacity-20" />
          <p className="text-sm">Select an element to edit its properties</p>
        </div>
      )}
    </ScrollArea>
  );
};

export default PropertiesPanel;
