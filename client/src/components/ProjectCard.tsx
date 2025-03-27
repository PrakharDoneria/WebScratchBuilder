import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { type Project } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Edit, Trash2, Copy, ExternalLink } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
  project: Project;
  onDelete: (id: number) => Promise<void>;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newName, setNewName] = useState(project.name);

  // Format the date for display
  const formattedDate = formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true });

  // Mutation for renaming a project
  const renameMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("PUT", `/api/projects/${project.id}`, {
        ...project,
        name: newName,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setRenameDialogOpen(false);
      toast({
        title: "Project renamed",
        description: "Your project has been renamed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error renaming project",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Mutation for deleting a project
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/projects/${project.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      setDeleteDialogOpen(false);
      toast({
        title: "Project deleted",
        description: "Your project has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting project",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleRename = () => {
    if (!newName.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project.",
        variant: "destructive",
      });
      return;
    }
    renameMutation.mutate();
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  // Determine a background color based on project id
  const bgColors = [
    "bg-blue-100",
    "bg-green-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-yellow-100",
    "bg-indigo-100",
  ];
  const bgColor = bgColors[project.id % bgColors.length];

  return (
    <Card className="overflow-hidden border border-gray-200 hover:shadow-lg transition" onClick={() => navigate(`/editor/${project.id}`)}>
      <div className={`h-40 ${bgColor} flex items-center justify-center`}>
        {project.blocks && Array.isArray(project.blocks) && project.blocks.length > 0 ? (
          <div className="text-center">
            <div className="text-lg font-medium text-gray-700">{project.blocks.length} blocks</div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-gray-500">Empty Project</div>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{project.name}</h3>
          <span className="text-xs text-gray-500">Last edited: {formattedDate}</span>
        </div>
        <p className="text-gray-600 text-sm mt-2">
          {project.description || "No description provided"}
        </p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex space-x-1">
            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
              {(Array.isArray(project.blocks) ? project.blocks.length : 0)} blocks
            </span>
          </div>
          <div className="flex space-x-1" onClick={e => e.stopPropagation()}>
            {/* Rename Dialog */}
            <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" title="Rename">
                  <Edit className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename Project</DialogTitle>
                  <DialogDescription>
                    Update the name of your project. This won't affect your blocks or design.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Project name"
                    className="w-full"
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleRename} 
                    disabled={renameMutation.isPending}
                  >
                    {renameMutation.isPending ? "Saving..." : "Save"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Preview Button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8" 
              title="Preview"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/preview/${project.id}`);
              }}
            >
              <ExternalLink className="h-4 w-4" />
            </Button>

            {/* Delete Dialog */}
            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your project.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleDelete} 
                    className="bg-red-500 hover:bg-red-600"
                    disabled={deleteMutation.isPending}
                  >
                    {deleteMutation.isPending ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
