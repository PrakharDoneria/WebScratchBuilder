import { useState } from "react";
import { Block } from "@shared/schema";
import BlockWrapper from "./BlockWrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading, ListOrdered, AlignLeft, AlignCenter, AlignRight, Plus, Minus } from "lucide-react";

// HEADING BLOCK
export function HeadingBlock({ 
  block, 
  isSelected, 
  onUpdate 
}: { 
  block: Block; 
  isSelected: boolean;
  onUpdate: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { level: 2, align: "left" };
  const content = block.content || "Sample Heading";

  const handleChange = (e: React.ChangeEvent<HTMLHeadingElement>) => {
    onUpdate({ content: e.currentTarget.textContent || "" });
  };

  // Render heading based on level
  const renderHeading = () => {
    const className = `font-bold ${properties.align === "center" ? "text-center" : ""} ${properties.align === "right" ? "text-right" : ""}`;
    
    switch(properties.level) {
      case 1:
        return <h1 className={`text-4xl ${className}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={handleChange}>{content}</h1>;
      case 2:
        return <h2 className={`text-3xl ${className}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={handleChange}>{content}</h2>;
      case 3:
        return <h3 className={`text-2xl ${className}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={handleChange}>{content}</h3>;
      case 4:
        return <h4 className={`text-xl ${className}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={handleChange}>{content}</h4>;
      case 5:
        return <h5 className={`text-lg ${className}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={handleChange}>{content}</h5>;
      case 6:
        return <h6 className={`text-base ${className}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={handleChange}>{content}</h6>;
      default:
        return <h2 className={`text-3xl ${className}`} contentEditable={true} suppressContentEditableWarning={true} onBlur={handleChange}>{content}</h2>;
    }
  };

  return (
    <BlockWrapper block={block} isSelected={isSelected} onUpdate={onUpdate}>
      {renderHeading()}
    </BlockWrapper>
  );
}

export function HeadingProperties({ 
  block, 
  onChange 
}: { 
  block: Block; 
  onChange: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { level: 2, align: "left" };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="heading-level">Heading Level</Label>
        <Select 
          value={properties.level?.toString() || "2"} 
          onValueChange={(value) => {
            onChange({
              properties: { ...properties, level: parseInt(value) }
            });
          }}
        >
          <SelectTrigger id="heading-level">
            <SelectValue placeholder="Select level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">H1 - Main heading</SelectItem>
            <SelectItem value="2">H2 - Subheading</SelectItem>
            <SelectItem value="3">H3 - Section heading</SelectItem>
            <SelectItem value="4">H4 - Subsection heading</SelectItem>
            <SelectItem value="5">H5 - Small heading</SelectItem>
            <SelectItem value="6">H6 - Smallest heading</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Text Alignment</Label>
        <div className="flex mt-2 space-x-2">
          <Button
            type="button"
            variant={properties.align === "left" ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ properties: { ...properties, align: "left" } })}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={properties.align === "center" ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ properties: { ...properties, align: "center" } })}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={properties.align === "right" ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ properties: { ...properties, align: "right" } })}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="heading-text">Heading Text</Label>
        <Textarea
          id="heading-text"
          value={block.content || ""}
          onChange={(e) => onChange({ content: e.target.value })}
          className="mt-1"
          rows={2}
        />
      </div>
    </div>
  );
}

// PARAGRAPH BLOCK
export function ParagraphBlock({ 
  block, 
  isSelected, 
  onUpdate 
}: { 
  block: Block; 
  isSelected: boolean;
  onUpdate: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { align: "left" };
  const content = block.content || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.";

  const handleChange = (e: React.ChangeEvent<HTMLParagraphElement>) => {
    onUpdate({ content: e.currentTarget.textContent || "" });
  };

  const className = `${properties.align === "center" ? "text-center" : ""} ${properties.align === "right" ? "text-right" : ""}`;

  return (
    <BlockWrapper block={block} isSelected={isSelected} onUpdate={onUpdate}>
      <p 
        className={className}
        contentEditable={true} 
        suppressContentEditableWarning={true} 
        onBlur={handleChange}
      >
        {content}
      </p>
    </BlockWrapper>
  );
}

export function ParagraphProperties({ 
  block, 
  onChange 
}: { 
  block: Block; 
  onChange: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { align: "left" };

  return (
    <div className="space-y-4">
      <div>
        <Label>Text Alignment</Label>
        <div className="flex mt-2 space-x-2">
          <Button
            type="button"
            variant={properties.align === "left" ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ properties: { ...properties, align: "left" } })}
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={properties.align === "center" ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ properties: { ...properties, align: "center" } })}
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant={properties.align === "right" ? "default" : "outline"}
            size="sm"
            onClick={() => onChange({ properties: { ...properties, align: "right" } })}
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="paragraph-text">Paragraph Text</Label>
        <Textarea
          id="paragraph-text"
          value={block.content || ""}
          onChange={(e) => onChange({ content: e.target.value })}
          className="mt-1"
          rows={4}
        />
      </div>
    </div>
  );
}

// LIST BLOCK
export function ListBlock({ 
  block, 
  isSelected, 
  onUpdate 
}: { 
  block: Block; 
  isSelected: boolean;
  onUpdate: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { type: "unordered" };
  const items = block.content || ["Item 1", "Item 2", "Item 3"];

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onUpdate({ content: newItems });
  };

  const handleItemBlur = (e: React.FocusEvent<HTMLLIElement>, index: number) => {
    handleItemChange(index, e.currentTarget.textContent || "");
  };

  return (
    <BlockWrapper block={block} isSelected={isSelected} onUpdate={onUpdate}>
      {properties.type === "ordered" ? (
        <ol className="list-decimal pl-5">
          {items.map((item, index) => (
            <li 
              key={index}
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleItemBlur(e, index)}
            >
              {item}
            </li>
          ))}
        </ol>
      ) : (
        <ul className="list-disc pl-5">
          {items.map((item, index) => (
            <li 
              key={index}
              contentEditable={true}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleItemBlur(e, index)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </BlockWrapper>
  );
}

export function ListProperties({ 
  block, 
  onChange 
}: { 
  block: Block; 
  onChange: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { type: "unordered" };
  const items = block.content || ["Item 1", "Item 2", "Item 3"];

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    onChange({ content: newItems });
  };

  const addItem = () => {
    onChange({ content: [...items, `Item ${items.length + 1}`] });
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    onChange({ content: newItems });
  };

  return (
    <div className="space-y-4">
      <div>
        <Label>List Type</Label>
        <RadioGroup 
          value={properties.type || "unordered"} 
          onValueChange={(value) => onChange({ properties: { ...properties, type: value } })}
          className="flex mt-2 space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="unordered" id="unordered" />
            <Label htmlFor="unordered">Bullet List</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="ordered" id="ordered" />
            <Label htmlFor="ordered">Numbered List</Label>
          </div>
        </RadioGroup>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>List Items</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={addItem}
            className="h-8 px-2"
          >
            <Plus className="h-4 w-4 mr-1" /> Add Item
          </Button>
        </div>
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                value={item}
                onChange={(e) => handleItemChange(index, e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                variant="ghost" 
                size="icon" 
                onClick={() => removeItem(index)}
                className="h-8 w-8 text-red-500"
                disabled={items.length <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
