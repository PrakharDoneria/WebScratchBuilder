import { Block } from "@shared/schema";
import BlockWrapper from "./BlockWrapper";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layout, Columns, Rows, Palette } from "lucide-react";

// CONTAINER BLOCK
export function ContainerBlock({ 
  block, 
  isSelected, 
  onUpdate 
}: { 
  block: Block; 
  isSelected: boolean;
  onUpdate: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    maxWidth: "100%", 
    padding: "1rem",
    margin: "0 auto",
    backgroundColor: "",
    textColor: "",
  };

  return (
    <BlockWrapper 
      block={block} 
      isSelected={isSelected} 
      onUpdate={onUpdate}
    >
      <div
        style={{
          maxWidth: properties.maxWidth,
          padding: properties.padding,
          margin: properties.margin,
          backgroundColor: properties.backgroundColor || "transparent",
          color: properties.textColor || "inherit",
        }}
        className="border border-dashed border-gray-300 rounded min-h-[100px] flex items-center justify-center"
      >
        <div className="text-center text-gray-500 text-sm">
          Container Block
          <div className="text-xs">Drop blocks here or configure in properties</div>
        </div>
      </div>
    </BlockWrapper>
  );
}

export function ContainerProperties({ 
  block, 
  onChange 
}: { 
  block: Block; 
  onChange: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    maxWidth: "100%", 
    padding: "1rem",
    margin: "0 auto",
    backgroundColor: "",
    textColor: "",
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="container-max-width">Max Width</Label>
        <Input
          id="container-max-width"
          type="text"
          value={properties.maxWidth || "100%"}
          onChange={(e) => onChange({ 
            properties: { ...properties, maxWidth: e.target.value } 
          })}
          placeholder="100%, 1200px, etc."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="container-padding">Padding</Label>
        <Input
          id="container-padding"
          type="text"
          value={properties.padding || "1rem"}
          onChange={(e) => onChange({ 
            properties: { ...properties, padding: e.target.value } 
          })}
          placeholder="1rem, 20px, etc."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="container-margin">Margin</Label>
        <Input
          id="container-margin"
          type="text"
          value={properties.margin || "0 auto"}
          onChange={(e) => onChange({ 
            properties: { ...properties, margin: e.target.value } 
          })}
          placeholder="0 auto, 1rem, etc."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="container-bg-color">Background Color</Label>
        <div className="flex mt-1">
          <Input
            id="container-bg-color"
            type="text"
            value={properties.backgroundColor || ""}
            onChange={(e) => onChange({ 
              properties: { ...properties, backgroundColor: e.target.value } 
            })}
            placeholder="#ffffff, transparent, etc."
            className="flex-1"
          />
          <Input
            type="color"
            value={properties.backgroundColor || "#ffffff"}
            onChange={(e) => onChange({ 
              properties: { ...properties, backgroundColor: e.target.value } 
            })}
            className="w-10 p-0 ml-2"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="container-text-color">Text Color</Label>
        <div className="flex mt-1">
          <Input
            id="container-text-color"
            type="text"
            value={properties.textColor || ""}
            onChange={(e) => onChange({ 
              properties: { ...properties, textColor: e.target.value } 
            })}
            placeholder="#000000, inherit, etc."
            className="flex-1"
          />
          <Input
            type="color"
            value={properties.textColor || "#000000"}
            onChange={(e) => onChange({ 
              properties: { ...properties, textColor: e.target.value } 
            })}
            className="w-10 p-0 ml-2"
          />
        </div>
      </div>
    </div>
  );
}

