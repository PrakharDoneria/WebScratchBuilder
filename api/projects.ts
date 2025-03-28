import type { VercelRequest, VercelResponse } from '@vercel/node';
import { LocalStorage } from '../server/storage';
import { insertProjectSchema, updateProjectSchema } from '../shared/schema';

// Create storage instance for serverless (must use LocalStorage in serverless)
const storage = new LocalStorage();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  console.log(`Processing ${req.method} request to /api/projects${req.query.id ? '/' + req.query.id : ''}`);

  // Get all projects
  if (req.method === 'GET' && !req.query.id) {
    try {
      const projects = await storage.getAllProjects();
      return res.status(200).json(projects);
    } catch (error: any) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ error: 'Failed to fetch projects', message: error.message });
    }
  }

  // Get project by ID
  if (req.method === 'GET' && req.query.id) {
    const id = Number(req.query.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    try {
      const project = await storage.getProject(id);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.status(200).json(project);
    } catch (error: any) {
      console.error(`Error fetching project ${id}:`, error);
      return res.status(500).json({ error: 'Failed to fetch project', message: error.message });
    }
  }

  // Create new project
  if (req.method === 'POST') {
    try {
      const projectData = insertProjectSchema.parse(req.body);
      const project = await storage.createProject(projectData);
      return res.status(201).json(project);
    } catch (error: any) {
      console.error('Error creating project:', error);
      return res.status(400).json({ error: 'Invalid project data', message: error.message });
    }
  }

  // Update project
  if (req.method === 'PUT' && req.query.id) {
    const id = Number(req.query.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    try {
      const projectData = updateProjectSchema.parse(req.body);
      const project = await storage.updateProject(id, projectData);
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.status(200).json(project);
    } catch (error: any) {
      console.error(`Error updating project ${id}:`, error);
      return res.status(400).json({ error: 'Invalid project data', message: error.message });
    }
  }

  // Delete project
  if (req.method === 'DELETE' && req.query.id) {
    const id = Number(req.query.id);
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid project ID' });
    }

    try {
      const success = await storage.deleteProject(id);
      if (!success) {
        return res.status(404).json({ error: 'Project not found' });
      }
      return res.status(204).end();
    } catch (error: any) {
      console.error(`Error deleting project ${id}:`, error);
      return res.status(500).json({ error: 'Failed to delete project', message: error.message });
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}