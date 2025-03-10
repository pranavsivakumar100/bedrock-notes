
import { Canvas, Object as FabricObject, Group, Line, IText, Rect, Circle, Triangle, Ellipse, Path, Polygon } from 'fabric';
import { toast } from 'sonner';

export interface CreateShapeOptions {
  canvas: Canvas | null;
  shapeType: string;
  setSelectedElement: (element: FabricObject | null) => void;
}

export const handleAddShape = ({ canvas, shapeType, setSelectedElement }: CreateShapeOptions) => {
  if (!canvas) {
    toast.error("Canvas not initialized");
    return;
  }
  
  let shape: FabricObject | null = null;
  const centerX = canvas.getWidth() / 2;
  const centerY = canvas.getHeight() / 2;
  
  switch (shapeType) {
    case 'rectangle':
      shape = new Rect({
        left: centerX - 50,
        top: centerY - 50,
        width: 100,
        height: 100,
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        objectCaching: false,
      });
      break;
      
    case 'square':
      shape = new Rect({
        left: centerX - 50,
        top: centerY - 50,
        width: 100,
        height: 100,
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        objectCaching: false,
      });
      break;
      
    case 'round-rectangle':
      shape = new Rect({
        left: centerX - 50,
        top: centerY - 50,
        width: 100,
        height: 70,
        rx: 10,
        ry: 10,
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        objectCaching: false,
      });
      break;
      
    case 'text-box':
      shape = new Rect({
        left: centerX - 60,
        top: centerY - 30,
        width: 120,
        height: 60,
        rx: 0,
        ry: 0,
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        objectCaching: false,
      });
      
      const text = new IText('Text', {
        left: centerX,
        top: centerY,
        originX: 'center',
        originY: 'center',
        fill: '#333333',
        fontSize: 16,
        fontFamily: 'Arial',
        objectCaching: false,
      });
      
      canvas.add(shape);
      canvas.add(text as unknown as FabricObject);
      canvas.setActiveObject(text as unknown as FabricObject);
      canvas.renderAll();
      setSelectedElement(text as unknown as FabricObject);
      toast.success(`Added text box`);
      return;
      
    case 'circle':
      shape = new Circle({
        left: centerX - 50,
        top: centerY - 50,
        radius: 50,
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        objectCaching: false,
      });
      break;
      
    case 'ellipse':
      shape = new Ellipse({
        left: centerX - 60,
        top: centerY - 40,
        rx: 60,
        ry: 40,
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        objectCaching: false,
      });
      break;
      
    case 'triangle':
      shape = new Triangle({
        left: centerX - 50,
        top: centerY - 50,
        width: 100,
        height: 100,
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        objectCaching: false,
      });
      break;
      
    case 'right-triangle':
      shape = new Polygon({
        left: centerX - 50,
        top: centerY - 50,
        points: [
          { x: 0, y: 0 },
          { x: 100, y: 100 },
          { x: 0, y: 100 }
        ],
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        objectCaching: false,
      });
      break;
      
    case 'diamond':
      shape = new Polygon({
        left: centerX - 50,
        top: centerY - 50,
        points: [
          { x: 50, y: 0 },
          { x: 100, y: 50 },
          { x: 50, y: 100 },
          { x: 0, y: 50 }
        ],
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        objectCaching: false,
      });
      break;
      
    case 'pentagon':
      shape = new Polygon({
        left: centerX - 50,
        top: centerY - 50,
        points: [
          { x: 50, y: 0 },
          { x: 100, y: 40 },
          { x: 80, y: 100 },
          { x: 20, y: 100 },
          { x: 0, y: 40 }
        ],
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        objectCaching: false,
      });
      break;
      
    case 'hexagon':
      shape = new Polygon({
        left: centerX - 50,
        top: centerY - 50,
        points: [
          { x: 25, y: 0 },
          { x: 75, y: 0 },
          { x: 100, y: 50 },
          { x: 75, y: 100 },
          { x: 25, y: 100 },
          { x: 0, y: 50 }
        ],
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        objectCaching: false,
      });
      break;
      
    case 'octagon':
      shape = new Polygon({
        left: centerX - 50,
        top: centerY - 50,
        points: [
          { x: 30, y: 0 },
          { x: 70, y: 0 },
          { x: 100, y: 30 },
          { x: 100, y: 70 },
          { x: 70, y: 100 },
          { x: 30, y: 100 },
          { x: 0, y: 70 },
          { x: 0, y: 30 }
        ],
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        objectCaching: false,
      });
      break;
      
    case 'trapezoid':
      shape = new Polygon({
        left: centerX - 50,
        top: centerY - 50,
        points: [
          { x: 20, y: 0 },
          { x: 80, y: 0 },
          { x: 100, y: 100 },
          { x: 0, y: 100 }
        ],
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        objectCaching: false,
      });
      break;
      
    case 'parallelogram':
      shape = new Polygon({
        left: centerX - 50,
        top: centerY - 50,
        points: [
          { x: 25, y: 0 },
          { x: 100, y: 0 },
          { x: 75, y: 100 },
          { x: 0, y: 100 }
        ],
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        objectCaching: false,
      });
      break;
      
    case 'cylinder':
      const cylinderRect = new Rect({
        left: 0,
        top: 15,
        width: 80,
        height: 70,
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
      });
      const topEllipse = new Ellipse({
        left: 0,
        top: 0,
        rx: 40,
        ry: 15,
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
      });
      const bottomEllipse = new Ellipse({
        left: 0,
        top: 70,
        rx: 40,
        ry: 15,
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
      });
      
      shape = new Group([cylinderRect, topEllipse, bottomEllipse], {
        left: centerX - 40,
        top: centerY - 50,
        objectCaching: false,
      });
      break;
      
    case 'document':
      const documentShape = new Polygon({
        points: [
          { x: 0, y: 0 },
          { x: 80, y: 0 },
          { x: 100, y: 20 },
          { x: 100, y: 100 },
          { x: 0, y: 100 }
        ],
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
      });
      
      const foldLine = new Line([80, 0, 100, 20], {
        stroke: '#333333',
        strokeWidth: 1,
      });
      
      shape = new Group([documentShape, foldLine], {
        left: centerX - 50,
        top: centerY - 50,
        objectCaching: false,
      });
      break;
      
    case 'cloud':
      const cloudPath = new Path('M25,60 C10,60 10,45 25,35 C10,35 10,10 40,10 C80,10 80,35 95,35 C95,50 95,60 80,60 Z', {
        left: centerX - 50,
        top: centerY - 35,
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        objectCaching: false,
      });
      shape = cloudPath;
      break;
      
    case 'speech-bubble':
      const speechBubblePath = new Path('M10,0 C0,0 0,10 0,10 L0,70 C0,80 10,80 10,80 L50,80 L60,100 L70,80 L90,80 C100,80 100,70 100,70 L100,10 C100,0 90,0 90,0 Z', {
        left: centerX - 50,
        top: centerY - 50,
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        objectCaching: false,
      });
      shape = speechBubblePath;
      break;
      
    case 'note':
      const notePath = new Path('M0,0 L70,0 L70,70 L85,55 L85,100 L0,100 Z', {
        left: centerX - 42.5,
        top: centerY - 50,
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
        objectCaching: false,
      });
      shape = notePath;
      break;
      
    case 'person':
      const head = new Circle({
        radius: 15,
        left: 0,
        top: 0,
        fill: '#f0f0f0',
        stroke: '#333333',
        strokeWidth: 1,
      });
      
      const body = new Line([15, 30, 15, 70], {
        stroke: '#333333',
        strokeWidth: 2,
      });
      
      const leftArm = new Line([15, 40, 0, 55], {
        stroke: '#333333',
        strokeWidth: 2,
      });
      
      const rightArm = new Line([15, 40, 30, 55], {
        stroke: '#333333',
        strokeWidth: 2,
      });
      
      const leftLeg = new Line([15, 70, 0, 100], {
        stroke: '#333333',
        strokeWidth: 2,
      });
      
      const rightLeg = new Line([15, 70, 30, 100], {
        stroke: '#333333',
        strokeWidth: 2,
      });
      
      shape = new Group([head, body, leftArm, rightArm, leftLeg, rightLeg], {
        left: centerX - 20,
        top: centerY - 50,
        objectCaching: false,
      });
      break;
      
    case 'arrow':
      const arrowLine = new Line([0, 0, 100, 0], {
        stroke: '#333333',
        strokeWidth: 2,
        objectCaching: false,
      });
      
      (arrowLine as any).strokeLineCap = 'round';
      (arrowLine as any).strokeLineJoin = 'round';
      
      const arrowHead = new Triangle({
        width: 16,
        height: 16,
        left: 100,
        top: 0,
        angle: 90,
        fill: '#333333',
        originX: 'center',
        originY: 'center',
      });
      
      shape = new Group([arrowLine, arrowHead], {
        left: centerX - 50,
        top: centerY,
        objectCaching: false,
      });
      break;
      
    case 'line':
      shape = new Line([0, 0, 100, 0], {
        stroke: '#333333',
        strokeWidth: 2,
        left: centerX - 50,
        top: centerY,
        objectCaching: false,
      });
      break;
      
    case 'curved-line':
      const curvedLinePath = new Path('M0,0 Q50,-50 100,0', {
        fill: '',
        stroke: '#333333',
        strokeWidth: 2,
        left: centerX - 50,
        top: centerY,
        objectCaching: false,
      });
      shape = curvedLinePath;
      break;
      
    case 'text':
      const textObject = new IText('Text', {
        left: centerX - 50,
        top: centerY - 25,
        fill: '#333333',
        fontSize: 20,
        fontFamily: 'Arial',
        objectCaching: false,
      });
      
      canvas.add(textObject as unknown as FabricObject);
      canvas.setActiveObject(textObject as unknown as FabricObject);
      canvas.renderAll();
      setSelectedElement(textObject as unknown as FabricObject);
      
      toast.success(`Added ${shapeType}`);
      return;
      
    default:
      toast.error("Unknown shape type");
      return;
  }
  
  if (shape) {
    canvas.add(shape);
    canvas.setActiveObject(shape);
    canvas.renderAll();
    setSelectedElement(shape);
    
    toast.success(`Added ${shapeType}`);
  }
};
