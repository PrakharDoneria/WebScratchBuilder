import { useState } from "react";
import { Block } from "@shared/schema";
import BlockWrapper from "./BlockWrapper";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Link as LinkIcon, ExternalLink } from "lucide-react";

// CUSTOM HTML BLOCK
export function CustomHtmlBlock({ 
  block, 
  isSelected, 
  onUpdate 
}: { 
  block: Block; 
  isSelected: boolean;
  onUpdate: (updates: Partial<Block>) => void;
}) {
  const content = block.content || "<div>Custom HTML goes here</div>";

  return (
    <BlockWrapper 
      block={block} 
      isSelected={isSelected} 
      onUpdate={onUpdate}
      className="custom-html-block"
    >
      <div className="relative">
        <div className="bg-gray-50 rounded-md p-2 border border-gray-300">
          <pre className="text-xs font-mono text-gray-700 overflow-x-auto whitespace-pre-wrap break-all max-h-48">
            {content}
          </pre>
        </div>
        {isSelected && (
          <div className="absolute top-0 right-0 m-1 bg-gray-200 text-xs px-2 py-1 rounded">
            <Code className="inline h-3 w-3 mr-1" /> Custom HTML
          </div>
        )}
      </div>
    </BlockWrapper>
  );
}

export function CustomHtmlProperties({ 
  block, 
  onChange 
}: { 
  block: Block; 
  onChange: (updates: Partial<Block>) => void;
}) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="custom-html">Custom HTML Code</Label>
        <Textarea
          id="custom-html"
          value={block.content || ""}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="<div>Your custom HTML here</div>"
          className="mt-1 font-mono text-sm"
          rows={12}
        />
      </div>
      <div className="bg-amber-50 p-3 text-amber-800 rounded-md text-sm">
        <p><strong>Note:</strong> This block allows you to write custom HTML directly.</p>
        <p className="mt-1 text-xs">Use with caution as it bypasses the visual editor's formatting.</p>
      </div>
    </div>
  );
}

// LINK BLOCK
export function LinkBlock({ 
  block, 
  isSelected, 
  onUpdate 
}: { 
  block: Block; 
  isSelected: boolean;
  onUpdate: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    href: "#", 
    target: "_self",
    style: "default"
  };
  const content = block.content || "Click here";

  // Style classes
  const styleClasses = {
    default: "text-blue-500 hover:underline",
    button: "inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600",
    underlined: "text-blue-500 underline hover:text-blue-700",
    subtle: "text-gray-600 hover:text-blue-500 hover:underline",
  };

  const handleChange = (e: React.FocusEvent<HTMLAnchorElement>) => {
    onUpdate({ content: e.currentTarget.textContent || "" });
  };

  return (
    <BlockWrapper 
      block={block} 
      isSelected={isSelected} 
      onUpdate={onUpdate}
    >
      <a
        href={properties.href}
        target={properties.target}
        className={styleClasses[properties.style as keyof typeof styleClasses] || styleClasses.default}
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={handleChange}
      >
        {content}
        {properties.target === "_blank" && (
          <ExternalLink className="inline-block h-3 w-3 ml-1" />
        )}
      </a>
    </BlockWrapper>
  );
}

export function LinkProperties({ 
  block, 
  onChange 
}: { 
  block: Block; 
  onChange: (updates: Partial<Block>) => void;
}) {
  const properties = block.properties || { 
    href: "#", 
    target: "_self",
    style: "default"
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="link-text">Link Text</Label>
        <Input
          id="link-text"
          type="text"
          value={block.content || ""}
          onChange={(e) => onChange({ content: e.target.value })}
          placeholder="Click here"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="link-href">Link URL</Label>
        <Input
          id="link-href"
          type="text"
          value={properties.href || "#"}
          onChange={(e) => onChange({ 
            properties: { ...properties, href: e.target.value } 
          })}
          placeholder="https://example.com"
          className="mt-1"
        />
      </div>

      <div>
        <Label>Link Target</Label>
        <div className="flex items-center space-x-2 mt-2">
          <Switch
            id="link-new-tab"
            checked={properties.target === "_blank"}
            onCheckedChange={(checked) => onChange({ 
              properties: { ...properties, target: checked ? "_blank" : "_self" } 
            })}
          />
          <Label htmlFor="link-new-tab">Open in new tab</Label>
        </div>
      </div>

      <div>
        <Label>Link Style</Label>
        <Tabs 
          value={properties.style || "default"} 
          onValueChange={(value) => onChange({ properties: { ...properties, style: value } })}
          className="mt-2"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="default">Default</TabsTrigger>
            <TabsTrigger value="button">Button</TabsTrigger>
            <TabsTrigger value="underlined">Underlined</TabsTrigger>
            <TabsTrigger value="subtle">Subtle</TabsTrigger>
          </TabsList>
          <TabsContent value="default" className="pt-2">
            <div className="p-2 border rounded">
              <a className="text-blue-500 hover:underline">Default link style</a>
            </div>
          </TabsContent>
          <TabsContent value="button" className="pt-2">
            <div className="p-2 border rounded">
              <a className="inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Button style</a>
            </div>
          </TabsContent>
          <TabsContent value="underlined" className="pt-2">
            <div className="p-2 border rounded">
              <a className="text-blue-500 underline hover:text-blue-700">Underlined style</a>
            </div>
          </TabsContent>
          <TabsContent value="subtle" className="pt-2">
            <div className="p-2 border rounded">
              <a className="text-gray-600 hover:text-blue-500 hover:underline">Subtle style</a>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
