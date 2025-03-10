
import React from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface StrokeControlProps {
  canvas: Canvas | null;
  selectedElement: FabricObject | null;
}

const StrokeControl: React.FC<StrokeControlProps> = ({ canvas, selectedElement }) => {
  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !selectedElement) return;
    
    const width = parseInt(e.target.value);
    selectedElement.set({ strokeWidth: width });
    canvas.renderAll();
  };

  return (
    <div>
      <Label htmlFor="stroke-width" className="text-xs">Stroke Width</Label>
      <Input
        id="stroke-width"
        type="number"
        min="0"
        max="20"
        defaultValue="1"
        onChange={handleStrokeWidthChange}
        className="h-8"
      />
    </div>
  );
};

export default StrokeControl;
