
import React, { useEffect, useRef } from 'react';
import { Canvas, Object as FabricObject } from 'fabric';
import { getDiagram } from '@/lib/diagram-storage';
import { toast } from 'sonner';
import { createGrid, enableSnapToGrid } from '@/lib/canvas/grid-utils';
import { setupPanning } from '@/lib/canvas/pan-utils';
import { setupZoomWithMouseWheel } from '@/lib/canvas/zoom-utils';
import '@/lib/canvas/fabric-types';

interface DiagramCanvasProps {
  setCanvas: (canvas: Canvas) => void;
  diagramId?: string;
  setSelectedElement: (element: any | null) => void;
}

const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ 
  setCanvas, 
  diagramId,
  setSelectedElement
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isPanning = useRef<boolean>(false);
  const lastPanPoint = useRef<{ x: number, y: number } | null>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    const canvas = new Canvas(canvasRef.current, {
      width: containerWidth,
      height: containerHeight,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });
    
    canvas.customData = {};
    
    fabricCanvasRef.current = canvas;
    setCanvas(canvas);

    createGrid(canvas);
    enableSnapToGrid(canvas);
    setupZoomWithMouseWheel(canvas, container);
    setupPanning(canvas, container, isPanning, lastPanPoint);

    if (diagramId && diagramId !== 'new') {
      try {
        const diagram = getDiagram(diagramId);
        if (diagram && diagram.json) {
          canvas.loadFromJSON(diagram.json, () => {
            canvas.renderAll();
          });
        }
      } catch (error) {
        toast.error("Failed to load diagram");
        console.error("Load error:", error);
      }
    }

    canvas.on('selection:created', (e) => {
      if (e.selected && e.selected.length > 0) {
        setSelectedElement(e.selected[0]);
      }
    });

    canvas.on('selection:updated', (e) => {
      if (e.selected && e.selected.length > 0) {
        setSelectedElement(e.selected[0]);
      }
    });

    canvas.on('selection:cleared', () => {
      setSelectedElement(null);
    });

    const handleResize = () => {
      if (!containerRef.current || !canvas) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      canvas.setWidth(newWidth);
      canvas.setHeight(newHeight);
      canvas.renderAll();
      
      createGrid(canvas);
    };

    window.addEventListener('resize', handleResize);

    // Handle zoom changes to update grid
    canvas.on('zoom:changed', () => {
      createGrid(canvas);
    });

    setTimeout(() => {
      handleResize();
    }, 100);

    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [diagramId, setCanvas, setSelectedElement]);

  return (
    <div 
      ref={containerRef} 
      className="flex-1 w-full h-full overflow-hidden bg-white" 
      style={{ position: 'absolute', left: 0, right: 0, bottom: 0, top: 0 }}
    >
      <canvas 
        ref={canvasRef} 
        className="w-full h-full" 
      />
    </div>
  );
};

export default DiagramCanvas;
