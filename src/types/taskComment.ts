import { Task } from "./task";
import { User } from "./user";

export interface TaskComment {
    id: string;
    content: string;
    userId: string;
    taskId: string;
    createdAt: Date;
    user: User;
    task?: Task;
  }