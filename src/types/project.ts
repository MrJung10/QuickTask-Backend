import { ProjectMember } from "./projectMember";
import { Task } from "./task.js";
import { User } from "./user.js";

export interface Project {
    id: string;
    name: string;
    description?: string | null;
    ownerId: string;
    owner: User;
    members: ProjectMember[];
    startDate?: Date | null;
    deadline?: Date | null;
    createdAt: Date;
    tasks: Task[];
}

export interface ProjectUpdate {
    name?: string;
    description?: string | null;
    startDate?: Date | null;
    deadline?: Date | null;
  }