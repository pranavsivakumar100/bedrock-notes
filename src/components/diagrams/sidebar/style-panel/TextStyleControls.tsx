
import React from 'react';
import { Canvas, Object as FabricObject, IText } from 'fabric';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TextStyleControlsProps {
  canvas: Canvas | null;
  selectedElement: FabricObject | null;
}

const TextStyleControls: React.FC<TextStyleControlsProps> = ({ canvas, selectedElement }) => {
  const handleFontFamilyChange = (fontFamily: string) => {
    if (!canvas || !selectedElement || selectedElement.type !== 'i-text') return;
    
    // Type assertion for IText
    (selectedElement as unknown as IText).set({ fontFamily });
    canvas.renderAll();
  };
  
  const handleFontSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !selectedElement || selectedElement.type !== 'i-text') return;
    
    // Type assertion for IText
    const fontSize = parseInt(e.target.value);
    (selectedElement as unknown as IText).set({ fontSize });
    canvas.renderAll();
  };
  
  const handleTextAlign = (textAlign: string) => {
    if (!canvas || !selectedElement || selectedElement.type !== 'i-text') return;
    
    // Type assertion for IText
    (selectedElement as unknown as IText).set({ textAlign });
    canvas.renderAll();
  };

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Text Options</h3>
      <div className="space-y-2">
        <div>
          <Label htmlFor="font-family" className="text-xs">Font Family</Label>
          <Select defaultValue="Arial" onValueChange={handleFontFamilyChange}>
            <SelectTrigger className="h-8">
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Arial">Arial</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
              <SelectItem value="Courier New">Courier New</SelectItem>
              <SelectItem value="Georgia">Georgia</SelectItem>
              <SelectItem value="Verdana">Verdana</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="font-size" className="text-xs">Font Size</Label>
          <Input
            id="font-size"
            type="number"
            min="8"
            max="72"
            defaultValue="16"
            onChange={handleFontSizeChange}
            className="h-8"
          />
        </div>
        
        <div>
          <Label className="text-xs">Text Alignment</Label>
          <div className="flex border rounded-md mt-1 divide-x">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-none flex-1"
              onClick={() => handleTextAlign('left')}
            >
              <AlignLeft className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-none flex-1"
              onClick={() => handleTextAlign('center')}
            >
              <AlignCenter className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-none flex-1"
              onClick={() => handleTextAlign('right')}
            >
              <AlignRight className="h-3.5 w-3.5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-none flex-1"
              onClick={() => handleTextAlign('justify')}
            >
              <AlignJustify className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextStyleControls;
