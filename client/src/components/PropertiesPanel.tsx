import { useState } from "react";
import { type Block } from "@shared/schema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { getBlockProperties } from "@/components/blocks";
import { Settings, Eye, Code, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PropertiesPanelProps {
  selectedBlock: Block | null;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  html: string;
}

export default function PropertiesPanel({
  selectedBlock,
  onUpdateBlock,
  html,
}: PropertiesPanelProps) {
  const [activeTab, setActiveTab] = useState("properties");
  const { toast } = useToast();

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(html);
    toast({
      title: "HTML copied to clipboard",
      description: "You can now paste the HTML code elsewhere.",
    });
  };

  const renderPropertiesContent = () => {
    if (!selectedBlock) {
      return (
        <div className="text-center py-8">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            <Settings className="h-5 w-5 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">Select a block to edit its properties</p>
        </div>
      );
    }

    const PropertyEditor = getBlockProperties(selectedBlock.type);
    
    if (!PropertyEditor) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No properties available for this block type</p>
        </div>
      );
    }

    return (
      <PropertyEditor
        block={selectedBlock}
        onChange={(updates) => onUpdateBlock(selectedBlock.id, updates)}
      />
    );
  };

  return (
    <div className="md:w-80 bg-white border-l border-gray-200 overflow-y-auto flex-shrink-0 h-full">
      <div className="flex flex-col h-full">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start border-b border-gray-200 rounded-none bg-transparent px-0">
            <TabsTrigger
              value="properties"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <Settings className="h-4 w-4 mr-2" /> Properties
            </TabsTrigger>
            <TabsTrigger
              value="preview"
              className="data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
            >
              <Eye className="h-4 w-4 mr-2" /> Preview
            </TabsTrigger>
          </TabsList>
          
          {/* Properties Tab */}
          <TabsContent value="properties" className="p-4 overflow-y-auto flex-1">
            {renderPropertiesContent()}
          </TabsContent>
          
          {/* Preview Tab */}
          <TabsContent value="preview" className="p-4 overflow-y-auto flex-1">
            <div className="bg-gray-100 rounded-md p-2 mb-3 text-xs text-gray-600 flex items-center">
              <Eye className="h-4 w-4 mr-1" />
              Live preview of your HTML
            </div>
            <div className="border border-gray-200 rounded-md bg-white overflow-hidden">
              {html ? (
                <iframe
                  srcDoc={html}
                  className="w-full h-96 border-0"
                  title="HTML Preview"
                />
              ) : (
                <div className="h-96 flex items-center justify-center text-center p-4">
                  <p className="text-gray-500 text-sm">HTML preview will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* HTML Preview */}
        <div className="border-t border-gray-200 p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-medium text-gray-600">HTML OUTPUT</h3>
            <Button variant="ghost" size="sm" onClick={handleCopyHtml} className="h-6 text-xs">
              <Copy className="h-3 w-3 mr-1" /> Copy
            </Button>
          </div>
          <div className="bg-gray-800 text-gray-200 p-3 rounded-md font-mono text-xs overflow-auto max-h-40">
            <pre className="whitespace-pre-wrap break-all">
              {html || "<!DOCTYPE html>\n<html>\n<head>\n  <title>My Page</title>\n</head>\n<body>\n  <!-- Blocks will generate HTML here -->\n</body>\n</html>"}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
