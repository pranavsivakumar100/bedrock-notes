
import { Canvas, Line, FabricObject, Point } from 'fabric';

// Create a grid on the canvas
export const createGrid = (canvas: Canvas) => {
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

// Enable snap to grid functionality
export const enableSnapToGrid = (canvas: Canvas) => {
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
