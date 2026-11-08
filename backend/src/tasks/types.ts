export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  priority: Priority;
  done: boolean;
  createdAt: string;
}

export interface NewTask {
  title: string;
  priority: Priority;
}

export interface TaskRepository {
  list(): Promise<Task[]>;
  get(id: number): Promise<Task | undefined>;
  create(input: NewTask): Promise<Task>;
  setDone(id: number, done: boolean): Promise<Task | undefined>;
  remove(id: number): Promise<boolean>;
}
