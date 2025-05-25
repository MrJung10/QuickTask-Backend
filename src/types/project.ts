import { ProjectMember } from "./projectMember";
import { Task } from "./task";
import { User } from "./user";

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