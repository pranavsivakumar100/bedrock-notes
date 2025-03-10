
import React from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { Slider } from '@/components/ui/slider';

interface OpacityControlProps {
  canvas: Canvas | null;
  selectedElement: FabricObject | null;
  opacity: number;
  setOpacity: (value: number) => void;
}

const OpacityControl: React.FC<OpacityControlProps> = ({ 
  canvas, 
  selectedElement, 
  opacity, 
  setOpacity 
}) => {
  const handleOpacityChange = (value: number[]) => {
    if (!canvas || !selectedElement) return;
    
    const opacityValue = value[0];
    setOpacity(opacityValue);
    
    selectedElement.set({ opacity: opacityValue / 100 });
    canvas.renderAll();
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Opacity</h3>
      <div className="space-y-2">
        <Slider
          value={[opacity]}
          min={0}
          max={100}
          step={1}
          onValueChange={handleOpacityChange}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>{opacity}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  );
};

export default OpacityControl;
