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

// Helper function to ensure project data conforms to the required type
function sanitizeProjectData(project: Partial<Project>): Project {
  return {
    id: project.id || 0,
    name: project.name || '',
    description: project.description === undefined ? null : project.description,
    userId: project.userId === undefined ? null : project.userId,
    blocks: project.blocks || [],
    createdAt: project.createdAt || new Date(),
    updatedAt: project.updatedAt || new Date()
  };
}

export class LocalStorageStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private projects: Map<number, Project> = new Map();
  private userIdCounter: number = 1;
  private projectIdCounter: number = 1;
  
  private readonly PROJECTS_KEY = 'html_editor_projects';
  private readonly USERS_KEY = 'html_editor_users';
  private readonly PROJECT_COUNTER_KEY = 'html_editor_project_counter';
  private readonly USER_COUNTER_KEY = 'html_editor_user_counter';

  constructor() {
    this.loadFromStorage();
  }
  
  private loadFromStorage() {
    // Initialize with defaults if no data exists
    this.users = new Map();
    this.projects = new Map();
    this.userIdCounter = 1;
    this.projectIdCounter = 1;
    
    if (typeof window !== 'undefined') {
      // Load projects
      const projectsJson = localStorage.getItem(this.PROJECTS_KEY);
      if (projectsJson) {
        try {
          const projectsData = JSON.parse(projectsJson);
          projectsData.forEach((project: Project) => {
            // Convert string dates back to Date objects
            project.createdAt = new Date(project.createdAt);
            project.updatedAt = new Date(project.updatedAt);
            this.projects.set(project.id, project);
          });
        } catch (e) {
          console.error('Failed to parse projects from localStorage:', e);
        }
      }
      
      // Load users
      const usersJson = localStorage.getItem(this.USERS_KEY);
      if (usersJson) {
        try {
          const usersData = JSON.parse(usersJson);
          usersData.forEach((user: User) => {
            this.users.set(user.id, user);
          });
        } catch (e) {
          console.error('Failed to parse users from localStorage:', e);
        }
      }
      
      // Load counters
      const projectCounter = localStorage.getItem(this.PROJECT_COUNTER_KEY);
      if (projectCounter) {
        this.projectIdCounter = parseInt(projectCounter, 10);
      }
      
      const userCounter = localStorage.getItem(this.USER_COUNTER_KEY);
      if (userCounter) {
        this.userIdCounter = parseInt(userCounter, 10);
      }
    }
  }
  
  private saveToStorage() {
    if (typeof window !== 'undefined') {
      // Save projects
      localStorage.setItem(
        this.PROJECTS_KEY,
        JSON.stringify(Array.from(this.projects.values()))
      );
      
      // Save users
      localStorage.setItem(
        this.USERS_KEY,
        JSON.stringify(Array.from(this.users.values()))
      );
      
      // Save counters
      localStorage.setItem(this.PROJECT_COUNTER_KEY, this.projectIdCounter.toString());
      localStorage.setItem(this.USER_COUNTER_KEY, this.userIdCounter.toString());
    }
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
    this.saveToStorage();
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
    
    const project = sanitizeProjectData({
      ...insertProject,
      id,
      createdAt: now,
      updatedAt: now
    });
    
    this.projects.set(id, project);
    this.saveToStorage();
    return project;
  }

  async updateProject(id: number, updateData: UpdateProject): Promise<Project | undefined> {
    const project = this.projects.get(id);
    if (!project) {
      return undefined;
    }

    const updatedProject = sanitizeProjectData({
      ...project,
      ...updateData,
      updatedAt: new Date()
    });

    this.projects.set(id, updatedProject);
    this.saveToStorage();
    return updatedProject;
  }

  async deleteProject(id: number): Promise<boolean> {
    const result = this.projects.delete(id);
    this.saveToStorage();
    return result;
  }
}

export const storage = new LocalStorageStorage();
