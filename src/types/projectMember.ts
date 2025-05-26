import { Role } from "@prisma/client";
import { User } from "./user.js";
import { Project } from "./project.js";

export interface ProjectMember {
    id: string;
    userId: string;
    projectId: string;
    role: Role;
    user: User;
    project: Project;
}