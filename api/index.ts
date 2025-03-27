import express, { Request, Response, NextFunction } from 'express';
import { storage } from '../server/storage';
import cors from 'cors';
import { json } from 'express';
import { 
  insertProjectSchema, 
  updateProjectSchema,
  Project
} from '../shared/schema';

const app = express();

app.use(cors());
app.use(json());

// Error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

// API Routes
app.get('/api/projects', async (_req: Request, res: Response) => {
  try {
    const projects = await storage.getAllProjects();
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch projects', message: error.message });
  }
});

app.get('/api/projects/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  try {
    const project = await storage.getProject(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch project', message: error.message });
  }
});

app.post('/api/projects', async (req: Request, res: Response) => {
  try {
    const projectData = insertProjectSchema.parse(req.body);
    const project = await storage.createProject(projectData);
    res.status(201).json(project);
  } catch (error: any) {
    res.status(400).json({ error: 'Invalid project data', message: error.message });
  }
});

app.put('/api/projects/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  try {
    const projectData = updateProjectSchema.parse(req.body);
    const project = await storage.updateProject(id, projectData);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error: any) {
    res.status(400).json({ error: 'Invalid project data', message: error.message });
  }
});

app.delete('/api/projects/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid project ID' });
  }

  try {
    const success = await storage.deleteProject(id);
    if (!success) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.status(204).end();
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to delete project', message: error.message });
  }
});

// For Vercel serverless functions
export default app;

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
}