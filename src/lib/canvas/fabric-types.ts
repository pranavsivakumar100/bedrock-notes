
// Type definitions for fabric.js extensions
import { Canvas, Object as FabricObject, IText, util, XY, TPointerEvent, InteractiveFabricObject } from 'fabric';

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
  
  // Extend FabricObjectProps to include our custom data property
  interface FabricObjectProps {
    data?: {
      type?: string;
      [key: string]: any;
    };
  }
  
  interface Object {
    data?: {
      type?: string;
      [key: string]: any;
    };
    
    // Add missing method signatures
    clone(callback: (cloned: FabricObject) => void): void;
  }

  // Add proper type for calcLinePoints
  interface Line {
    calcLinePoints(): { x1: number; x2: number; y1: number; y2: number; };
  }

  // Instead of extending IText, use type casting helpers
  // This avoids the conflicting _setFillStyles property error
  
  // Add type casting helper
  namespace util {
    function createObject<T>(klass: any, options?: any): T;
  }
}
