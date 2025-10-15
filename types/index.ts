// Archivo: Jello-Frontend/types/index.ts

// -------------------- USUARIOS --------------------
export interface UserSummary {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface UserProfile extends UserSummary {
  email: string;
  bannerUrl: string | null;
  title: string | null;
  bio: string | null;
  timezone: string | null;
  skills: string[];
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
  projectImageUrl: string | null;
  bannerImageUrl: string | null;  
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
  _id: string;
  name: string;
  color: string;
}

export interface Attachment {
  _id: string;
  name: string;
  url: string;
  size: string;
  type: 'image' | 'document' | 'other';
}

// --- INTERFAZ CORREGIDA ---
export interface Comment {
  id: string;
  author: UserSummary;
  content: string;
  timestamp: string;
  attachmentUrl?: string; 
}

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface TaskSummary {
  id: string;
  title: string;
  description?: string | null;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: TaskPriority;
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
  _id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  dueDate: string | null;
  createdAt: string;
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

export interface SearchResult {
  type: 'project' | 'user';
  id: string;
  name: string;
  description: string | null;
  avatar: string | null;
  skills?: string[];
  banner?: string;
}

/*------------------------ Notifications --------------------*/

export interface NotificationProjectSummary {
  _id: string
  name: string
}

export interface Notification {
  _id: string;
  recipient: string;
  sender: UserSummary;
  type:
    | "project_invitation"
    | "collaboration_request"
    | "task_created"
    | "task_assigned"
    | "task_status_changed"
    | "new_comment"
    | "invitation_accepted"
    | "invitation_declined"
    | "collaboration_accepted"
    | "collaboration_declined";
  status: "pending" | "accepted" | "declined" | "info"; // Se añade 'info'
  read: boolean;
  project: {
    _id: string;
    name: string;
  };
  task?: string;
  text: string; 
  link: string;
  createdAt: string;
  updatedAt: string;
}
