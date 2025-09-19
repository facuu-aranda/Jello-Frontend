export interface User {
  id: string;
  name: string;
  email?: string; // El email puede ser opcional dependiendo del endpoint
  avatarUrl?: string;
  bannerUrl?: string;
  bio?: string;
  jobTitle?: string;
  timezone?: string;
  skills?: string[];
}

// Define la estructura de un proyecto
export interface Project {
  id: string;
  name: string;
  description: string;
  color: string; // Asumimos que el backend guardará el `className` de Tailwind
  progress: number;
  totalTasks: number;
  completedTasks: number;
  members: User[];
  dueDate?: string;
  isOwner: boolean;
  updatedAt: string; // Para ordenar
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

// Define la estructura de un To-Do personal
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

// Define la estructura de una notificación
export interface Notification {
  id: string;
  type: 'invitation' | 'comment' | 'reminder';
  title: string;
  message: string;
  time: string;
  avatar?: string;
}

// Define la estructura de un registro de actividad
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
  email?: string;      // <-- Incluimos el email opcional
  avatar?: string;
  banner?: string;
  skills?: string[];
}