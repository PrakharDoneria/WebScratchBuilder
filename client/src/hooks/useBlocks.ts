import { useState, useCallback, useEffect } from 'react';
import { Block } from '@shared/schema';
import { createBlock } from '@/lib/blockUtils';

export default function useBlocks(initialBlocks: Block[] = [], projectId?: number) {
  // LocalStorage keys for saving blocks
  const BLOCKS_KEY = projectId 
    ? `html_editor_project_${projectId}_blocks` 
    : 'html_editor_draft_blocks';
  
  // Try to load blocks from localStorage first if available
  const loadInitialBlocks = (): Block[] => {
    try {
      if (typeof window !== 'undefined') {
        const savedBlocks = localStorage.getItem(BLOCKS_KEY);
        if (savedBlocks) {
          const parsedBlocks = JSON.parse(savedBlocks);
          if (Array.isArray(parsedBlocks) && parsedBlocks.length > 0) {
            console.log(`Loaded ${parsedBlocks.length} blocks from localStorage for key ${BLOCKS_KEY}`);
            return parsedBlocks;
          }
        }
      }
    } catch (e) {
      console.error('Failed to load blocks from localStorage:', e);
    }
    return initialBlocks;
  };

  const [blocks, setBlocks] = useState<Block[]>(loadInitialBlocks());
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  
  // Save blocks to localStorage whenever they change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && blocks.length > 0) {
        localStorage.setItem(BLOCKS_KEY, JSON.stringify(blocks));
        console.log(`Saved ${blocks.length} blocks to localStorage for key ${BLOCKS_KEY}`);
      }
    } catch (e) {
      console.error('Failed to save blocks to localStorage:', e);
    }
  }, [blocks, BLOCKS_KEY]);
  
  // When initialBlocks or projectId changes, update the blocks if needed
  useEffect(() => {
    // Only update if initialBlocks have content and are different from current blocks
    if (initialBlocks.length > 0 && JSON.stringify(initialBlocks) !== JSON.stringify(blocks)) {
      console.log('Updating blocks from initialBlocks');
      setBlocks(initialBlocks);
    }
  }, [initialBlocks, projectId]);
  
  // Add a new block to the canvas
  const addBlock = useCallback((blockType: string) => {
    const newBlock = createBlock(blockType);
    setBlocks(prevBlocks => {
      const updatedBlocks = [...prevBlocks, newBlock];
      return updatedBlocks;
    });
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
      setSelectedBlock((prevSelected: Block | null) => prevSelected ? { ...prevSelected, ...updates } : null);
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

  // Clear all blocks (useful for new projects)
  const clearBlocks = useCallback(() => {
    setBlocks([]);
    setSelectedBlock(null);
    localStorage.removeItem(BLOCKS_KEY);
  }, [BLOCKS_KEY]);
  
  return {
    blocks,
    setBlocks,
    selectedBlock,
    setSelectedBlock: selectBlockById,
    addBlock,
    updateBlock,
    removeBlock,
    moveBlock,
    clearBlocks
  };
}
