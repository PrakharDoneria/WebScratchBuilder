import React from "react";
import { Block } from "@shared/schema";

// Import block components
import {
  HeadingBlock,
  ParagraphBlock,
  ListBlock,
  HeadingProperties,
  ParagraphProperties,
  ListProperties
} from "./TextBlocks";

import {
  ImageBlock,
  VideoBlock,
  ImageProperties,
  VideoProperties
} from "./MediaBlocks";

import {
  ContainerBlock,
  SectionBlock,
  RowBlock,
  ContainerProperties,
  SectionProperties,
  RowProperties
} from "./StructureBlocks";

import {
  InputBlock,
  ButtonBlock,
  FormBlock,
  InputProperties,
  ButtonProperties,
  FormProperties
} from "./FormBlocks";

import {
  CustomHtmlBlock,
  LinkBlock,
  CustomHtmlProperties,
  LinkProperties
} from "./AdvancedBlocks";

import BlockWrapper from "./BlockWrapper";

// Block rendering mapping
const blockComponents: Record<string, React.FC<{ block: Block; isSelected: boolean; onUpdate: (updates: Partial<Block>) => void }>> = {
  heading: HeadingBlock,
  paragraph: ParagraphBlock,
  list: ListBlock,
  image: ImageBlock,
  video: VideoBlock,
  container: ContainerBlock,
  section: SectionBlock,
  row: RowBlock,
  input: InputBlock,
  button: ButtonBlock,
  form: FormBlock,
  customHtml: CustomHtmlBlock,
  link: LinkBlock,
};

// Block property editors mapping
const blockPropertyEditors: Record<string, React.FC<{ block: Block; onChange: (updates: Partial<Block>) => void }>> = {
  heading: HeadingProperties,
  paragraph: ParagraphProperties,
  list: ListProperties,
  image: ImageProperties,
  video: VideoProperties,
  container: ContainerProperties,
  section: SectionProperties,
  row: RowProperties,
  input: InputProperties,
  button: ButtonProperties,
  form: FormProperties,
  customHtml: CustomHtmlProperties,
  link: LinkProperties,
};

export function renderBlock(
  block: Block,
  { isSelected, onUpdate }: { isSelected: boolean; onUpdate: (updates: Partial<Block>) => void }
) {
  const BlockComponent = blockComponents[block.type];
  
  if (!BlockComponent) {
    return React.createElement('div', {}, `Unknown block type: ${block.type}`);
  }
  
  return React.createElement(BlockComponent, { block, isSelected, onUpdate });
}

export function getBlockProperties(blockType: string) {
  return blockPropertyEditors[blockType] || null;
}

export {
  HeadingBlock,
  ParagraphBlock,
  ListBlock,
  ImageBlock,
  VideoBlock,
  ContainerBlock,
  SectionBlock,
  RowBlock,
  InputBlock,
  ButtonBlock,
  FormBlock,
  CustomHtmlBlock,
  LinkBlock,
  BlockWrapper
};
