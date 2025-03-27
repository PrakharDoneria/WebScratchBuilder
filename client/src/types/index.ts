import { Block } from '@shared/schema';

// Editor interfaces
export interface BlockEditorProps {
  block: Block;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  removeBlock: (id: string) => void;
  isSelected: boolean;
  selectBlock: (id: string | null) => void;
}

export interface CanvasProps {
  blocks: Block[];
  updateBlock: (id: string, updates: Partial<Block>) => void;
  removeBlock: (id: string) => void;
  moveBlock: (sourceIndex: number, destinationIndex: number) => void;
  selectedBlockId: string | null;
  selectBlock: (id: string | null) => void;
  device: 'desktop' | 'tablet' | 'mobile';
}

export interface BlockPaletteProps {
  addBlock: (type: string) => void;
}

export interface PropertyPanelProps {
  selectedBlock: Block | null;
  updateBlock: (id: string, updates: Partial<Block>) => void;
  html: string;
}

// Device viewport sizes
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

export interface DeviceViewport {
  label: string;
  width: string;
  height: string;
  icon: React.ComponentType;
}

// Project types
export interface ProjectFormData {
  name: string;
  description: string;
}

export interface PreviewSettings {
  device: DeviceType;
  zoom: number;
}
