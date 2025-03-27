import { Block } from '@shared/schema';

// Generate HTML from block structure
export function generateHtml(blocks: Block[]): string {
  const doctype = '<!DOCTYPE html>\n';
  const htmlStart = '<html>\n<head>\n  <title>BlockHTML Generated Page</title>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <style>\n    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; }\n  </style>\n</head>\n<body>\n';
  const htmlEnd = '</body>\n</html>';

  // Convert blocks to HTML
  const bodyContent = blocks.map(block => renderBlockToHtml(block)).join('\n');

  return doctype + htmlStart + bodyContent + htmlEnd;
}

// Render a single block to HTML
function renderBlockToHtml(block: Block): string {
  switch (block.type) {
    case 'heading':
      return renderHeadingBlock(block);
    case 'paragraph':
      return renderParagraphBlock(block);
    case 'list':
      return renderListBlock(block);
    case 'image':
      return renderImageBlock(block);
    case 'video':
      return renderVideoBlock(block);
    case 'container':
      return renderContainerBlock(block);
    case 'section':
      return renderSectionBlock(block);
    case 'row':
      return renderRowBlock(block);
    case 'input':
      return renderInputBlock(block);
    case 'button':
      return renderButtonBlock(block);
    case 'form':
      return renderFormBlock(block);
    case 'customHtml':
      return block.content || '';
    case 'link':
      return renderLinkBlock(block);
    default:
      return `<!-- Unknown block type: ${block.type} -->`;
  }
}

// Helper for escaping HTML
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Render functions for each block type
function renderHeadingBlock(block: Block): string {
  const properties = block.properties || { level: 2, align: 'left' };
  const content = block.content || '';
  const level = properties.level || 2;
  const alignStyle = properties.align !== 'left' ? ` style="text-align: ${properties.align};"` : '';
  return `<h${level}${alignStyle}>${content}</h${level}>`;
}

function renderParagraphBlock(block: Block): string {
  const properties = block.properties || { align: 'left' };
  const content = block.content || '';
  const alignStyle = properties.align !== 'left' ? ` style="text-align: ${properties.align};"` : '';
  return `<p${alignStyle}>${content}</p>`;
}

function renderListBlock(block: Block): string {
  const properties = block.properties || { type: 'unordered' };
  const items = block.content || [''];
  const listType = properties.type === 'ordered' ? 'ol' : 'ul';
  
  const listItems = items
    .map(item => `  <li>${item}</li>`)
    .join('\n');
  
  return `<${listType}>\n${listItems}\n</${listType}>`;
}

function renderImageBlock(block: Block): string {
  const properties = block.properties || { 
    src: '', 
    alt: '', 
    width: '100%', 
    height: 'auto',
    align: 'center' 
  };
  
  const src = properties.src || '';
  const alt = properties.alt || '';
  const width = properties.width || '100%';
  const height = properties.height === 'auto' ? 'auto' : properties.height || 'auto';
  const align = properties.align || 'center';

  let alignWrapper = '';
  if (align === 'center') {
    alignWrapper = '<div style="text-align: center;">';
  } else if (align === 'right') {
    alignWrapper = '<div style="text-align: right;">';
  } else {
    alignWrapper = '<div>';
  }

  return `${alignWrapper}\n  <img src="${src}" alt="${alt}" style="width: ${width}; height: ${height}; max-width: 100%;">\n</div>`;
}

function renderVideoBlock(block: Block): string {
  const properties = block.properties || { 
    src: '', 
    type: 'youtube', 
    width: '100%', 
    height: '315',
    controls: true,
    autoplay: false
  };
  
  const src = properties.src || '';
  const width = properties.width || '100%';
  const height = properties.height || '315';

  if (properties.type === 'youtube') {
    // Extract YouTube ID from URL
    const getYoutubeId = (url: string) => {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = url.match(regExp);
      return (match && match[2].length === 11) ? match[2] : null;
    };

    const youtubeId = getYoutubeId(src);
    if (!youtubeId) return '<!-- Invalid YouTube URL -->';

    return `<div style="text-align: center;">\n  <iframe width="${width}" height="${height}" src="https://www.youtube.com/embed/${youtubeId}${properties.autoplay ? '?autoplay=1' : ''}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>\n</div>`;
  } else {
    return `<div style="text-align: center;">\n  <video src="${src}" width="${width}" height="${height}" ${properties.controls ? 'controls' : ''} ${properties.autoplay ? 'autoplay' : ''}></video>\n</div>`;
  }
}

function renderContainerBlock(block: Block): string {
  const properties = block.properties || { 
    maxWidth: '100%', 
    padding: '1rem',
    margin: '0 auto',
    backgroundColor: '',
    textColor: '',
  };

  const style = `max-width: ${properties.maxWidth}; padding: ${properties.padding}; margin: ${properties.margin};${properties.backgroundColor ? ` background-color: ${properties.backgroundColor};` : ''}${properties.textColor ? ` color: ${properties.textColor};` : ''}`;

  return `<div style="${style}">\n  <!-- Container content here -->\n</div>`;
}

