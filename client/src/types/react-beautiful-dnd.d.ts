declare module 'react-beautiful-dnd' {
  import * as React from 'react';

  export type DraggableId = string;
  export type DroppableId = string;
  export type DraggableRubric = unknown;
  export type DroppableMode = 'standard' | 'virtual';

  export interface DraggableLocation {
    droppableId: DroppableId;
    index: number;
  }

  export interface DragStart {
    draggableId: DraggableId;
    type: string;
    source: DraggableLocation;
    mode: 'FLUID';
  }

  export interface DropResult {
    draggableId: DraggableId;
    type: string;
    source: DraggableLocation;
    destination: DraggableLocation | null;
    reason: 'DROP' | 'CANCEL';
    mode: 'FLUID';
    combine: null;
  }

  export interface ResponderProvided {
    announce: unknown;
  }

  export type OnDragEndResponder = (
    result: DropResult,
    provided: ResponderProvided,
  ) => void;

  export interface Responders {
    onDragEnd: OnDragEndResponder;
  }

  export interface DragDropContextProps {
    children: React.ReactNode;
    onDragEnd: OnDragEndResponder;
  }

  export interface DraggableStateSnapshot {
    isDragging: boolean;
    isDropAnimating: boolean;
    dropAnimation?: DropAnimation;
    draggingOver?: DroppableId;
    combineWith?: DraggableId;
    combineTargetFor?: DraggableId;
    mode?: 'FLUID' | 'SNAP';
  }

  export interface DropAnimation {
    duration: number;
    curve: string;
    moveTo: {
      x: number;
      y: number;
    };
    opacity?: number;
    scale?: number;
  }

  export interface DroppableStateSnapshot {
    isDraggingOver: boolean;
    draggingOverWith?: DraggableId;
    draggingFromThisWith?: DraggableId;
  }

  export interface DroppableProvided {
    innerRef: React.RefCallback<HTMLElement>;
    placeholder?: React.ReactNode;
    droppableProps: {
      'data-rbd-droppable-context-id': string;
      'data-rbd-droppable-id': string;
    };
  }

  export interface DraggableProvided {
    innerRef: React.RefCallback<HTMLElement>;
    draggableProps: {
      'data-rbd-draggable-context-id': string;
      'data-rbd-draggable-id': string;
    };
    dragHandleProps: {
      'data-rbd-drag-handle-context-id': string;
      'data-rbd-drag-handle-draggable-id': string;
      'aria-describedby': string;
      tabIndex: number;
      role: string;
      'aria-roledescription': string;
      draggable: boolean;
      onDragStart: React.DragEventHandler<HTMLElement>;
    } | null;
  }

  export const DragDropContext: React.ComponentClass<DragDropContextProps>;

  export interface DroppableProps {
    droppableId: DroppableId;
    children(provided: DroppableProvided, snapshot: DroppableStateSnapshot): React.ReactNode;
  }
  export const Droppable: React.ComponentClass<DroppableProps>;

  export interface DraggableProps {
    draggableId: DraggableId;
    index: number;
    children(provided: DraggableProvided, snapshot: DraggableStateSnapshot): React.ReactNode;
  }
  export const Draggable: React.ComponentClass<DraggableProps>;
}