
import { Canvas } from 'fabric';
import { createGrid } from './grid-utils';

// Setup panning functionality for the canvas
export const setupPanning = (
  canvas: Canvas, 
  container: HTMLDivElement,
  isPanning: React.MutableRefObject<boolean>,
  lastPanPoint: React.MutableRefObject<{ x: number, y: number } | null>
) => {
  // Prevent context menu from appearing during panning
  container.addEventListener('contextmenu', (e) => {
    if (isPanning.current || e.ctrlKey) {
      e.preventDefault();
      return false;
    }
  });

  container.addEventListener('mousedown', (e) => {
    // Only trigger panning on mouse button with Ctrl key
    if (e.ctrlKey) {
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
        canvas.requestRenderAll();
        
        // Trigger pan event for other components to react
        canvas.fire('pan:moved', { dx, dy });
        
        // Update grid when panning
        createGrid(canvas);
      }
      
      lastPanPoint.current = { x: e.clientX, y: e.clientY };
      e.preventDefault();
    }
  });

  const endPanning = (e: MouseEvent) => {
    if (isPanning.current) {
      isPanning.current = false;
      lastPanPoint.current = null;
      container.style.cursor = 'default';
      e.preventDefault();
    }
  };

  container.addEventListener('mouseup', endPanning);
  container.addEventListener('mouseleave', endPanning);
};