// SECTION BLOCK
export function SectionBlock({ 
  block, 
  isSelected, 
  onUpdate 
}: { 
  block: Block; 
  isSelected: boolean;
  onUpdate: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    height: "auto", 
    padding: "2rem 1rem",
    backgroundColor: "",
    backgroundImage: "",
  };

  const backgroundStyle = properties.backgroundImage 
    ? { backgroundImage: `url(${properties.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } 
    : {};

  return (
    <BlockWrapper 
      block={block} 
      isSelected={isSelected} 
      onUpdate={onUpdate}
    >
      <section
        style={{
          height: properties.height,
          padding: properties.padding,
          backgroundColor: properties.backgroundColor || "transparent",
          ...backgroundStyle,
        }}
        className="border border-dashed border-gray-300 rounded min-h-[200px] flex items-center justify-center w-full"
      >
        <div className="text-center text-gray-500 text-sm">
          Section Block
          <div className="text-xs">Full-width section container</div>
        </div>
      </section>
    </BlockWrapper>
  );
}

export function SectionProperties({ 
  block, 
  onChange 
}: { 
  block: Block; 
  onChange: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    height: "auto", 
    padding: "2rem 1rem",
    backgroundColor: "",
    backgroundImage: "",
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="section-height">Height</Label>
        <Input
          id="section-height"
          type="text"
          value={properties.height || "auto"}
          onChange={(e) => onChange({ 
            properties: { ...properties, height: e.target.value } 
          })}
          placeholder="auto, 500px, 100vh, etc."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="section-padding">Padding</Label>
        <Input
          id="section-padding"
          type="text"
          value={properties.padding || "2rem 1rem"}
          onChange={(e) => onChange({ 
            properties: { ...properties, padding: e.target.value } 
          })}
          placeholder="2rem 1rem, 40px 20px, etc."
          className="mt-1"
        />
      </div>

      <Tabs defaultValue="background-color">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="background-color">Background Color</TabsTrigger>
          <TabsTrigger value="background-image">Background Image</TabsTrigger>
        </TabsList>
        <TabsContent value="background-color" className="space-y-4 pt-4">
          <div>
            <Label htmlFor="section-bg-color">Background Color</Label>
            <div className="flex mt-1">
              <Input
                id="section-bg-color"
                type="text"
                value={properties.backgroundColor || ""}
                onChange={(e) => onChange({ 
                  properties: { ...properties, backgroundColor: e.target.value } 
                })}
                placeholder="#ffffff, transparent, etc."
                className="flex-1"
              />
              <Input
                type="color"
                value={properties.backgroundColor || "#ffffff"}
                onChange={(e) => onChange({ 
                  properties: { ...properties, backgroundColor: e.target.value } 
                })}
                className="w-10 p-0 ml-2"
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="background-image" className="space-y-4 pt-4">
          <div>
            <Label htmlFor="section-bg-image">Background Image URL</Label>
            <Input
              id="section-bg-image"
              type="text"
              value={properties.backgroundImage || ""}
              onChange={(e) => onChange({ 
                properties: { ...properties, backgroundImage: e.target.value } 
              })}
              placeholder="https://example.com/image.jpg"
              className="mt-1"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ROW BLOCK
export function RowBlock({ 
  block, 
  isSelected, 
  onUpdate 
}: { 
  block: Block; 
  isSelected: boolean;
  onUpdate: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    columns: 2, 
    gap: "1rem",
    alignment: "stretch",
  };

  // Create an array based on number of columns
  const columns = Array.from({ length: properties.columns || 2 }, (_, i) => i);

  return (
    <BlockWrapper 
      block={block} 
      isSelected={isSelected} 
      onUpdate={onUpdate}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${properties.columns}, 1fr)`,
          gap: properties.gap,
          alignItems: properties.alignment,
        }}
        className="border border-dashed border-gray-300 rounded min-h-[100px] w-full p-4"
      >
        {columns.map((col, index) => (
          <div 
            key={index}
            className="border border-dotted border-gray-300 rounded min-h-[80px] flex items-center justify-center"
          >
            <div className="text-center text-gray-500 text-xs">
              Column {index + 1}
            </div>
          </div>
        ))}
      </div>
    </BlockWrapper>
  );
}

export function RowProperties({ 
  block, 
  onChange 
}: { 
  block: Block; 
  onChange: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    columns: 2, 
    gap: "1rem",
    alignment: "stretch",
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="row-columns">Number of Columns</Label>
        <Select
          value={properties.columns?.toString() || "2"}
          onValueChange={(value) => onChange({ 
            properties: { ...properties, columns: parseInt(value) } 
          })}
        >
          <SelectTrigger id="row-columns">
            <SelectValue placeholder="Select number of columns" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Column</SelectItem>
            <SelectItem value="2">2 Columns</SelectItem>
            <SelectItem value="3">3 Columns</SelectItem>
            <SelectItem value="4">4 Columns</SelectItem>
            <SelectItem value="6">6 Columns</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="row-gap">Gap Between Columns</Label>
        <Input
          id="row-gap"
          type="text"
          value={properties.gap || "1rem"}
          onChange={(e) => onChange({ 
            properties: { ...properties, gap: e.target.value } 
          })}
          placeholder="1rem, 20px, etc."
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="row-alignment">Vertical Alignment</Label>
        <Select
          value={properties.alignment || "stretch"}
          onValueChange={(value) => onChange({ 
            properties: { ...properties, alignment: value } 
          })}
        >
          <SelectTrigger id="row-alignment">
            <SelectValue placeholder="Select alignment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="stretch">Stretch (default)</SelectItem>
            <SelectItem value="flex-start">Top</SelectItem>
            <SelectItem value="center">Center</SelectItem>
            <SelectItem value="flex-end">Bottom</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
