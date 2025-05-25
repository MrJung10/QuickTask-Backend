import { Role } from "@prisma/client";
import { ProjectMember } from "./projectMember";

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: Role;
  refreshToken: string | null;
  createdAt: Date;
  memberships: ProjectMember[];
}