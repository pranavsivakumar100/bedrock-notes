
import { Canvas, Point } from 'fabric';
import { createGrid } from './grid-utils';

// Setup zoom with mouse wheel functionality
export const setupZoomWithMouseWheel = (canvas: Canvas, container: HTMLDivElement) => {
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
