
import React, { useState } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { ScrollArea } from '@/components/ui/scroll-area';
import ColorControl from './style-panel/ColorControl';
import StrokeControl from './style-panel/StrokeControl';
import OpacityControl from './style-panel/OpacityControl';
import TextStyleControls from './style-panel/TextStyleControls';
import EmptyStyleState from './style-panel/EmptyStyleState';

interface StylePanelProps {
  canvas: Canvas | null;
  selectedElement: FabricObject | null;
}

const StylePanel: React.FC<StylePanelProps> = ({ canvas, selectedElement }) => {
  const [opacity, setOpacity] = useState(100);
  
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
              <ColorControl canvas={canvas} selectedElement={selectedElement} />
              <StrokeControl canvas={canvas} selectedElement={selectedElement} />
            </div>
          </div>
          
          <OpacityControl 
            canvas={canvas} 
            selectedElement={selectedElement} 
            opacity={opacity}
            setOpacity={setOpacity}
          />
          
          {selectedElement.type === 'i-text' && (
            <TextStyleControls 
              canvas={canvas} 
              selectedElement={selectedElement} 
            />
          )}
        </div>
      ) : (
        <EmptyStyleState />
      )}
    </ScrollArea>
  );
};

export default StylePanel;
