import React, { useState } from 'react';
import { Canvas, Object as FabricObject, IText } from 'fabric';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Palette, AlignLeft, AlignCenter, AlignRight, AlignJustify } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface StylePanelProps {
  canvas: Canvas | null;
  selectedElement: FabricObject | null;
}

const StylePanel: React.FC<StylePanelProps> = ({ canvas, selectedElement }) => {
  const [opacity, setOpacity] = useState(100);
  
  const handleOpacityChange = (value: number[]) => {
    if (!canvas || !selectedElement) return;
    
    const opacityValue = value[0];
    setOpacity(opacityValue);
    
    selectedElement.set({ opacity: opacityValue / 100 });
    canvas.renderAll();
  };
  
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
  
  const handleStrokeWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas || !selectedElement) return;
    
    const width = parseInt(e.target.value);
    selectedElement.set({ strokeWidth: width });
    canvas.renderAll();
  };
  
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
  
  // Helper function to check if an object is an IText type
  const isIText = (obj: FabricObject): boolean => {
    return obj.type === 'i-text';
  };
  
  return (
    <ScrollArea className="h-full p-4">
      {selectedElement ? (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Fill & Stroke</h3>
            <div className="space-y-2">
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
            </div>
          </div>
          
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
          
          {selectedElement.type === 'i-text' && (
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
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <Palette className="h-12 w-12 mb-4 opacity-20" />
          <p className="text-sm">Select an element to edit its style</p>
        </div>
      )}
    </ScrollArea>
  );
};

export default StylePanel;
