import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BlockPalette from "@/components/BlockPalette";
import Canvas from "@/components/Canvas";
import PropertiesPanel from "@/components/PropertiesPanel";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateHtml } from "@/lib/htmlGenerator";
import { Blocks, Save, Download, ArrowLeft, ArrowRight, Eye, Smartphone, Tablet, Monitor } from "lucide-react";
import { type Block } from "@shared/schema";
import useBlocks from "@/hooks/useBlocks";

// Update HTML when blocks change
function useHtmlOutput(blocks: Block[]) {
  const [html, setHtml] = useState("");
  
  useEffect(() => {
    setHtml(generateHtml(blocks));
  }, [blocks]);
  
  return { html };
}

export default function EditorPage() {
  const params = useParams<{ id?: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const projectId = params.id ? parseInt(params.id) : undefined;
  
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  // Fetch project data if editing an existing project
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // Initialize blocks from project data or create empty project
  const { 
    blocks,
    setBlocks,
    addBlock,
    updateBlock,
    removeBlock,
    moveBlock,
    selectedBlock,
    setSelectedBlock,
  } = useBlocks(
    project && typeof project === 'object' && 'blocks' in project && Array.isArray(project.blocks) 
      ? project.blocks 
      : []
  );
  
  // Generate HTML from blocks
  const { html } = useHtmlOutput(blocks);

  // Save project mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!project) {
        // If no project exists, create a new one
        const response = await apiRequest("POST", "/api/projects", {
          name: "Untitled Project",
          description: "",
          blocks,
          userId: 1, // Default user for now
        });
        return response.json();
      } else {
        // Otherwise update the existing project
        const response = await apiRequest("PUT", `/api/projects/${projectId}`, {
          ...project,
          blocks,
        });
        return response.json();
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project saved",
        description: "Your project has been saved successfully.",
      });
      
      // If we created a new project, navigate to its editor URL
      if (!projectId) {
        navigate(`/editor/${data.id}`);
      }
    },
    onError: (error) => {
      toast({
        title: "Error saving project",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Handle downloading the HTML file
  const handleExportHtml = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const projectName = project && typeof project === 'object' && 'name' in project ? project.name : "untitled";
    a.download = `${projectName}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col md:flex-row">
      {/* Left Sidebar - Block Palette */}
      <BlockPalette onAddBlock={addBlock} />
      
      {/* Center - Canvas Workspace */}
      <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        {/* Canvas Toolbar */}
        <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" disabled>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" disabled>
              <ArrowRight className="h-4 w-4" />
            </Button>
            <div className="h-4 border-r border-gray-300 mx-1"></div>
            <Select value={device} onValueChange={(value: "desktop" | "tablet" | "mobile") => setDevice(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Device" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desktop">Desktop</SelectItem>
                <SelectItem value="tablet">Tablet</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button variant="outline" size="sm" onClick={() => navigate(`/preview/${projectId}`)}>
              <Eye className="h-4 w-4 mr-2" /> Preview
            </Button>
          </div>
        </div>
        
        {/* Canvas Area */}
        <Canvas 
          blocks={blocks}
          device={device}
          selectedBlockId={selectedBlockId}
          onSelectBlock={setSelectedBlockId}
          onUpdateBlock={updateBlock}
          onRemoveBlock={removeBlock}
          onMoveBlock={moveBlock}
        />
      </div>
      
      {/* Right Sidebar - Properties Panel */}
      <PropertiesPanel 
        selectedBlock={selectedBlock}
        onUpdateBlock={updateBlock}
        html={html}
      />

      {/* Footer Actions */}
      <div className="fixed bottom-4 right-4 flex space-x-2">
        <Button 
          onClick={() => saveMutation.mutate()} 
          disabled={saveMutation.isPending}
          className="shadow-md"
        >
          <Save className="h-4 w-4 mr-2" /> 
          {saveMutation.isPending ? "Saving..." : "Save"}
        </Button>
        <Button 
          variant="outline" 
          onClick={handleExportHtml} 
          className="shadow-md"
        >
          <Download className="h-4 w-4 mr-2" /> Export HTML
        </Button>
      </div>
    </div>
  );
}
