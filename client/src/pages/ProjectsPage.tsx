import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { type Project } from "@shared/schema";
import ProjectCard from "@/components/ProjectCard";
import { Plus, Code } from "lucide-react";

export default function ProjectsPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
  });

  // Fetch all projects
  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Create a new project
  const createProjectMutation = useMutation({
    mutationFn: async (project: { name: string; description: string }) => {
      const response = await apiRequest("POST", "/api/projects", {
        ...project,
        blocks: [],
        userId: 1, // Default user for now
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project created",
        description: "Your new project has been created successfully.",
      });
      setNewProjectOpen(false);
      setNewProject({ name: "", description: "" });
      // Navigate to the editor
      navigate(`/editor/${data.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error creating project",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreateProject = () => {
    if (!newProject.name.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project.",
        variant: "destructive",
      });
      return;
    }
    createProjectMutation.mutate(newProject);
  };

  const handleDeleteProject = async (id: number) => {
    // Logic handled in ProjectCard component
  };

  return (
    <div className="w-full px-4 py-8 md:p-8 fade-in bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">HTML Block Projects</h1>
            <p className="text-muted-foreground mt-1">Build websites visually without writing code</p>
          </div>
          <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} /> Create New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new project</DialogTitle>
                <DialogDescription>
                  Enter the details for your new HTML project. You'll be able to add blocks and design your page after creation.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Project Name
                  </label>
                  <Input
                    id="name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="My Awesome Website"
                    className="w-full"
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description (optional)
                  </label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="What's this project about?"
                    rows={3}
                    className="resize-none"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewProjectOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateProject} 
                  disabled={createProjectMutation.isPending}
                >
                  {createProjectMutation.isPending ? "Creating..." : "Create Project"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-lg shadow-md overflow-hidden border border-border h-72 animate-pulse bg-muted/20">
                <div className="h-40 bg-muted"></div>
                <div className="p-4">
                  <div className="h-4 bg-muted rounded mb-2 w-3/4"></div>
                  <div className="h-3 bg-muted/50 rounded w-full mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-muted/50 rounded w-1/3"></div>
                    <div className="h-3 bg-muted/50 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: Project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onDelete={handleDeleteProject}
              />
            ))}

            {/* New Project Card (always shown as last) */}
            <Dialog open={newProjectOpen} onOpenChange={setNewProjectOpen}>
              <DialogTrigger asChild>
                <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg flex flex-col items-center justify-center h-72 bg-muted/10 hover:border-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all cursor-pointer group">
                  <div className="w-16 h-16 rounded-full bg-muted/20 flex items-center justify-center mb-4 group-hover:bg-primary/10 transition-colors">
                    <Plus className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="font-medium text-foreground group-hover:text-primary transition-colors">Create New Project</p>
                  <p className="text-muted-foreground text-sm mt-1">Start building your HTML</p>
                </div>
              </DialogTrigger>
            </Dialog>
          </div>
        )}

        {!isLoading && projects.length === 0 && (
          <div className="text-center py-16 bg-card rounded-xl shadow-sm border border-border p-8 mt-8">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Code className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold mb-3 text-foreground">No projects yet</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Start by creating your first HTML project with our visual block editor. 
              No coding required!
            </p>
            <Button onClick={() => setNewProjectOpen(true)} size="lg" className="px-8">
              Create Your First Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
