
import React, { useEffect, useRef } from 'react';
import { Canvas } from 'fabric';
import { getDiagram } from '@/lib/diagram-storage';
import { toast } from 'sonner';

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

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric Canvas
    const canvas = new Canvas(canvasRef.current, {
      width: window.innerWidth - 300,
      height: window.innerHeight - 120,
      backgroundColor: '#ffffff',
      selection: true,
      preserveObjectStacking: true,
    });
    
    fabricCanvasRef.current = canvas;
    setCanvas(canvas);

    // Add grid
    createGrid(canvas);

    // Enable snap-to-grid
    enableSnapToGrid(canvas);

    // Load diagram if ID is provided
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

    // Handle selection events
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

    // Handle window resize
    const handleResize = () => {
      canvas.setWidth(window.innerWidth - (300 + 40)); // Adjust width based on sidebar
      canvas.setHeight(window.innerHeight - 120); // Adjust for header
      canvas.renderAll();
      
      // Recreate grid when canvas is resized
      createGrid(canvas);
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [diagramId, setCanvas, setSelectedElement]);

  // Create a grid pattern on the canvas
  const createGrid = (canvas: Canvas) => {
    // Clear any existing grid
    const existingGrids = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
    existingGrids.forEach(grid => canvas.remove(grid));
    
    const gridSize = 20;
    const width = canvas.width || 1000;
    const height = canvas.height || 800;
    
    // Create vertical lines
    for (let i = 0; i < width / gridSize; i++) {
      const line = new fabric.Line([i * gridSize, 0, i * gridSize, height], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        excludeFromExport: true,
        data: { type: 'grid' }
      });
      canvas.add(line);
      canvas.sendToBack(line);
    }
    
    // Create horizontal lines
    for (let i = 0; i < height / gridSize; i++) {
      const line = new fabric.Line([0, i * gridSize, width, i * gridSize], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        excludeFromExport: true,
        data: { type: 'grid' }
      });
      canvas.add(line);
      canvas.sendToBack(line);
    }
    
    canvas.renderAll();
  };

  // Enable snap to grid functionality
  const enableSnapToGrid = (canvas: Canvas) => {
    const gridSize = 20;
    
    canvas.on('object:moving', (e) => {
      if (!e.target) return;
      
      // Skip grid snapping if Shift key is pressed (for free movement)
      if (e.e && (e.e as KeyboardEvent).shiftKey) return;
      
      const target = e.target;
      
      // Snap to grid
      target.set({
        left: Math.round(target.left! / gridSize) * gridSize,
        top: Math.round(target.top! / gridSize) * gridSize
      });
    });
    
    canvas.on('object:scaling', (e) => {
      if (!e.target) return;
      
      // Skip grid snapping if Shift key is pressed
      if (e.e && (e.e as KeyboardEvent).shiftKey) return;
      
      const target = e.target;
      const w = target.getScaledWidth();
      const h = target.getScaledHeight();
      
      target.set({
        scaleX: Math.round(w / gridSize) * gridSize / target.width!,
        scaleY: Math.round(h / gridSize) * gridSize / target.height!
      });
    });
  };

  return (
    <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
      <div className="canvas-container drop-shadow-md">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default DiagramCanvas;
