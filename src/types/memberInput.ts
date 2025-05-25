import { Role } from "@prisma/client";

export interface MemberInput {
    id: string;
    role: Role;
}