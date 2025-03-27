import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Code, Plus, Save, Download } from 'lucide-react';

export default function Navbar() {
  const [location, navigate] = useLocation();
  const [currentView, setCurrentView] = useState('');
  const [showProjectControls, setShowProjectControls] = useState(false);
  
  // Determine the current view based on the location
  useEffect(() => {
    if (location === '/') {
      setCurrentView('Projects');
      setShowProjectControls(false);
    } else if (location.startsWith('/editor')) {
      setCurrentView('Editor');
      setShowProjectControls(true);
    } else if (location.startsWith('/preview')) {
      setCurrentView('Preview');
      setShowProjectControls(true);
    }
  }, [location]);

  // Get project id from URL if we're in editor or preview
  const getProjectIdFromUrl = () => {
    if (location.startsWith('/editor/') || location.startsWith('/preview/')) {
      const parts = location.split('/');
      return parts[2] ? parseInt(parts[2]) : null;
    }
    return null;
  };
  
  const projectId = getProjectIdFromUrl();

  // Fetch projects for the dropdown
  const { data: projects = [] } = useQuery({
    queryKey: ['/api/projects'],
    enabled: showProjectControls,
  });

  // Handle changing the project in the dropdown
  const handleProjectChange = (projectId: string) => {
    if (currentView === 'Editor') {
      navigate(`/editor/${projectId}`);
    } else if (currentView === 'Preview') {
      navigate(`/preview/${projectId}`);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
          <Code className="h-5 w-5 text-blue-500" />
          <span className="ml-2 text-xl font-semibold">BlockHTML</span>
        </div>
        
        {showProjectControls && (
          <div className="flex items-center space-x-3 ml-8">
            <Button 
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> New Project
            </Button>
            {projects.length > 0 && (
              <Select value={projectId?.toString()} onValueChange={handleProjectChange}>
                <SelectTrigger className="border border-gray-300 rounded w-40">
                  <SelectValue placeholder="Select Project" />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project: any) => (
                    <SelectItem key={project.id} value={project.id.toString()}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center bg-gray-100 rounded-md p-0.5">
          <Button 
            variant={currentView === 'Editor' ? 'default' : 'ghost'} 
            size="sm"
            className={currentView === 'Editor' ? 'bg-white shadow text-gray-800' : ''}
            onClick={() => {
              if (projectId) {
                navigate(`/editor/${projectId}`);
              } else {
                navigate('/');
              }
            }}
          >
            Editor
          </Button>
          <Button 
            variant={currentView === 'Preview' ? 'default' : 'ghost'} 
            size="sm"
            className={currentView === 'Preview' ? 'bg-white shadow text-gray-800' : ''}
            onClick={() => {
              if (projectId) {
                navigate(`/preview/${projectId}`);
              }
            }}
            disabled={!projectId}
          >
            Preview
          </Button>
          <Button 
            variant={currentView === 'Projects' ? 'default' : 'ghost'} 
            size="sm"
            className={currentView === 'Projects' ? 'bg-white shadow text-gray-800' : ''}
            onClick={() => navigate('/')}
          >
            Projects
          </Button>
        </div>
      </div>
    </nav>
  );
}
