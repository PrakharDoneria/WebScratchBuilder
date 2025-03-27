import { users, type User, type InsertUser, projects, type Project, type InsertProject, type UpdateProject } from "@shared/schema";

// Storage interface for users and projects
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Project operations
  getAllProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  getProjectsByUserId(userId: number): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: number, project: UpdateProject): Promise<Project | undefined>;
  deleteProject(id: number): Promise<boolean>;
}

// LocalStorage storage implementation
export class LocalStorage implements IStorage {
  private LS_KEY_USERS = "html_editor_users";
  private LS_KEY_PROJECTS = "html_editor_server_projects";
  private userIdCounter: number = 1;
  private projectIdCounter: number = 1;

  constructor() {
    this.loadCounters();
  }

  private loadCounters() {
    // Get all users to determine the max ID
    const users = this.getUsers();
    this.userIdCounter = users.length > 0 
      ? Math.max(...users.map(u => u.id)) + 1 
      : 1;

    // Get all projects to determine the max ID
    const projects = this.getProjects();
    this.projectIdCounter = projects.length > 0 
      ? Math.max(...projects.map(p => p.id)) + 1 
      : 1;
  }

  private getUsers(): User[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(this.LS_KEY_USERS);
        return data ? JSON.parse(data) : [];
      }
    } catch (e) {
      console.error('Failed to load users from localStorage:', e);
    }
    return [];
  }

  private getProjects(): Project[] {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = localStorage.getItem(this.LS_KEY_PROJECTS);
        return data ? JSON.parse(data) : [];
      }
    } catch (e) {
      console.error('Failed to load projects from localStorage:', e);
    }
    return [];
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const users = this.getUsers();
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = this.getUsers();
    return users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = this.getUsers();
    const id = this.userIdCounter++;
    
    const user: User = { 
      ...insertUser, 
      id 
    };
    
    users.push(user);
    
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.LS_KEY_USERS, JSON.stringify(users));
      }
    } catch (e) {
      console.error('Failed to save user to localStorage:', e);
    }
    
    return user;
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return this.getProjects();
  }

  async getProject(id: number): Promise<Project | undefined> {
    const projects = this.getProjects();
    return projects.find(project => project.id === id);
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    const projects = this.getProjects();
    return projects.filter(project => project.userId === userId);
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const projects = this.getProjects();
    const id = this.projectIdCounter++;
    const now = new Date();
    
    // Ensure blocks is an array
    const blocks = Array.isArray(insertProject.blocks) ? insertProject.blocks : [];
    
    // Create a project object with proper types
    const project: Project = {
      id,
      name: insertProject.name,
      description: insertProject.description ?? null,
      userId: insertProject.userId ?? null,
      blocks,
      createdAt: now,
      updatedAt: now
    };
    
    projects.push(project);
    
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.LS_KEY_PROJECTS, JSON.stringify(projects));
      }
    } catch (e) {
      console.error('Failed to save project to localStorage:', e);
    }
    
    return project;
  }

  async updateProject(id: number, updateData: UpdateProject): Promise<Project | undefined> {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      return undefined;
    }
    
    const project = projects[index];
    const now = new Date();
    
    // Ensure blocks is an array
    const blocks = Array.isArray(updateData.blocks) ? updateData.blocks : 
                  (Array.isArray(project.blocks) ? project.blocks : []);
    
    // Update the project with new data, preserving name and description if they aren't explicitly provided
    const updatedProject: Project = {
      ...project,
      name: updateData.name !== undefined ? updateData.name : project.name,
      description: updateData.description !== undefined ? updateData.description : project.description,
      blocks: blocks,
      updatedAt: now
    };
    
    projects[index] = updatedProject;
    
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.LS_KEY_PROJECTS, JSON.stringify(projects));
      }
    } catch (e) {
      console.error('Failed to update project in localStorage:', e);
    }
    
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    
    if (index === -1) {
      return false;
    }
    
    projects.splice(index, 1);
    
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(this.LS_KEY_PROJECTS, JSON.stringify(projects));
      }
    } catch (e) {
      console.error('Failed to delete project from localStorage:', e);
      return false;
    }
    
    return true;
  }
}

// In-memory implementation for fallback or testing (used on server-side)
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private projects: Map<number, Project>;
  private userIdCounter: number;
  private projectIdCounter: number;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Project methods
  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getProjectsByUserId(userId: number): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.userId === userId
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = this.projectIdCounter++;
    const now = new Date();
    
    // Create a fresh object without spreading to avoid type issues
    const project: Project = { 
      id,
      name: insertProject.name, 
      description: insertProject.description ?? null,
      userId: insertProject.userId ?? null,
      blocks: Array.isArray(insertProject.blocks) ? insertProject.blocks : [],
      createdAt: now, 
      updatedAt: now 
    };
    
    this.projects.set(id, project);
    return project;
  }

  async updateProject(id: number, updateData: UpdateProject): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) {
      return undefined;
    }
    
    // Create a fresh object without spreading to avoid type issues
    const updatedProject: Project = {
      id: project.id,
      name: updateData.name !== undefined ? updateData.name : project.name,
      description: updateData.description !== undefined ? updateData.description : project.description,
      userId: project.userId,
      blocks: Array.isArray(updateData.blocks) ? updateData.blocks : 
              (Array.isArray(project.blocks) ? project.blocks : []),
      createdAt: project.createdAt,
      updatedAt: new Date()
    };

    this.projects.set(id, updatedProject);
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    return this.projects.delete(id);
  }
}

// Determine which storage to use based on environment
const isServer = typeof window === 'undefined';

// Use LocalStorage on client, MemStorage on server as a fallback
export const storage = isServer ? new MemStorage() : new LocalStorage();
