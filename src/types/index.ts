export type Plan = 'free' | 'pro' | 'enterprise';

export type ToolId = 'shorts' | 'thread' | 'newsletter' | 'blog' | 'carousel' | 'calendar';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface Tool {
  id: ToolId;
  name: string;
  description: string;
  icon: string;
  credits: number;
  locked: boolean;
}

export interface User {
  _id: string;
  email: string;
  plan: Plan;
  credits: number;
  createdAt: number;
}

export interface Job {
  _id: string;
  userId: string;
  tool: ToolId;
  status: JobStatus;
  input: string;
  outputId?: string;
  retries: number;
}

export interface Output {
  _id: string;
  userId: string;
  projectId: string;
  tool: ToolId;
  content: string;
  status: string;
  createdAt: number;
}
