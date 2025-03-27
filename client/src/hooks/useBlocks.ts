import { useState, useCallback } from 'react';
import { Block } from '@shared/schema';
import { createBlock } from '@/lib/blockUtils';

export default function useBlocks(initialBlocks: Block[] = []) {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  
  // Add a new block to the canvas
  const addBlock = useCallback((blockType: string) => {
    const newBlock = createBlock(blockType);
    setBlocks(prevBlocks => [...prevBlocks, newBlock]);
    setSelectedBlock(newBlock);
    return newBlock;
  }, []);
  
  // Update an existing block
  const updateBlock = useCallback((id: string, updates: Partial<Block>) => {
    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === id ? { ...block, ...updates } : block
      )
    );
    
    // Also update the selected block if it's the one being modified
    if (selectedBlock?.id === id) {
      setSelectedBlock(prevSelected => prevSelected ? { ...prevSelected, ...updates } : null);
    }
  }, [selectedBlock]);
  
  // Remove a block from the canvas
  const removeBlock = useCallback((id: string) => {
    setBlocks(prevBlocks => prevBlocks.filter(block => block.id !== id));
    
    // Clear selected block if it's the one being removed
    if (selectedBlock?.id === id) {
      setSelectedBlock(null);
    }
  }, [selectedBlock]);
  
  // Move a block in the canvas (reorder)
  const moveBlock = useCallback((sourceIndex: number, destinationIndex: number) => {
    setBlocks(prevBlocks => {
      const result = Array.from(prevBlocks);
      const [removed] = result.splice(sourceIndex, 1);
      result.splice(destinationIndex, 0, removed);
      return result;
    });
  }, []);
  
  // Select a block by ID
  const selectBlockById = useCallback((id: string | null) => {
    if (id === null) {
      setSelectedBlock(null);
      return;
    }
    
    const block = blocks.find(b => b.id === id) || null;
    setSelectedBlock(block);
  }, [blocks]);
  
  return {
    blocks,
    setBlocks,
    selectedBlock,
    setSelectedBlock: selectBlockById,
    addBlock,
    updateBlock,
    removeBlock,
    moveBlock
  };
}
