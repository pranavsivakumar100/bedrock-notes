
import React, { useEffect, useRef } from 'react';
import { Canvas, Object as FabricObject, Line, util, Rect } from 'fabric';
import { getDiagram } from '@/lib/diagram-storage';
import { toast } from 'sonner';

interface DiagramCanvasProps {
  setCanvas: (canvas: Canvas) => void;
  diagramId?: string;
  setSelectedElement: (element: any | null) => void;
}

// Add custom data property to Canvas
declare module 'fabric' {
  interface Canvas {
    _objects: FabricObject[];
    customData?: {
      connectionStart?: FabricObject;
      [key: string]: any;
    }
  }
  
  interface Object {
    data?: {
      type?: string;
      [key: string]: any;
    }
  }
}

const DiagramCanvas: React.FC<DiagramCanvasProps> = ({ 
  setCanvas, 
  diagramId,
  setSelectedElement
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<Canvas | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    // Get container dimensions for responsive canvas
    const container = containerRef.current;
    const containerWidth = container.clientWidth;
    const containerHeight = container.clientHeight;

    // Calculate a centered, paper-like area (draw.io style)
    // Default to standard paper size with some margin
    const paperWidth = Math.min(containerWidth - 100, 1100);
    const paperHeight = Math.min(containerHeight - 100, 800);

    // Initialize Fabric Canvas with proper dimensions
    const canvas = new Canvas(canvasRef.current, {
      width: containerWidth,
      height: containerHeight,
      backgroundColor: '#f5f5f5', // Light gray background like draw.io
      selection: true,
      preserveObjectStacking: true,
    });
    
    // Initialize custom data property
    canvas.customData = {};
    
    fabricCanvasRef.current = canvas;
    setCanvas(canvas);

    // Add grid (draw.io style)
    createGrid(canvas);

    // Create a centered "paper" rectangle
    createPaperArea(canvas, containerWidth, containerHeight, paperWidth, paperHeight);

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
      if (!containerRef.current || !canvas) return;
      
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      
      canvas.setWidth(newWidth);
      canvas.setHeight(newHeight);
      
      // Update paper area on resize
      const objects = canvas.getObjects();
      const paperObjects = objects.filter(obj => obj.data?.type === 'paper');
      
      if (paperObjects.length > 0) {
        canvas.remove(...paperObjects);
      }
      
      const paperWidth = Math.min(newWidth - 100, 1100);
      const paperHeight = Math.min(newHeight - 100, 800);
      
      createPaperArea(canvas, newWidth, newHeight, paperWidth, paperHeight);
      createGrid(canvas);
      
      canvas.renderAll();
    };

    window.addEventListener('resize', handleResize);

    // Ensure initial sizing is correct
    setTimeout(() => {
      handleResize();
    }, 100);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [diagramId, setCanvas, setSelectedElement]);

  // Create a grid pattern on the canvas (draw.io style)
  const createGrid = (canvas: Canvas) => {
    // Clear any existing grid
    const existingGrids = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
    existingGrids.forEach(grid => canvas.remove(grid));
    
    const gridSize = 20;
    const width = canvas.width || 1000;
    const height = canvas.height || 800;
    
    // Create vertical lines
    for (let i = 0; i < width / gridSize; i++) {
      const line = new Line([i * gridSize, 0, i * gridSize, height], {
        stroke: '#dddddd',
        selectable: false,
        evented: false,
        excludeFromExport: true,
        data: { type: 'grid' }
      });
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }
    
    // Create horizontal lines
    for (let i = 0; i < height / gridSize; i++) {
      const line = new Line([0, i * gridSize, width, i * gridSize], {
        stroke: '#dddddd',
        selectable: false,
        evented: false,
        excludeFromExport: true,
        data: { type: 'grid' }
      });
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }
    
    canvas.renderAll();
  };

  // Create a centered paper area (draw.io style)
  const createPaperArea = (canvas: Canvas, containerWidth: number, containerHeight: number, paperWidth: number, paperHeight: number) => {
    // Calculate centered position
    const left = (containerWidth - paperWidth) / 2;
    const top = (containerHeight - paperHeight) / 2;
    
    // Create "paper" rectangle
    const paperRect = new Rect({
      left: left,
      top: top,
      width: paperWidth,
      height: paperHeight,
      fill: '#ffffff',
      stroke: '#cccccc',
      strokeWidth: 1,
      selectable: false,
      evented: false,
      excludeFromExport: true,
      data: { type: 'paper' }
    });
    
    canvas.add(paperRect);
    canvas.sendObjectToBack(paperRect);
    canvas.renderAll();
  };

  // Enable snap to grid functionality
  const enableSnapToGrid = (canvas: Canvas) => {
    const gridSize = 20;
    
    canvas.on('object:moving', (e) => {
      if (!e.target) return;
      
      // Skip grid snapping if Shift key is pressed (for free movement)
      const evt = e.e as MouseEvent;
      if (evt && evt.shiftKey) return;
      
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
      const evt = e.e as MouseEvent;
      if (evt && evt.shiftKey) return;
      
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
    <div 
      ref={containerRef} 
      className="canvas-container draw-io-canvas-area" 
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
