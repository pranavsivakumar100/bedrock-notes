
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

    // Load diagram if ID is provided
    if (diagramId && diagramId !== 'new') {
      try {
        const diagram = getDiagram(diagramId);
        if (diagram && diagram.json) {
          canvas.loadFromJSON(diagram.json, canvas.renderAll.bind(canvas), (o, object) => {
            // Callback for each object loaded
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
    };

    window.addEventListener('resize', handleResize);

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.dispose();
    };
  }, [diagramId, setCanvas, setSelectedElement]);

  return (
    <div className="flex-1 overflow-auto p-4 bg-gray-50 dark:bg-gray-900">
      <div className="canvas-container drop-shadow-md">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

export default DiagramCanvas;
