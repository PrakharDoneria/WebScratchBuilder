import { nanoid } from 'nanoid';
import { Block } from '@shared/schema';
import {
  Heading,
  AlignLeft,
  Image,
  Video,
  Layout,
  Columns,
  FormInput,
  Send,
  File,
  Code,
  Link,
  ListOrdered
} from 'lucide-react';

export type BlockData = {
  type: string;
  name: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  defaultContent?: any;
  defaultProperties?: Record<string, any>;
};

// Block categories with their included blocks
export const blockCategories = [
  {
    id: 'structure',
    name: 'Structure',
    icon: Layout,
    blocks: [
      {
        type: 'container',
        name: 'Container',
        icon: Layout,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-100',
        defaultProperties: {
          maxWidth: '100%',
          padding: '1rem',
          margin: '0 auto',
          backgroundColor: '',
          textColor: '',
        }
      },
      {
        type: 'section',
        name: 'Section',
        icon: Layout,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-100',
        defaultProperties: {
          height: 'auto',
          padding: '2rem 1rem',
          backgroundColor: '',
          backgroundImage: '',
        }
      },
      {
        type: 'row',
        name: 'Row',
        icon: Columns,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-100',
        defaultProperties: {
          columns: 2,
          gap: '1rem',
          alignment: 'stretch',
        }
      }
    ]
  },
  {
    id: 'text',
    name: 'Text',
    icon: AlignLeft,
    blocks: [
      {
        type: 'heading',
        name: 'Heading',
        icon: Heading,
        iconColor: 'text-green-500',
        iconBg: 'bg-green-100',
        defaultContent: 'Sample Heading',
        defaultProperties: {
          level: 2,
          align: 'left'
        }
      },
      {
        type: 'paragraph',
        name: 'Paragraph',
        icon: AlignLeft,
        iconColor: 'text-green-500',
        iconBg: 'bg-green-100',
        defaultContent: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.',
        defaultProperties: {
          align: 'left'
        }
      },
      {
        type: 'list',
        name: 'List',
        icon: ListOrdered,
        iconColor: 'text-green-500',
        iconBg: 'bg-green-100',
        defaultContent: ['Item 1', 'Item 2', 'Item 3'],
        defaultProperties: {
          type: 'unordered'
        }
      }
    ]
  },
  {
    id: 'media',
    name: 'Media',
    icon: Image,
    blocks: [
      {
        type: 'image',
        name: 'Image',
        icon: Image,
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-100',
        defaultProperties: {
          src: '',
          alt: '',
          width: '100%',
          height: 'auto',
          align: 'center'
        }
      },
      {
        type: 'video',
        name: 'Video',
        icon: Video,
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-100',
        defaultProperties: {
          src: '',
          type: 'youtube',
          width: '100%',
          height: '315',
          controls: true,
          autoplay: false
        }
      }
    ]
  },
  {
    id: 'forms',
    name: 'Forms',
    icon: File,
    blocks: [
      {
        type: 'input',
        name: 'Input Field',
        icon: FormInput,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-100',
        defaultProperties: {
          label: 'Input Label',
          name: 'input-name',
          type: 'text',
          placeholder: 'Enter value...',
          required: false,
        }
      },
      {
        type: 'button',
        name: 'Button',
        icon: Send,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-100',
        defaultProperties: {
          text: 'Submit',
          type: 'submit',
          variant: 'primary',
          size: 'medium',
        }
      },
      {
        type: 'form',
        name: 'Form',
        icon: File,
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-100',
        defaultProperties: {
          action: '',
          method: 'post',
        }
      }
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced',
    icon: Code,
    blocks: [
      {
        type: 'customHtml',
        name: 'Custom HTML',
        icon: Code,
        iconColor: 'text-white',
        iconBg: 'bg-gray-700',
        defaultContent: '<div>Custom HTML goes here</div>'
      },
      {
        type: 'link',
        name: 'Link',
        icon: Link,
        iconColor: 'text-white',
        iconBg: 'bg-gray-700',
        defaultContent: 'Click here',
        defaultProperties: {
          href: '#',
          target: '_self',
          style: 'default'
        }
      }
    ]
  }
];

// Flat list of all blocks for easy lookup
export const allBlocks = blockCategories.flatMap(category => category.blocks);

// Function to find block data by type
export const getBlockDataByType = (type: string): BlockData | undefined => {
  return allBlocks.find(block => block.type === type);
};

// Create a new block of the specified type
export const createBlock = (type: string): Block => {
  const blockData = getBlockDataByType(type);
  if (!blockData) {
    throw new Error(`Unknown block type: ${type}`);
  }

  return {
    id: nanoid(),
    type: blockData.type,
    content: blockData.defaultContent,
    properties: blockData.defaultProperties,
    children: [],
  };
};

// Get default content for a block type
export const getDefaultContent = (type: string): any => {
  const blockData = getBlockDataByType(type);
  return blockData?.defaultContent;
};

// Get default properties for a block type
export const getDefaultProperties = (type: string): Record<string, any> | undefined => {
  const blockData = getBlockDataByType(type);
  return blockData?.defaultProperties;
};
