export enum ElementType {
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  SHAPE = 'SHAPE',
}

export enum ShapeType {
  RECTANGLE = 'RECTANGLE',
  CIRCLE = 'CIRCLE',
  TRIANGLE = 'TRIANGLE',
}

export interface CanvasElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  zIndex: number;
  
  // Text specific
  content?: string;
  fontSize?: number;
  fontWeight?: string;
  fontStyle?: string; // 'normal' | 'italic'
  textDecoration?: string; // 'none' | 'underline' | 'line-through'
  fontFamily?: string;
  textAlign?: 'left' | 'center' | 'right';
  color?: string;

  // Shape/Image specific
  backgroundColor?: string;
  src?: string; // For images
  shapeType?: ShapeType;
  opacity?: number;
  borderRadius?: number;
}

export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
}

export interface ResizeState {
  isResizing: boolean;
  handle: string; // 'nw', 'ne', 'sw', 'se'
  startX: number;
  startY: number;
  initialX: number;
  initialY: number;
  initialWidth: number;
  initialHeight: number;
  initialFontSize?: number;
}

export interface Template {
  id: string;
  name: string;
  elements: CanvasElement[];
}