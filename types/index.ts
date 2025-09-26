// Este archivo centraliza todos los tipos de datos de la API para ser usados en el frontend.

// -------------------- USUARIOS --------------------
export interface UserSummary {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface UserProfile extends UserSummary {
  email: string;
  title: string | null;
  bio: string | null;
  timezone: string | null;
  skills: string[];
  bannerUrl: string | null;
}

export interface UserSettings {
  notifications: {
    tasks: { email: boolean; push: boolean; inApp: boolean };
    meetings: { email: boolean; push: boolean; inApp: boolean };
    team: { email: boolean; push: boolean; inApp: boolean };
    mentions: { email: boolean; push: boolean; inApp: boolean };
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
    animations: boolean;
  };
}

// -------------------- PROYECTOS --------------------
export interface ProjectSummary {
  id: string;
  name: string;
  description: string;
  color: string;
  progress: number;
  members: UserSummary[];
  isOwner: boolean;
  dueDate: string | null;
  totalTasks: number;
  completedTasks: number;
}

export interface ProjectDetails extends ProjectSummary {
  tasksByStatus: {
    todo: TaskSummary[];
    'in-progress': TaskSummary[];
    review: TaskSummary[];
    done: TaskSummary[];
  };
}

// -------------------- TAREAS --------------------
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

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: string;
  type: 'image' | 'document' | 'other';
}

export interface Comment {
  id: string;
  author: UserSummary;
  content: string;
  timestamp: string;
}

export interface TaskSummary {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  labels: Label[];
  assignees: UserSummary[];
  dueDate: string | null;
  subtasks: {
    total: number;
    completed: number;
  };
  commentCount: number;
  attachmentCount: number;
  projectId: string;
}

export interface TaskDetails extends Omit<TaskSummary, 'subtasks' | 'commentCount' | 'attachmentCount'> {
  description: string | null;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  subtasks: Subtask[];
  comments: Comment[];
  attachments: Attachment[];
}

// -------------------- OTROS --------------------
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate: string | null; // ISO 8601 Date String
  createdAt: string; // ISO 8601 Date String
}

export interface Activity {
  id: string;
  type: 'comment' | 'completion' | 'join' | 'document';
  user: UserSummary;
  action: string; 
  target: string;
  time: string;
  projectId: string;
}

// CORRECCIÓN: Tipo 'SearchResult' ajustado a la respuesta real de la API
export interface SearchResult {
  type: 'project' | 'user';
  id: string;
  name: string;
  description: string | null;
  avatar: string | null;
  // Propiedades opcionales para manejar datos extra
  skills?: string[];
  banner?: string;
}

