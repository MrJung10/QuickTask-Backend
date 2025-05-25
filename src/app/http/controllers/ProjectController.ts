import { PrismaClient, Role } from "@prisma/client";
import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse, sendSuccessResponse } from "utils/response.format";
import { ProjectResource } from "../resources/ProjectResource";
import { ProjectDetailsResource } from "../resources/ProjectDetailsResource";
import { MemberInput } from "types/memberInput";
import { ProjectUpdate } from "types/project";

const prisma = new PrismaClient();
export class ProjectController {

      static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const user = req.user;
      
          const projects = await prisma.project.findMany({
            where: {
              members: {
                some: {
                  userId: user?.id,
                },
              },
            },
            include: {
              members: {
                select: {
                  userId: true,
                  role: true,
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      role: true
                    },
                  },
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          });
      
          sendSuccessResponse(res, ProjectResource.collection(projects), 'Projects fetched successfully');
        } catch (error) {
          next(error);
        }
      }

    static async details(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const { id } = req.params;
        const authUser = req.user;
    
        if (!authUser || !authUser.id) {
          sendErrorResponse(res, 'Unauthorized: User not found', 401);
          return;
        }
    
        const project = await prisma.project.findUnique({
          where: {
            id,
            members: {
              some: {
                userId: authUser.id,
              },
            },
          },
          include: {
            members: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                  },
                },
              },
            },
            tasks: {
              include: {
                assignee: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                  },
                },
              },
              orderBy: {
                createdAt: 'desc',
              },
            },
          },
        });
    
        if (!project) {
          sendErrorResponse(res, 'Project not found or unauthorized', 404);
          return;
        }
    
        sendSuccessResponse(res, ProjectDetailsResource.toJSON(project), 'Project details fetched successfully');
      } catch (error) {
        next(error);
      }
    }

      static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { name, description, members = [], startDate, deadline } = req.body;

          if (!startDate || isNaN(Date.parse(startDate))) {
            sendErrorResponse(res, 'Invalid or missing startDate', 400);
            return;
          }
          if (!deadline || isNaN(Date.parse(deadline))) {
            sendErrorResponse(res, 'Invalid or missing deadline', 400);
            return;
          }
      
          const authUser = req.user;

          if (!authUser || !authUser.id) {
            sendErrorResponse(res, 'Unauthorized: User not found', 401);
            return;
          }
      
          const project = await prisma.project.create({
            data: {
              name,
              description,
              ownerId: authUser.id,
              startDate: new Date(startDate),
              deadline: new Date(deadline),
              members: {
                create: [
                  {
                    userId: authUser.id,
                    role: Role.ADMIN,
                  },
                  ...members.map((member: { userId: string; role: Role }) => ({
                      userId: member.userId,
                      role: member.role
                  })),
                ],
              },
            },
            include: {
              owner: true,
              members: {
                include: {
                  user: true,
                }
              },
            },
          });
      
          if (!project) {
            sendErrorResponse(res, 'Failed to create project', 500);
            return;
          }

        const data = {
            id: project.id,
            name: project.name,
            description: project.description,
            owner: {
                id: project.ownerId,
                name: project.owner.name,
                email: project.owner.email,
            },
            members: project.members.map((member: { userId: string; user: { id: string; name: string; email: string; role: Role}; role: Role }) => ({
                id: member.userId,
                name: member.user.name,
                email: member.user.email,
                role: member.role,
            })),
        }

        sendSuccessResponse(res, data, 'Project created successfully.');
        return;
        } catch (error) {
          next(error);
        }
      }

      static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { id } = req.params;
          const { name, description, members = [], startDate, deadline } = req.body;
          const user = req.user;
      
          const existing = await prisma.project.findUnique({
            where: { id },
            include: { members: true },
          });
      
          if (!existing || existing.ownerId !== user?.id) {
            sendErrorResponse(res, 'Unauthorized or Project not found', 403);
            return;
          }
      
          // Filter out the owner if they are accidentally added to members
          const sanitizedMembers: MemberInput[] = members
            .filter((m: MemberInput) => m.id !== user.id)
            .filter(
              (m: MemberInput, index: number, self: MemberInput[]) =>
                self.findIndex((x) => x.id === m.id) === index
          );

          // Validate startDate and deadline
          const updates: ProjectUpdate = { name, description };
          if (startDate) {
            if (isNaN(Date.parse(startDate))) {
              sendErrorResponse(res, 'Invalid startDate format', 400);
              return;
            }
            updates.startDate = new Date(startDate);
          }

          if (deadline) {
            if (isNaN(Date.parse(deadline))) {
              sendErrorResponse(res, 'Invalid deadline format', 400);
              return;
            }
            updates.deadline = new Date(deadline);
          }
      
          // Transaction: Update project + replace members (excluding owner)
          const updated = await prisma.$transaction(async (tx) => {
            await tx.project.update({
              where: { id },
              data: updates,
            });
      
            // Delete all members except owner
            await tx.projectMember.deleteMany({
              where: {
                projectId: id,
                NOT: { userId: user.id },
              },
            });
      
            // Add new members
            if (sanitizedMembers.length > 0) {
              await tx.projectMember.createMany({
                data: sanitizedMembers.map((m: MemberInput) => ({
                  projectId: id,
                  userId: m.id,
                  role: m.role,
                })),
              });
            }
      
            // Return full project with members
            return tx.project.findUnique({
              where: { id },
              include: {
                members: true,
              },
            });
          });
      
          const data = {
            id: updated?.id,
            name: updated?.name,
            description: updated?.description,
            members: updated?.members.map((m) => ({
              userId: m.userId,
              role: m.role,
            })),
          };
      
          sendSuccessResponse(res, data, 'Project updated successfully');
        } catch (error) {
          next(error);
        }
      }

      static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { id } = req.params;
          const user = req.user;
      
          const project = await prisma.project.findUnique({
            where: { id },
            include: { members: true },
          });
      
          if (!project || project.ownerId !== user?.id) {
            sendErrorResponse(res, 'Unauthorized or Project not found', 403);
            return;
          }
      
          await prisma.$transaction(async (tx) => {
            // Delete all related members
            await tx.projectMember.deleteMany({ where: { projectId: id } });
      
            // Delete all related tasks
            await tx.task.deleteMany({ where: { projectId: id } });
      
            // Delete the project
            await tx.project.delete({ where: { id } });
          });
      
          sendSuccessResponse(res, null, 'Project deleted successfully');
        } catch (error) {
          next(error);
        }
      }      


      static async inviteMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { id } = req.params; // projectId
          const { members } = req.body;
          const user = req.user;
      
          const project = await prisma.project.findUnique({ where: { id } });
          if (!project || project.ownerId !== user?.id) {
            sendErrorResponse(res, 'Unauthorized or Project not found', 403);
            return;
          }
      
          const bulkCreate = members.map((member: {
            userId: string;
            role: string;
          }) => ({
            userId: member.userId,
            projectId: id,
            role: member.role,
          }));
      
          await prisma.projectMember.createMany({
            data: bulkCreate,
            skipDuplicates: true,
          });
      
          sendSuccessResponse(res, null, 'Members invited successfully');
        } catch (error) {
          next(error);
        }
      }      
      
}