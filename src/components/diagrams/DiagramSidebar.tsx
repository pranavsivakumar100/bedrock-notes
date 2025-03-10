import React, { useState } from 'react';
import { Canvas, Object as FabricObject, Group, Line, IText, Rect } from 'fabric';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Palette,
  Settings,
  Layers,
  Trash2,
  Copy,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface DiagramSidebarProps {
  canvas: Canvas | null;
  selectedElement: FabricObject | null;
  setSelectedElement: (element: FabricObject | null) => void;
}

const DiagramSidebar: React.FC<DiagramSidebarProps> = ({ 
  canvas, 
  selectedElement,
  setSelectedElement 
}) => {
  const [opacity, setOpacity] = useState(100);
  
  const handleDelete = () => {
    if (!canvas || !selectedElement) return;
    
    canvas.remove(selectedElement);
    setSelectedElement(null);
    canvas.renderAll();
  };
  
  const handleDuplicate = () => {
    if (!canvas || !selectedElement) return;
    
    const clonedObj = selectedElement.toObject();
    
    let newObj: FabricObject | null = null;
    
    const options = {
      ...clonedObj,
      left: (selectedElement.left || 0) + 20,
      top: (selectedElement.top || 0) + 20,
      evented: true,
    };
    
    if (selectedElement.type === 'rect') {
      newObj = new Rect(options);
    } else if (selectedElement.type === 'circle') {
      newObj = new (selectedElement.constructor as any)(options);
    } else if (selectedElement.type === 'triangle') {
      newObj = new (selectedElement.constructor as any)(options);
    } else if (selectedElement.type === 'i-text') {
      newObj = new IText((selectedElement as IText).text || '', options);
    } else if (selectedElement.type === 'path') {
      newObj = new (selectedElement.constructor as any)(options);
    } else if (selectedElement.type === 'group') {
      console.warn('Group cloning not fully implemented');
      return;
    } else {
      try {
        newObj = new (selectedElement.constructor as any)(options);
      } catch (error) {
        console.error('Failed to clone object:', error);
        return;
      }
    }
    
    if (newObj) {
      canvas.add(newObj);
      canvas.setActiveObject(newObj);
      canvas.renderAll();
      setSelectedElement(newObj);
    }
  };
  
  const handleBringForward = () => {
    if (!canvas || !selectedElement) return;
    
    const objects = canvas.getObjects();
    const index = objects.indexOf(selectedElement);
    
    if (index < objects.length - 1) {
      objects.splice(index, 1);
      objects.splice(index + 1, 0, selectedElement);
      
      canvas.renderAll();
    }
  };
  
  const handleSendBackward = () => {
    if (!canvas || !selectedElement) return;
    
    const objects = canvas.getObjects();
    const index = objects.indexOf(selectedElement);
    
    if (index > 0) {
      objects.splice(index, 1);
      objects.splice(index - 1, 0, selectedElement);
      
      canvas.renderAll();
    }
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
    <div className="w-72 border-r border-border/40 p-4 flex flex-col h-full bg-background">
      <Tabs defaultValue="properties">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="layers">Layers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="properties" className="space-y-4">
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Element Properties</h3>
              <div className="flex items-center gap-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleDuplicate}
                  disabled={!selectedElement}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleDelete}
                  disabled={!selectedElement}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="position-x">X Position</Label>
                  <Input 
                    id="position-x" 
                    type="number" 
                    value={position.x}
                    onChange={(e) => handlePositionChange('x', e.target.value)}
                    disabled={!selectedElement}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="position-y">Y Position</Label>
                  <Input 
                    id="position-y" 
                    type="number" 
                    value={position.y}
                    onChange={(e) => handlePositionChange('y', e.target.value)}
                    disabled={!selectedElement}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <Label htmlFor="element-width">Width</Label>
                  <Input 
                    id="element-width" 
                    type="number" 
                    value={dimensions.width}
                    onChange={(e) => handleSizeChange('width', e.target.value)}
                    disabled={!selectedElement}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="element-height">Height</Label>
                  <Input 
                    id="element-height" 
                    type="number" 
                    value={dimensions.height}
                    onChange={(e) => handleSizeChange('height', e.target.value)}
                    disabled={!selectedElement}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Alignment</Label>
                <div className="flex items-center justify-between">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleAlign('left')}
                    disabled={!selectedElement}
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleAlign('center')}
                    disabled={!selectedElement}
                  >
                    <AlignCenter className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleAlign('right')}
                    disabled={!selectedElement}
                  >
                    <AlignRight className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => handleAlign('top')}
                    disabled={!selectedElement}
                  >
                    <AlignJustify className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="style" className="space-y-4">
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-medium">Style Options</h3>
            <Separator />
            
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="element-color">Color</Label>
                <div className="flex items-center gap-2">
                  <input 
                    type="color" 
                    id="element-color"
                    className="w-10 h-10 border-0 p-0"
                    onChange={handleColorChange}
                    disabled={!selectedElement}
                  />
                  <Input 
                    value={selectedElement && selectedElement.type === 'i-text' 
                      ? (selectedElement.fill as string) 
                      : (selectedElement?.stroke as string) || ''}
                    onChange={handleColorChange}
                    disabled={!selectedElement}
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label htmlFor="element-opacity">Opacity</Label>
                  <span className="text-xs text-muted-foreground">{opacity}%</span>
                </div>
                <Slider 
                  id="element-opacity"
                  defaultValue={[100]} 
                  max={100} 
                  step={1}
                  value={[opacity]}
                  onValueChange={handleOpacityChange}
                  disabled={!selectedElement}
                />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="stroke-width">Stroke Width</Label>
                <Input 
                  id="stroke-width" 
                  type="number" 
                  min="0" 
                  max="20"
                  value={selectedElement?.strokeWidth || 0}
                  onChange={handleStrokeWidthChange}
                  disabled={!selectedElement || selectedElement.type === 'i-text'}
                />
              </div>
              
              {selectedElement && selectedElement.type === 'i-text' && (
                <div className="space-y-1">
                  <Label htmlFor="font-family">Font</Label>
                  <Select 
                    defaultValue="Arial" 
                    onValueChange={(value) => {
                      if (canvas && selectedElement && selectedElement.type === 'i-text') {
                        (selectedElement as IText).set({ fontFamily: value });
                        canvas.renderAll();
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a font" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Helvetica">Helvetica</SelectItem>
                      <SelectItem value="Times New Roman">Times New Roman</SelectItem>
                      <SelectItem value="Courier New">Courier New</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                      <SelectItem value="Verdana">Verdana</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="layers" className="space-y-4">
          <div className="space-y-2 pt-2">
            <h3 className="text-sm font-medium">Layer Controls</h3>
            <Separator />
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleBringForward}
                  disabled={!selectedElement}
                >
                  Bring Forward
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSendBackward}
                  disabled={!selectedElement}
                >
                  Send Backward
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DiagramSidebar;
