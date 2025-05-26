import { Task } from "./task.js";
import { User } from "./user.js";

export interface TaskComment {
    id: string;
    content: string;
    userId: string;
    taskId: string;
    createdAt: Date;
    user: User;
    task?: Task;
  }