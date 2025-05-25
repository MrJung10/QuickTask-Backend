import { TaskComment, TaskPriority, TaskStatus } from "@prisma/client";
import { Project } from "./project";
import { User } from "./user";

export interface Task {
    id: string;
    title: string;
    description?: string | null;
    priority: TaskPriority;
    status: TaskStatus;
    dueDate: Date;
    projectId: string;
    assigneeId?: string | null;
    project: Project;
    assignee?: User | null;
    comments: TaskComment[];
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface TaskFilter {
    status?: TaskStatus;
    assigneeId?: string;
    dueDate?: Date;
  }