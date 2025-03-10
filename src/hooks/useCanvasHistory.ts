
import { useState, useCallback, useEffect } from 'react';
import { Canvas } from 'fabric';
import { toast } from 'sonner';

export function useCanvasHistory(canvas: Canvas | null) {
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  const [currentState, setCurrentState] = useState<string | null>(null);

  // Initialize canvas state
  useEffect(() => {
    if (canvas) {
      try {
        const initialState = JSON.stringify(canvas.toJSON());
        setUndoStack([initialState]);
        setCurrentState(initialState);
      } catch (error) {
        console.error("Error initializing canvas history:", error);
      }
    }
  }, [canvas]);

  // Capture state on canvas changes
  useEffect(() => {
    if (!canvas) return;
    
    const captureCanvasState = () => {
      if (canvas) {
        try {
          const jsonState = JSON.stringify(canvas.toJSON());
          
          // Only add to undo stack if state has changed
          if (jsonState !== currentState) {
            setUndoStack(prev => [...prev, jsonState]);
            setRedoStack([]);
            setCurrentState(jsonState);
          }
        } catch (error) {
          console.error("Error capturing canvas state:", error);
        }
      }
    };
    
    canvas.on('object:modified', captureCanvasState);
    canvas.on('object:added', captureCanvasState);
    canvas.on('object:removed', captureCanvasState);
    
    return () => {
      canvas.off('object:modified', captureCanvasState);
      canvas.off('object:added', captureCanvasState);
      canvas.off('object:removed', captureCanvasState);
    };
  }, [canvas, currentState]);

  const undo = useCallback(() => {
    if (!canvas) return;
    
    if (undoStack.length <= 1) {
      toast.info("Nothing to undo");
      return;
    }
    
    try {
      const currentState = undoStack[undoStack.length - 1];
      const previousState = undoStack[undoStack.length - 2];
      
      setRedoStack(prev => [...prev, currentState]);
      setUndoStack(prev => prev.slice(0, -1));
      setCurrentState(previousState);
      
      canvas.loadFromJSON(previousState, () => {
        canvas.renderAll();
      });
    } catch (error) {
      console.error("Error during undo operation:", error);
      toast.error("Undo operation failed");
    }
  }, [canvas, undoStack]);

  const redo = useCallback(() => {
    if (!canvas) return;
    
    if (redoStack.length === 0) {
      toast.info("Nothing to redo");
      return;
    }
    
    try {
      const nextState = redoStack[redoStack.length - 1];
      
      setUndoStack(prev => [...prev, nextState]);
      setRedoStack(prev => prev.slice(0, -1));
      setCurrentState(nextState);
      
      canvas.loadFromJSON(nextState, () => {
        canvas.renderAll();
      });
    } catch (error) {
      console.error("Error during redo operation:", error);
      toast.error("Redo operation failed");
    }
  }, [canvas, redoStack]);

  return { undo, redo };
}
