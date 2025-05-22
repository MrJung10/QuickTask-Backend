import { PrismaClient, Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { sendErrorResponse } from "utils/response.format";

const prisma = new PrismaClient();

export function requireProjectRole(roles: Role[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const projectId = req.params.id;
      const userId = req.user?.id;

      console.log(projectId, userId);

      if (!userId || !projectId) {
        sendErrorResponse(res, 'Invalid user or project ID. ', 400);
        return;
      }
  
      const membership = await prisma.projectMember.findUnique({
        where: { userId_projectId: { userId, projectId } }
      });
  
      if (!membership || !roles.includes(membership.role as Role)) {
        sendErrorResponse(res, 'Insufficient permission. You are not a member of this project', 403);
        return;
      }
  
      next();
    };
  }