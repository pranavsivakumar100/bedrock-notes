
// Type definitions for fabric.js extensions
import { Canvas, Object as FabricObject } from 'fabric';

// Extend Canvas events to add our custom events
declare module 'fabric' {
  interface CanvasEvents {
    'zoom:changed': any;
    'pan:moved': any;
  }
  
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
  
  // Add correct Path type extensions
  interface Path {
    path: string | Array<{ x: number; y: number; }>;
  }
}
