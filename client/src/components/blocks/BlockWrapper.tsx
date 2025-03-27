import React from "react";
import { Block } from "@shared/schema";

interface BlockWrapperProps {
  block: Block;
  isSelected: boolean;
  onUpdate: (updates: Partial<Block>) => void;
  children: React.ReactNode;
  className?: string;
}

export default function BlockWrapper({
  block,
  isSelected,
  onUpdate,
  children,
  className = "",
}: BlockWrapperProps) {
  return (
    <div 
      className={`block-wrapper ${className} ${isSelected ? 'ring-2 ring-blue-200' : ''}`}
      data-block-id={block.id}
      data-block-type={block.type}
    >
      {children}
    </div>
  );
}
