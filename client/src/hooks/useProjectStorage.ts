import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { type Project, type Block } from '@shared/schema';

// Local storage keys
const LS_BLOCKS_KEY = 'html_editor_blocks';
const LS_PROJECT_NAME_KEY = 'html_editor_name';
const LS_PROJECT_DESC_KEY = 'html_editor_description';
const LS_PROJECTS_KEY = 'html_editor_projects';

// Helper function to generate a unique ID for local projects
const generateLocalId = () => {
  return `local_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export function useProjectStorage(projectId?: number) {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [projectName, setProjectName] = useState<string>('Untitled Project');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [isModified, setIsModified] = useState<boolean>(false);
  const [localId, setLocalId] = useState<string | null>(null);

  // Fetch project if ID is provided
  const { data: project, isLoading, isError } = useQuery<Project>({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId,
  });

  // Load from local storage on first render if no projectId is provided
  useEffect(() => {
    if (!projectId) {
      // Check for draft in local storage
      const savedBlocks = localStorage.getItem(LS_BLOCKS_KEY);
      const savedName = localStorage.getItem(LS_PROJECT_NAME_KEY);
      const savedDesc = localStorage.getItem(LS_PROJECT_DESC_KEY);
      
      if (savedBlocks) {
        try {
          setBlocks(JSON.parse(savedBlocks));
        } catch (e) {
          console.error('Failed to parse saved blocks:', e);
        }
      }
      
      if (savedName) {
        setProjectName(savedName);
      }
      
      if (savedDesc) {
        setProjectDescription(savedDesc);
      }
      
      // Generate a local ID if we don't have one
      const newLocalId = generateLocalId();
      setLocalId(newLocalId);
    }
  }, [projectId]);

  // Initialize blocks from project data
  useEffect(() => {
    if (project) {
      setBlocks(Array.isArray(project.blocks) ? project.blocks : []);
      setProjectName(project.name || 'Untitled Project');
      setProjectDescription(project.description || '');
      setIsModified(false);
    }
  }, [project]);

  // Save to local storage whenever blocks change
  useEffect(() => {
    if (isModified) {
      localStorage.setItem(LS_BLOCKS_KEY, JSON.stringify(blocks));
      localStorage.setItem(LS_PROJECT_NAME_KEY, projectName);
      localStorage.setItem(LS_PROJECT_DESC_KEY, projectDescription);
    }
  }, [blocks, projectName, projectDescription, isModified]);

  // Mark project as modified when blocks change
  const updateBlocks = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
    setIsModified(true);
  };

  // Save project to both server and local storage
  const saveMutation = useMutation({
    mutationFn: async () => {
      try {
        // Always save to local storage
        localStorage.setItem(LS_BLOCKS_KEY, JSON.stringify(blocks));
        localStorage.setItem(LS_PROJECT_NAME_KEY, projectName);
        localStorage.setItem(LS_PROJECT_DESC_KEY, projectDescription);
        
        // Validate inputs
        if (!projectName.trim()) {
          throw new Error('Project name is required');
        }
        
        // Try to save to server
        if (!projectId) {
          // Create new project
          const response = await apiRequest('POST', '/api/projects', {
            name: projectName.trim(),
            description: projectDescription || null,
            blocks,
            userId: 1, // Default user for now
          });
          
          // Save to local projects list
          saveLocalProject();
          
          return response.json();
        } else {
          // Update existing project
          const response = await apiRequest('PUT', `/api/projects/${projectId}`, {
            name: projectName.trim(),
            description: projectDescription || null,
            blocks,
          });
          
          // Update in local projects list
          saveLocalProject();
          
          return response.json();
        }
      } catch (error: any) {
        console.error('Error saving project:', error);
        
        // Even if server save fails, save to local storage as a backup
        saveLocalProject();
        
        throw error;
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setIsModified(false);
      toast({
        title: 'Project saved',
        description: 'Your project has been saved successfully.',
      });
      return data;
    },
    onError: (error: any) => {
      toast({
        title: 'Error saving to server',
        description: `${error.message || 'Something went wrong'}. Your work has been saved locally.`,
        variant: 'destructive',
      });
    },
  });

  // Helper to save project locally
  const saveLocalProject = () => {
    try {
      const id = localId || generateLocalId();
      setLocalId(id);
      
      // Get existing projects or initialize empty array
      const savedProjects = localStorage.getItem(LS_PROJECTS_KEY);
      const projects = savedProjects ? JSON.parse(savedProjects) : [];
      
      // Find if this project already exists in local storage
      const existingIndex = projects.findIndex((p: any) => p.id === id);
      
      const localProject = {
        id,
        name: projectName,
        description: projectDescription || null,
        blocks,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isLocal: true
      };
      
      // Update or add the project
      if (existingIndex >= 0) {
        projects[existingIndex] = localProject;
      } else {
        projects.push(localProject);
      }
      
      // Save back to local storage
      localStorage.setItem(LS_PROJECTS_KEY, JSON.stringify(projects));
      
      // Update state
      setIsModified(false);
    } catch (e) {
      console.error('Failed to save local project:', e);
    }
  };

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (projectId) {
        // Delete from server
        await apiRequest('DELETE', `/api/projects/${projectId}`);
      }
      
      // Delete from local storage
      if (localId) {
        const savedProjects = localStorage.getItem(LS_PROJECTS_KEY);
        if (savedProjects) {
          const projects = JSON.parse(savedProjects);
          const filteredProjects = projects.filter((p: any) => p.id !== localId);
          localStorage.setItem(LS_PROJECTS_KEY, JSON.stringify(filteredProjects));
        }
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: 'Project deleted',
        description: 'Your project has been deleted successfully.',
      });
      
      // Clear current project from local storage
      localStorage.removeItem(LS_BLOCKS_KEY);
      localStorage.removeItem(LS_PROJECT_NAME_KEY);
      localStorage.removeItem(LS_PROJECT_DESC_KEY);
    },
    onError: (error: any) => {
      toast({
        title: 'Error deleting project',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Save only to local storage
  const saveLocal = () => {
    saveLocalProject();
    toast({
      title: 'Project saved locally',
      description: 'Your project has been saved to local storage.',
    });
  };

  return {
    project,
    blocks,
    updateBlocks,
    projectName,
    setProjectName: (name: string) => {
      setProjectName(name);
      setIsModified(true);
    },
    projectDescription,
    setProjectDescription: (desc: string) => {
      setProjectDescription(desc);
      setIsModified(true);
    },
    isLoading,
    isError,
    isModified,
    saveProject: saveMutation.mutate,
    saveLocal,
    isSaving: saveMutation.isPending,
    deleteProject: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
    localId
  };
}
