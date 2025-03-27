import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { generateHtml } from "@/lib/htmlGenerator";
import { ArrowLeft, Download, Monitor, Smartphone, Tablet } from "lucide-react";
import { type Block, type Project as ServerProject } from "@shared/schema";

// Define interface for Projects
interface Project {
  id: number;
  name: string;
  description: string | null;
  blocks: Block[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

// Define local project type
interface LocalProject {
  id: string;
  name: string;
  description: string | null;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
  isLocal: boolean;
}

// Constants for local storage
const LS_DRAFT_BLOCKS_KEY = 'html_editor_draft_blocks';
const LS_PROJECTS_KEY = 'html_editor_server_projects';

export default function PreviewPage() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const projectId = params.id.startsWith('local_') ? params.id : parseInt(params.id);
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [html, setHtml] = useState("");
  const [projectName, setProjectName] = useState<string>("Untitled Project");
  const [localProject, setLocalProject] = useState<LocalProject | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch project data
  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", typeof projectId === 'number' ? projectId : null],
    enabled: typeof projectId === 'number',
  });

  // Check for a local project
  useEffect(() => {
    // First check if we're looking for a local project by ID
    if (typeof projectId === 'string' && projectId.startsWith('local_')) {
      setLoading(true);
      try {
        // Try to load project from local storage projects list
        const savedProjects = localStorage.getItem(LS_PROJECTS_KEY);
        if (savedProjects) {
          const projects = JSON.parse(savedProjects);
          const foundProject = projects.find((p: any) => p.id === projectId);
          
          if (foundProject) {
            setLocalProject(foundProject);
            setProjectName(foundProject.name);
            setHtml(generateHtml(foundProject.blocks));
          }
        }
      } catch (e) {
        console.error('Failed to load local project:', e);
      } finally {
        setLoading(false);
      }
    } 
    // If we're looking for a draft (no ID specified)
    else if (!projectId) {
      setLoading(true);
      try {
        // Try to load the current draft
        const savedBlocks = localStorage.getItem(LS_DRAFT_BLOCKS_KEY);
        const savedName = "Untitled Draft";
        
        if (savedName) {
          setProjectName(savedName);
        }
        
        if (savedBlocks) {
          const blocks = JSON.parse(savedBlocks);
          setHtml(generateHtml(blocks));
          
          // Create a proper LocalProject object
          const draftProject: LocalProject = {
            id: 'draft',
            name: savedName || 'Untitled Project',
            description: null,
            blocks,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isLocal: true
          };
          
          setLocalProject(draftProject);
        }
      } catch (e) {
        console.error('Failed to load draft:', e);
      } finally {
        setLoading(false);
      }
    }
  }, [projectId]);

  // Generate HTML for server projects
  useEffect(() => {
    if (project && Array.isArray(project.blocks)) {
      // First try to load latest blocks from localStorage if available
      try {
        const blocksKey = `html_editor_project_${projectId}_blocks`;
        const savedBlocks = localStorage.getItem(blocksKey);
        
        if (savedBlocks) {
          // Use the blocks from localStorage (most recent edits)
          const blocks = JSON.parse(savedBlocks);
          setHtml(generateHtml(blocks));
          console.log(`Using ${blocks.length} blocks from localStorage for project ${projectId}`);
        } else {
          // Fall back to blocks from the project data from server
          setHtml(generateHtml(project.blocks));
          console.log(`Using ${project.blocks.length} blocks from server data for project ${projectId}`);
        }
      } catch (e) {
        // If localStorage fails, use the blocks from the project data
        console.error('Failed to load blocks from localStorage:', e);
        setHtml(generateHtml(project.blocks));
      }
      
      setLoading(false);
    }
  }, [project, projectId]);

  // Handle downloading the HTML file
  const handleExportHtml = () => {
    if (!html) return;
    
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${project?.name || localProject?.name || "untitled"}.html`;
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

  // Determine if we have project data to show
  const hasProjectData = project || localProject;
  const currentProjectName = project?.name || localProject?.name || projectName;
  
  // Determine back button destination
  const getBackUrl = () => {
    if (typeof projectId === 'number') {
      return `/editor/${projectId}`;
    } else if (typeof projectId === 'string' && projectId.startsWith('local_')) {
      return `/editor/local/${projectId}`;
    } else {
      return '/editor';
    }
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] flex flex-col">
      <div className="bg-white border-b border-gray-200 p-3 flex items-center justify-between flex-wrap">
        <div className="flex items-center mb-2 md:mb-0">
          <Button 
            variant="default" 
            onClick={() => navigate(getBackUrl())}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Editor
          </Button>
          {hasProjectData && (
            <span className="ml-4 text-gray-500 text-sm">
              Previewing: <span className="font-medium text-gray-700">{currentProjectName}</span>
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
          <Button 
            variant="outline" 
            onClick={handleExportHtml}
            disabled={!html}
          >
            <Download className="h-4 w-4 mr-2" /> Export HTML
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto bg-gray-200 p-6">
        {loading || isLoading ? (
          <div className="max-w-6xl mx-auto bg-white min-h-screen animate-pulse"></div>
        ) : hasProjectData ? (
          <div className={`${deviceClasses[device]} mx-auto bg-white min-h-[600px] shadow-md transition-all duration-300`}>
            {html ? (
              <iframe 
                srcDoc={html}
                className="w-full h-full min-h-[600px] border-0"
                title="HTML Preview"
                sandbox="allow-scripts"
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
