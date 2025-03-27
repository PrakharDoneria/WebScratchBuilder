import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { type Project, type Block } from '@shared/schema';

export function useProjectStorage(projectId?: number) {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [projectName, setProjectName] = useState<string>('Untitled Project');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [isModified, setIsModified] = useState<boolean>(false);

  // Fetch project if ID is provided
  const { data: project, isLoading, isError } = useQuery({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId,
  });

  // Initialize blocks from project data
  useEffect(() => {
    if (project) {
      setBlocks(project.blocks || []);
      setProjectName(project.name || 'Untitled Project');
      setProjectDescription(project.description || '');
      setIsModified(false);
    }
  }, [project]);

  // Mark project as modified when blocks change
  const updateBlocks = (newBlocks: Block[]) => {
    setBlocks(newBlocks);
    setIsModified(true);
  };

  // Save project mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!projectId) {
        // Create new project
        const response = await apiRequest('POST', '/api/projects', {
          name: projectName,
          description: projectDescription,
          blocks,
          userId: 1, // Default user for now
        });
        return response.json();
      } else {
        // Update existing project
        const response = await apiRequest('PUT', `/api/projects/${projectId}`, {
          name: projectName,
          description: projectDescription,
          blocks,
        });
        return response.json();
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
    onError: (error) => {
      toast({
        title: 'Error saving project',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
  });

  // Delete project mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      if (!projectId) return null;
      await apiRequest('DELETE', `/api/projects/${projectId}`);
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      toast({
        title: 'Project deleted',
        description: 'Your project has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Error deleting project',
        description: error.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    },
  });

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
    isSaving: saveMutation.isPending,
    deleteProject: deleteMutation.mutate,
    isDeleting: deleteMutation.isPending,
  };
}
