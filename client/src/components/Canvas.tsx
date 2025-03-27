import { useRef } from "react";
import { 
  DragDropContext, 
  Droppable, 
  Draggable, 
  DroppableProvided, 
  DraggableProvided, 
  DraggableStateSnapshot, 
  DropResult 
} from "react-beautiful-dnd";
import { type Block } from "@shared/schema";
import { renderBlock } from "@/components/blocks";
import { AlertCircle, GripVertical, Trash2 } from "lucide-react";

interface CanvasProps {
  blocks: Block[];
  device: "desktop" | "tablet" | "mobile";
  selectedBlockId: string | null;
  onSelectBlock: (id: string | null) => void;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onRemoveBlock: (id: string) => void;
  onMoveBlock: (sourceIndex: number, destinationIndex: number) => void;
}

export default function Canvas({
  blocks,
  device,
  selectedBlockId,
  onSelectBlock,
  onUpdateBlock,
  onRemoveBlock,
  onMoveBlock,
}: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);

  // Handle dropping blocks from palette or moving blocks within canvas
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    onMoveBlock(result.source.index, result.destination.index);
  };

  // Device width classes
  const deviceClasses = {
    desktop: "max-w-4xl",
    tablet: "max-w-md",
    mobile: "max-w-xs"
  };

  return (
    <div className="flex-1 overflow-auto p-6 scrollbar-styled" ref={canvasRef}>
      <div 
        className={`${deviceClasses[device]} mx-auto bg-card dark:bg-slate-950 rounded-lg shadow-md border border-border min-h-[600px] p-6 transition-all duration-300`}
        onDragOver={(e) => e.preventDefault()}
      >
        {blocks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-10">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-medium text-foreground mb-2">Start Building Your HTML</h3>
            <p className="text-muted-foreground max-w-md mb-6">Drag blocks from the palette on the left and drop them here to build your page structure.</p>
            <div className="flex items-center space-x-2 text-sm">
              <div className="text-muted-foreground">←</div>
              <span className="text-muted-foreground">Drag from palette</span>
            </div>
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="canvas">
              {(provided: DroppableProvided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-3"
                >
                  {blocks.map((block, index) => (
                    <Draggable key={block.id} draggableId={block.id} index={index}>
                      {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`block bg-background dark:bg-slate-900 border ${
                            selectedBlockId === block.id
                              ? "border-primary ring-2 ring-primary/20"
                              : "border-border"
                          } rounded p-3 mb-3 hover:border-primary/50 transition-colors ${
                            snapshot.isDragging ? "opacity-70" : ""
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectBlock(block.id);
                          }}
                        >
                          <div className="flex items-start">
                            <div className="flex-1">
                              {renderBlock(block, {
                                isSelected: selectedBlockId === block.id,
                                onUpdate: (updates) => onUpdateBlock(block.id, updates),
                              })}
                            </div>
                            <div className="flex items-center ml-2">
                              <div
                                {...provided.dragHandleProps}
                                className="p-1 text-muted-foreground hover:text-foreground cursor-grab"
                              >
                                <GripVertical className="h-4 w-4" />
                              </div>
                              <button
                                className="p-1 text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveBlock(block.id);
                                }}
                                aria-label="Remove block"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M3 6h18"></path>
                                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
    </div>
  );
}
