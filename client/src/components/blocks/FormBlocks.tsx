import { Block } from "@shared/schema";
import BlockWrapper from "./BlockWrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { FormInput, FormTextarea, Send } from "lucide-react";

// INPUT BLOCK
export function InputBlock({ 
  block, 
  isSelected, 
  onUpdate 
}: { 
  block: Block; 
  isSelected: boolean;
  onUpdate: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    label: "Input Label", 
    name: "input-name",
    type: "text",
    placeholder: "Enter value...",
    required: false,
  };

  return (
    <BlockWrapper 
      block={block} 
      isSelected={isSelected} 
      onUpdate={onUpdate}
    >
      <div className="w-full">
        {properties.label && (
          <label className="block text-sm font-medium mb-1">
            {properties.label}
            {properties.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        {properties.type === "textarea" ? (
          <textarea
            name={properties.name}
            placeholder={properties.placeholder}
            required={properties.required}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        ) : (
          <input
            type={properties.type}
            name={properties.name}
            placeholder={properties.placeholder}
            required={properties.required}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        )}
      </div>
    </BlockWrapper>
  );
}

export function InputProperties({ 
  block, 
  onChange 
}: { 
  block: Block; 
  onChange: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    label: "Input Label", 
    name: "input-name",
    type: "text",
    placeholder: "Enter value...",
    required: false,
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="input-label">Label</Label>
        <Input
          id="input-label"
          type="text"
          value={properties.label || ""}
          onChange={(e) => onChange({ 
            properties: { ...properties, label: e.target.value } 
          })}
          placeholder="Input Label"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="input-name">Input Name</Label>
        <Input
          id="input-name"
          type="text"
          value={properties.name || ""}
          onChange={(e) => onChange({ 
            properties: { ...properties, name: e.target.value } 
          })}
          placeholder="input-name"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="input-type">Input Type</Label>
        <Select
          value={properties.type || "text"}
          onValueChange={(value) => onChange({ 
            properties: { ...properties, type: value } 
          })}
        >
          <SelectTrigger id="input-type">
            <SelectValue placeholder="Select input type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">Text</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="password">Password</SelectItem>
            <SelectItem value="number">Number</SelectItem>
            <SelectItem value="tel">Telephone</SelectItem>
            <SelectItem value="url">URL</SelectItem>
            <SelectItem value="date">Date</SelectItem>
            <SelectItem value="textarea">Textarea</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="input-placeholder">Placeholder</Label>
        <Input
          id="input-placeholder"
          type="text"
          value={properties.placeholder || ""}
          onChange={(e) => onChange({ 
            properties: { ...properties, placeholder: e.target.value } 
          })}
          placeholder="Enter placeholder text..."
          className="mt-1"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="input-required"
          checked={properties.required === true}
          onCheckedChange={(checked) => onChange({ 
            properties: { ...properties, required: checked } 
          })}
        />
        <Label htmlFor="input-required">Required Field</Label>
      </div>
    </div>
  );
}

// BUTTON BLOCK
export function ButtonBlock({ 
  block, 
  isSelected, 
  onUpdate 
}: { 
  block: Block; 
  isSelected: boolean;
  onUpdate: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    text: "Submit", 
    type: "submit",
    variant: "primary",
    size: "medium",
  };

  // Determine button classes based on variant
  const variantClasses = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    success: "bg-green-500 text-white hover:bg-green-600",
    danger: "bg-red-500 text-white hover:bg-red-600",
    outline: "bg-transparent border border-blue-500 text-blue-500 hover:bg-blue-50",
  };

  // Determine button size classes
  const sizeClasses = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2",
    large: "px-6 py-3 text-lg",
  };

  const buttonClass = `${variantClasses[properties.variant as keyof typeof variantClasses] || variantClasses.primary} ${sizeClasses[properties.size as keyof typeof sizeClasses] || sizeClasses.medium} rounded font-medium focus:outline-none transition-colors`;

  return (
    <BlockWrapper 
      block={block} 
      isSelected={isSelected} 
      onUpdate={onUpdate}
    >
      <div className="flex justify-center">
        <button
          type={properties.type as "button" | "submit" | "reset"}
          className={buttonClass}
        >
          {properties.text}
        </button>
      </div>
    </BlockWrapper>
  );
}

export function ButtonProperties({ 
  block, 
  onChange 
}: { 
  block: Block; 
  onChange: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    text: "Submit", 
    type: "submit",
    variant: "primary",
    size: "medium",
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="button-text">Button Text</Label>
        <Input
          id="button-text"
          type="text"
          value={properties.text || ""}
          onChange={(e) => onChange({ 
            properties: { ...properties, text: e.target.value } 
          })}
          placeholder="Submit"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="button-type">Button Type</Label>
        <Select
          value={properties.type || "submit"}
          onValueChange={(value) => onChange({ 
            properties: { ...properties, type: value } 
          })}
        >
          <SelectTrigger id="button-type">
            <SelectValue placeholder="Select button type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="button">Button</SelectItem>
            <SelectItem value="submit">Submit</SelectItem>
            <SelectItem value="reset">Reset</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="button-variant">Style Variant</Label>
        <Select
          value={properties.variant || "primary"}
          onValueChange={(value) => onChange({ 
            properties: { ...properties, variant: value } 
          })}
        >
          <SelectTrigger id="button-variant">
            <SelectValue placeholder="Select style variant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="primary">Primary</SelectItem>
            <SelectItem value="secondary">Secondary</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="danger">Danger</SelectItem>
            <SelectItem value="outline">Outline</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="button-size">Size</Label>
        <Select
          value={properties.size || "medium"}
          onValueChange={(value) => onChange({ 
            properties: { ...properties, size: value } 
          })}
        >
          <SelectTrigger id="button-size">
            <SelectValue placeholder="Select button size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// FORM BLOCK
export function FormBlock({ 
  block, 
  isSelected, 
  onUpdate 
}: { 
  block: Block; 
  isSelected: boolean;
  onUpdate: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    action: "", 
    method: "post",
  };

  return (
    <BlockWrapper 
      block={block} 
      isSelected={isSelected} 
      onUpdate={onUpdate}
    >
      <form
        action={properties.action}
        method={properties.method}
        className="border border-dashed border-gray-300 rounded p-4 min-h-[200px] w-full"
      >
        <div className="text-center text-gray-500 text-sm mb-4">
          Form Block
          <div className="text-xs">Add input and button blocks inside</div>
        </div>
        
        {/* Placeholder for form elements */}
        <div className="space-y-4">
          <div className="border border-dotted border-gray-300 rounded p-3 bg-gray-50">
            <div className="text-xs text-gray-400 text-center">Input Field</div>
          </div>
          <div className="border border-dotted border-gray-300 rounded p-3 bg-gray-50">
            <div className="text-xs text-gray-400 text-center">Input Field</div>
          </div>
          <div className="flex justify-center">
            <div className="border border-dotted border-gray-300 rounded py-2 px-4 bg-gray-50 inline-block">
              <div className="text-xs text-gray-400 text-center">Submit Button</div>
            </div>
          </div>
        </div>
      </form>
    </BlockWrapper>
  );
}

export function FormProperties({ 
  block, 
  onChange 
}: { 
  block: Block; 
  onChange: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    action: "", 
    method: "post",
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="form-action">Form Action URL</Label>
        <Input
          id="form-action"
          type="text"
          value={properties.action || ""}
          onChange={(e) => onChange({ 
            properties: { ...properties, action: e.target.value } 
          })}
          placeholder="https://example.com/submit"
          className="mt-1"
        />
        <p className="text-xs text-gray-500 mt-1">Leave empty to submit to the current page</p>
      </div>

      <div>
        <Label htmlFor="form-method">Form Method</Label>
        <Select
          value={properties.method || "post"}
          onValueChange={(value) => onChange({ 
            properties: { ...properties, method: value } 
          })}
        >
          <SelectTrigger id="form-method">
            <SelectValue placeholder="Select form method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="get">GET</SelectItem>
            <SelectItem value="post">POST</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
