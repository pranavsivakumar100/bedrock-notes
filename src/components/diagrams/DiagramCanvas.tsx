
import React, { useEffect, useRef } from 'react';
import { Canvas, Object as FabricObject, Line, util, Point } from 'fabric';
import { getDiagram } from '@/lib/diagram-storage';
import { toast } from 'sonner';

interface DiagramCanvasProps {
  setCanvas: (canvas: Canvas) => void;
  diagramId?: string;
  setSelectedElement: (element: any | null) => void;
}

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

// Extend Canvas events to add our custom events
declare module 'fabric' {
  interface CanvasEvents {
    'zoom:changed': any;
    'pan:moved': any;
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
    setupPanning(canvas, container);

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

  const setupPanning = (canvas: Canvas, container: HTMLDivElement) => {
    // Prevent context menu from appearing during panning
    container.addEventListener('contextmenu', (e) => {
      if (isPanning.current || e.ctrlKey) {
        e.preventDefault();
        return false;
      }
    });

    container.addEventListener('mousedown', (e) => {
      // Only trigger panning on left mouse button (button 0) with Ctrl key
      if (e.ctrlKey && e.button === 0) {
        isPanning.current = true;
        lastPanPoint.current = { x: e.clientX, y: e.clientY };
        container.style.cursor = 'grabbing';
        e.preventDefault();
      }
    });

    container.addEventListener('mousemove', (e) => {
      if (isPanning.current && lastPanPoint.current) {
        const dx = e.clientX - lastPanPoint.current.x;
        const dy = e.clientY - lastPanPoint.current.y;
        
        if (canvas.viewportTransform) {
          canvas.viewportTransform[4] += dx;
          canvas.viewportTransform[5] += dy;
          canvas.renderAll();
          
          // Update grid when panning
          createGrid(canvas);
        }
        
        lastPanPoint.current = { x: e.clientX, y: e.clientY };
        e.preventDefault();
      }
    });

    const endPanning = () => {
      if (isPanning.current) {
        isPanning.current = false;
        lastPanPoint.current = null;
        container.style.cursor = 'default';
      }
    };

    container.addEventListener('mouseup', endPanning);
    container.addEventListener('mouseleave', endPanning);
  };

  const setupZoomWithMouseWheel = (canvas: Canvas, container: HTMLDivElement) => {
    container.addEventListener('wheel', (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        
        const delta = e.deltaY;
        let zoom = canvas.getZoom();
        
        const mousePoint = new Point(e.offsetX, e.offsetY);
        
        zoom = delta > 0 ? zoom * 0.95 : zoom * 1.05;
        
        if (zoom > 20) zoom = 20;
        if (zoom < 0.1) zoom = 0.1;
        
        canvas.zoomToPoint(mousePoint, zoom);
        
        // Trigger our custom zoom event
        canvas.fire('zoom:changed');
        canvas.renderAll();
        
        return false;
      }
    }, { passive: false });
  };

  const createGrid = (canvas: Canvas) => {
    // Remove existing grid lines
    const existingGrids = canvas.getObjects().filter(obj => obj.data?.type === 'grid');
    existingGrids.forEach(grid => canvas.remove(grid));
    
    const gridSize = 20;
    const zoom = canvas.getZoom();
    
    // Calculate how far beyond the visible canvas we need to draw
    // to ensure grid covers entire viewable area when zoomed out
    const extraGridFactor = 3; // Draw grid 3x larger than visible area
    
    const width = (canvas.width || 1000) * extraGridFactor;
    const height = (canvas.height || 800) * extraGridFactor;
    
    // Calculate visible bounds and adjust grid center
    const viewportCenterX = canvas.width! / 2;
    const viewportCenterY = canvas.height! / 2;
    
    // Calculate adjusted grid origin to center it on the viewport
    const gridOriginX = viewportCenterX - width / 2;
    const gridOriginY = viewportCenterY - height / 2;
    
    // Calculate the number of grid lines needed
    const linesX = Math.ceil(width / (gridSize * zoom));
    const linesY = Math.ceil(height / (gridSize * zoom));
    
    // Calculate the offset to make sure grid lines align with the origin
    const offsetX = (viewportCenterX - canvas.viewportTransform![4]) % (gridSize * zoom);
    const offsetY = (viewportCenterY - canvas.viewportTransform![5]) % (gridSize * zoom);
    
    // Draw vertical lines
    for (let i = 0; i <= linesX; i++) {
      const lineX = gridOriginX + i * gridSize * zoom - offsetX;
      const line = new Line([lineX, gridOriginY, lineX, gridOriginY + height], {
        stroke: '#e0e0e0',
        selectable: false,
        evented: false,
        excludeFromExport: true,
        data: { type: 'grid' }
      });
      canvas.add(line);
      canvas.sendObjectToBack(line);
    }
    
    // Draw horizontal lines
    for (let i = 0; i <= linesY; i++) {
      const lineY = gridOriginY + i * gridSize * zoom - offsetY;
      const line = new Line([gridOriginX, lineY, gridOriginX + width, lineY], {
        stroke: '#e0e0e0',
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

  const enableSnapToGrid = (canvas: Canvas) => {
    const gridSize = 20;
    
    canvas.on('object:moving', (e) => {
      if (!e.target) return;
      
      const evt = e.e as MouseEvent;
      if (evt && evt.shiftKey) return;
      
      const target = e.target;
      
      target.set({
        left: Math.round(target.left! / gridSize) * gridSize,
        top: Math.round(target.top! / gridSize) * gridSize
      });
    });
    
    canvas.on('object:scaling', (e) => {
      if (!e.target) return;
      
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
