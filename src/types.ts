export type ElementType = 'rect' | 'ellipse' | 'image' | 'text';

export interface BaseElement {
  id: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  locked: boolean;
  hidden: boolean;
}

export interface ShapeElement extends BaseElement {
  type: 'rect' | 'ellipse';
  fill: string;
  stroke: string;
  strokeWidth: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string; // Base64 data URL
  cropX?: number;
  cropY?: number;
  cropWidth?: number;
  cropHeight?: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  fontStyle: string; // 'normal' | 'italic' | 'bold' | 'italic bold'
  align: 'left' | 'center' | 'right';
  fill: string;
  stroke?: string;
  strokeWidth?: number;
  lineHeight: number;
  letterSpacing: number;
  shadowColor?: string;
  shadowBlur?: number;
  shadowOffsetX?: number;
  shadowOffsetY?: number;
  shadowOpacity?: number;
}

export type EditorElement = ShapeElement | ImageElement | TextElement;

export interface Scene {
  width: number;
  height: number;
  backgroundColor: string;
  elements: EditorElement[];
}
