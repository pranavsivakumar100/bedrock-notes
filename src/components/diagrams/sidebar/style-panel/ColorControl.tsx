
import React from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ColorControlProps {
  canvas: Canvas | null;
  selectedElement: FabricObject | null;
}

const ColorControl: React.FC<ColorControlProps> = ({ canvas, selectedElement }) => {
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !selectedElement) return;
    
    const color = e.target.value;
    
    if (selectedElement.type === 'i-text') {
      selectedElement.set({ fill: color });
    } else {
      selectedElement.set({ stroke: color });
    }
    
    canvas.renderAll();
  };

  return (
    <div>
      <Label htmlFor="color" className="text-xs">Color</Label>
      <div className="flex gap-2">
        <div className="w-8 h-8 border rounded-md overflow-hidden">
          <input
            type="color"
            id="color"
            onChange={handleColorChange}
            className="w-10 h-10 -ml-1 -mt-1 cursor-pointer"
          />
        </div>
        <Input
          value="#333333"
          className="h-8 flex-1"
          readOnly
        />
      </div>
    </div>
  );
};

export default ColorControl;
