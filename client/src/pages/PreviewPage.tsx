import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { generateHtml } from "@/lib/htmlGenerator";
import { AlertCircle, ArrowLeft, Download, Monitor, Smartphone, Tablet } from "lucide-react";
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
    if (project) {
      console.log("Project data received:", project);
      
      // First try to load latest blocks from localStorage if available
      try {
        const blocksKey = `html_editor_project_${projectId}_blocks`;
        const savedBlocks = localStorage.getItem(blocksKey);
        
        if (savedBlocks) {
          // Use the blocks from localStorage (most recent edits)
          const blocks = JSON.parse(savedBlocks);
          console.log(`Using ${blocks.length} blocks from localStorage for project ${projectId}`);
          setHtml(generateHtml(blocks));
        } else if (project.blocks && Array.isArray(project.blocks)) {
          // Fall back to blocks from the project data from server
          console.log(`Using ${project.blocks.length} blocks from server data for project ${projectId}`);
          setHtml(generateHtml(project.blocks));
        } else {
          console.warn("No valid blocks found in project data:", project);
          setHtml("<div style='padding: 20px;'><h2>No content to display</h2><p>This project doesn't have any blocks yet.</p></div>");
        }
      } catch (e) {
        // If localStorage fails, use the blocks from the project data
        console.error('Failed to load blocks from localStorage:', e);
        
        if (project.blocks && Array.isArray(project.blocks)) {
          setHtml(generateHtml(project.blocks));
        } else {
          setHtml("<div style='padding: 20px;'><h2>Error loading content</h2><p>There was a problem loading this project's content.</p></div>");
        }
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
    <div className="w-full h-[calc(100vh-64px)] flex flex-col bg-background">
      <header className="bg-background border-b border-border p-3 flex items-center justify-between flex-wrap glass-effect">
        <div className="flex items-center mb-2 md:mb-0">
          <Button 
            variant="outline" 
            onClick={() => navigate(getBackUrl())}
            className="flex items-center"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Editor
          </Button>
          {hasProjectData && (
            <span className="ml-4 text-muted-foreground text-sm md:flex items-center hidden">
              Previewing: <span className="font-medium text-foreground ml-1">{currentProjectName}</span>
            </span>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-muted rounded-md p-1">
            <Button 
              size="icon" 
              variant={device === "desktop" ? "default" : "ghost"}
              onClick={() => setDevice("desktop")}
              className="h-8 w-8"
            >
              <Monitor className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant={device === "tablet" ? "default" : "ghost"}
              onClick={() => setDevice("tablet")}
              className="h-8 w-8"
            >
              <Tablet className="h-4 w-4" />
            </Button>
            <Button 
              size="icon" 
              variant={device === "mobile" ? "default" : "ghost"}
              onClick={() => setDevice("mobile")}
              className="h-8 w-8"
            >
              <Smartphone className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            variant="outline" 
            onClick={handleExportHtml}
            disabled={!html}
            size="sm"
            className="flex items-center"
          >
            <Download className="h-4 w-4 mr-2" /> Export HTML
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto bg-muted/30 p-4 md:p-6">
        {hasProjectData && (
          <div className="mb-2 text-sm text-muted-foreground md:hidden flex justify-center">
            <span>Previewing: <span className="font-medium text-foreground ml-1">{currentProjectName}</span></span>
          </div>
        )}
        
        {loading || isLoading ? (
          <div className="max-w-6xl mx-auto bg-background min-h-[600px] animate-pulse rounded-lg shadow-md"></div>
        ) : hasProjectData ? (
          <div className={`${deviceClasses[device]} mx-auto bg-white dark:bg-slate-950 min-h-[600px] shadow-md transition-all duration-300 rounded slide-up`}>
            {html ? (
              <iframe 
                srcDoc={html}
                className="w-full h-full min-h-[600px] border-0 rounded"
                title="HTML Preview"
                sandbox="allow-scripts"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                No content to preview
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 bg-card rounded-xl shadow-sm border border-border p-8 max-w-md mx-auto slide-up">
            <div className="bg-muted/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-3">Project not found</h3>
            <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or has been deleted.</p>
            <Button 
              className="px-6" 
              onClick={() => navigate("/")}
            >
              Back to Projects
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
