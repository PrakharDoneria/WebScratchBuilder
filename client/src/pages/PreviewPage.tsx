import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { generateHtml } from "@/lib/htmlGenerator";
import { ArrowLeft, Download, Monitor, Smartphone, Tablet } from "lucide-react";

export default function PreviewPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const projectId = parseInt(params.id);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [html, setHtml] = useState("");

  // Fetch project data
  const { data: project, isLoading } = useQuery({
    queryKey: ["/api/projects", projectId],
  });

  useEffect(() => {
    if (project?.blocks) {
      // Generate HTML from blocks
      setHtml(generateHtml(project.blocks));
    }
  }, [project]);

  // Handle downloading the HTML file
  const handleExportHtml = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project?.name || "untitled"}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Device width classes
  const deviceClasses = {
    desktop: "max-w-6xl",
    tablet: "max-w-md",
    mobile: "max-w-xs"
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col">
      <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="primary" 
            onClick={() => navigate(`/editor/${projectId}`)}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Editor
          </Button>
          {!isLoading && project && (
            <span className="ml-4 text-gray-500 text-sm">
              Previewing: <span className="font-medium text-gray-700">{project.name}</span>
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded p-1">
            <Button 
              size="icon" 
              variant={device === "desktop" ? "default" : "ghost"}
              onClick={() => setDevice("desktop")}
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant={device === "tablet" ? "default" : "ghost"}
              onClick={() => setDevice("tablet")}
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant={device === "mobile" ? "default" : "ghost"}
              onClick={() => setDevice("mobile")}
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" onClick={handleExportHtml}>
            <Download className="h-4 w-4 mr-2" /> Export HTML
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gray-200 p-6">
        {isLoading ? (
          <div className="max-w-6xl mx-auto bg-white min-h-screen animate-pulse"></div>
        ) : project ? (
          <div className={`${deviceClasses[device]} mx-auto bg-white min-h-[600px] shadow-md transition-all duration-300`}>
            {html ? (
              <iframe 
                srcDoc={html}
                className="w-full h-full min-h-[600px] border-0"
                title="HTML Preview"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No content to preview
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10">
            <p>Project not found</p>
            <Button 
              className="mt-4" 
              onClick={() => navigate("/")}
            >
              Back to Projects
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