function renderSectionBlock(block: Block): string {
  const properties = block.properties || { 
    height: 'auto', 
    padding: '2rem 1rem',
    backgroundColor: '',
    backgroundImage: '',
  };

  let backgroundStyle = '';
  if (properties.backgroundImage) {
    backgroundStyle = ` background-image: url(${properties.backgroundImage}); background-size: cover; background-position: center;`;
  }

  const style = `height: ${properties.height}; padding: ${properties.padding};${properties.backgroundColor ? ` background-color: ${properties.backgroundColor};` : ''}${backgroundStyle}`;

  return `<section style="${style}">\n  <!-- Section content here -->\n</section>`;
}

function renderRowBlock(block: Block): string {
  const properties = block.properties || { 
    columns: 2, 
    gap: '1rem',
    alignment: 'stretch',
  };

  const columns = properties.columns || 2;
  const style = `display: grid; grid-template-columns: repeat(${columns}, 1fr); gap: ${properties.gap}; align-items: ${properties.alignment};`;
  
  let columnHtml = '';
  for (let i = 0; i < columns; i++) {
    columnHtml += `  <div><!-- Column ${i + 1} content --></div>\n`;
  }

  return `<div style="${style}">\n${columnHtml}</div>`;
}

function renderInputBlock(block: Block): string {
  const properties = block.properties || { 
    label: 'Input Label', 
    name: 'input-name',
    type: 'text',
    placeholder: 'Enter value...',
    required: false,
  };

  const name = properties.name || 'input-name';
  const label = properties.label || '';
  const type = properties.type === 'textarea' ? 'textarea' : properties.type || 'text';
  const placeholder = properties.placeholder || '';
  const required = properties.required ? ' required' : '';

  let labelHtml = '';
  if (label) {
    labelHtml = `<label for="${name}" style="display: block; margin-bottom: 0.5rem; font-weight: 500;">${label}${required ? ' <span style="color: #dc2626;">*</span>' : ''}</label>\n  `;
  }

  if (type === 'textarea') {
    return `<div style="margin-bottom: 1rem;">\n  ${labelHtml}<textarea name="${name}" id="${name}" placeholder="${placeholder}"${required} style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.25rem;"></textarea>\n</div>`;
  } else {
    return `<div style="margin-bottom: 1rem;">\n  ${labelHtml}<input type="${type}" name="${name}" id="${name}" placeholder="${placeholder}"${required} style="width: 100%; padding: 0.5rem; border: 1px solid #d1d5db; border-radius: 0.25rem;">\n</div>`;
  }
}

function renderButtonBlock(block: Block): string {
  const properties = block.properties || { 
    text: 'Submit', 
    type: 'submit',
    variant: 'primary',
    size: 'medium',
  };

  const text = properties.text || 'Submit';
  const type = properties.type || 'submit';
  const variant = properties.variant || 'primary';
  const size = properties.size || 'medium';

  // Style based on variant
  let style = '';
  switch (variant) {
    case 'primary':
      style = 'background-color: #3b82f6; color: white; border: none;';
      break;
    case 'secondary':
      style = 'background-color: #e5e7eb; color: #1f2937; border: none;';
      break;
    case 'success':
      style = 'background-color: #10b981; color: white; border: none;';
      break;
    case 'danger':
      style = 'background-color: #ef4444; color: white; border: none;';
      break;
    case 'outline':
      style = 'background-color: transparent; color: #3b82f6; border: 1px solid #3b82f6;';
      break;
    default:
      style = 'background-color: #3b82f6; color: white; border: none;';
  }

  // Add size styles
  switch (size) {
    case 'small':
      style += ' padding: 0.25rem 0.5rem; font-size: 0.875rem;';
      break;
    case 'medium':
      style += ' padding: 0.5rem 1rem; font-size: 1rem;';
      break;
    case 'large':
      style += ' padding: 0.75rem 1.5rem; font-size: 1.125rem;';
      break;
    default:
      style += ' padding: 0.5rem 1rem; font-size: 1rem;';
  }

  // Add common styles
  style += ' border-radius: 0.25rem; font-weight: 500; cursor: pointer; transition: all 0.2s;';

  return `<div style="text-align: center;">\n  <button type="${type}" style="${style}">${text}</button>\n</div>`;
}

function renderFormBlock(block: Block): string {
  const properties = block.properties || { 
    action: '', 
    method: 'post',
  };

  const action = properties.action || '';
  const method = properties.method || 'post';

  return `<form action="${action}" method="${method}">\n  <!-- Form inputs here -->\n</form>`;
}

function renderLinkBlock(block: Block): string {
  const properties = block.properties || { 
    href: '#', 
    target: '_self',
    style: 'default'
  };
  const content = block.content || 'Click here';
  const href = properties.href || '#';
  const target = properties.target || '_self';
  
  // Style based on variant
  let style = '';
  switch (properties.style) {
    case 'default':
      style = 'color: #3b82f6; text-decoration: none;';
      break;
    case 'button':
      style = 'display: inline-block; padding: 0.5rem 1rem; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 0.25rem;';
      break;
    case 'underlined':
      style = 'color: #3b82f6; text-decoration: underline;';
      break;
    case 'subtle':
      style = 'color: #6b7280; text-decoration: none;';
      break;
    default:
      style = 'color: #3b82f6; text-decoration: none;';
  }

  return `<a href="${href}" target="${target}" style="${style}">${content}${target === '_blank' ? ' <span style="font-size: 0.75em;">↗</span>' : ''}</a>`;
}
