export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  priority: Priority;
  done: boolean;
  createdAt: string;
}

export interface TaskListResponse {
  tasks: Task[];
  summary: { total: number; done: number; open: number };
}
