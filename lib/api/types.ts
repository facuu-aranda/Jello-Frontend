export interface User {
  id: string;
  name: string;
  email?: string; 
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
  jobTitle?: string;
  timezone?: string;
  skills?: string[];
}

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

// 👇 --- NUEVA INTERFAZ PARA MIEMBROS DE PROYECTO --- 👇
export interface ProjectMember {
  user: string;
  _id: string;
  role: 'owner' | 'admin' | 'member';
}

// Define la estructura de un proyecto
export interface Project {
  _id: string;
  id: string; // Mantenemos 'id' por si se usa en otro lado, pero _id es la fuente
  name: string;
  description: string;
  color: string; 
  progress: number;
  totalTasks: number;
  completedTasks: number;
  members: ProjectMember[];
  dueDate?: string;
  isOwner: boolean;
  updatedAt: string; 
  avatarUrl?: string;
  bannerUrl?: string;
}

// Define la estructura de una tarea
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'critical';
  project: string; 
  projectId: string;
  dueDate?: string;
  subtasks: Subtask[]; 
  comments: number;
  attachments: number;
  labels: Label[];
  assignees: User[];
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export interface Notification {
  id: string;
  type: 'invitation' | 'comment' | 'reminder';
  title: string;
  message: string;
  time: string;
  avatar?: string;
}

export interface Activity {
  id: string;
  type: string;
  user: {
    name: string;
    avatar: string;
  };
  action: string;
  target: string;
  time: string;
  projectId: string;
}

export interface SearchResult {
  type: 'user' | 'project';
  id: string;
  name: string;
  description: string;
  email?: string;
  avatar?: string;
  banner?: string;
  skills?: string[];
}