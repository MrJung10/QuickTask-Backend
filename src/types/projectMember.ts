import { Role } from "@prisma/client";
import { User } from "./user";
import { Project } from "./project";

export interface ProjectMember {
    id: string;
    userId: string;
    projectId: string;
    role: Role;
    user: User;
    project: Project;
}