import { PrismaClient, TaskStatus } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { sendErrorResponse, sendSuccessResponse } from "utils/response.format";
import { TaskResource } from "../resources/TaskResource";
import { TaskCommentResource } from "../resources/TaskCommentResource";
import { TaskFilter } from "types/task";
import { normalizeDueDate } from "utils/date";


const prisma = new PrismaClient();

export class TaskController {
      static async search(req: Request, res: Response) {
        try {
          const { keyword } = req.query;
      
          const tasks = await prisma.task.findMany({
            where: {
              title: {
                contains: String(keyword),
                mode: 'insensitive',
              },
            },
            include: { assignee: true, project: true },
          });
      
          sendSuccessResponse(res, tasks, 'Tasks fetched successfully');
          return;
        } catch (error) {
          console.error('Search error:', error);
          sendErrorResponse(res, 'Something went wrong', 500);
          return;
        }
      }

      static async filter(req: Request, res: Response): Promise<void> {
        try {
          const { status, assigneeId, dueDate } = req.query;
      
          const filters: TaskFilter = {};
      
          // Normalize status
          if (status && typeof status === 'string') {
            const normalizedStatus = status.toUpperCase();
            if (Object.values(TaskStatus).includes(normalizedStatus as TaskStatus)) {
              filters.status = normalizedStatus as TaskStatus;
            } else {
              sendErrorResponse(res, 'Invalid task status provided. Status must be one of TODO, IN_PROGRESS, REVIEW, DONE', 400);
              return;
            }
          }
      
          // Filter by assigneeId
          if (assigneeId && typeof assigneeId === 'string') {
            filters.assigneeId = assigneeId;
          }
      
          // Filter by dueDate (ISO format recommended)
          if (dueDate) {
            const date = new Date(dueDate as string);
            if (!isNaN(date.getTime())) {
              filters.dueDate = date;
            } else {
              sendErrorResponse(res, 'Invalid dueDate format', 400);
              return
            }
          }
      
          const tasks = await prisma.task.findMany({
            where: filters,
            include: {
              assignee: true,
              project: true,
            },
          });
      
          sendSuccessResponse(res, tasks, 'Tasks fetched successfully');
          return;
        } catch (error) {
          console.error('Task filter error:', error);
          sendErrorResponse(res, 'Something went wrong', 500);
          return;
        }
      }

      static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { id: projectId } = req.params;
          const { title, description, priority, status, dueDate, assigneeId } = req.body;
          const user = req.user;

          if (!projectId) {
            sendErrorResponse(res, 'Project ID is required', 400);
            return;
          }

          const isMember = await prisma.projectMember.findFirst({
            where: {
              projectId,
              userId: user?.id,
            },
          });

          if (!isMember) {
            sendErrorResponse(res, 'Unauthorized', 403);
            return;
          }
    
          const task = await prisma.task.create({
            data: {
              title,
              description,
              priority,
              status: status ?? TaskStatus.TODO,
              dueDate: normalizeDueDate(dueDate),
              projectId,
              assigneeId,
            },
          });

          const fullTask = await prisma.task.findUnique({
            where: { id: task.id },
            include: {
              assignee: true,
              comments: true,
            },
          });

          if (!fullTask) {
            sendErrorResponse(res, 'Task not found', 404);
            return;
          }

          const transformed = TaskResource.toObject(fullTask);
    
          sendSuccessResponse(res, transformed, 'Task created successfully');
        } catch (error) {
          next(error);
        }
      }
    
      static async index(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { id: projectId } = req.params;
          const user = req.user;

          if (!projectId) {
            sendErrorResponse(res, 'Project ID is required', 400);
            return;
          }
    
          const isMember = await prisma.projectMember.findFirst({
            where: { projectId, userId: user?.id },
          });
          if (!isMember) {
            sendErrorResponse(res, 'Unauthorized', 403);
            return;
          }
    
          const tasks = await prisma.task.findMany({
            where: { projectId },
            include: { assignee: true, comments: true },
          });

          const transformedTasks = TaskResource.toArray(tasks);

    
          sendSuccessResponse(res, transformedTasks, 'Tasks fetched successfully');
        } catch (error) {
          next(error);
        }
      }
    
      static async show(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { taskId } = req.params;
          const user = req.user;

          if (!taskId) {
            sendErrorResponse(res, 'Task ID is required', 400);
            return;
          }
    
          const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: { assignee: true, comments: true },
          });
    
          if (!task) {
            sendErrorResponse(res, 'Task not found', 404);
            return;
          }
    
          const isMember = await prisma.projectMember.findFirst({
            where: { projectId: task.projectId, userId: user?.id },
          });
          if (!isMember) {
            sendErrorResponse(res, 'Unauthorized', 403);
            return;
          }
          
          const transformed = TaskResource.toObject(task);
    
          sendSuccessResponse(res, transformed, 'Task fetched successfully');
        } catch (error) {
          console.log(error);
          next(error);
        }
      }
    
      static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { taskId } = req.params;
          const user = req.user;

          if (!taskId) {
            sendErrorResponse(res, 'Task ID is required', 400);
            return;
          }
    
          const task = await prisma.task.findUnique({ where: { id: taskId } });
    
          if (!task) {
            sendErrorResponse(res, 'Task not found', 404);
            return;
          }
    
          const isAdminOrAssignee =
            user?.role === 'ADMIN' || task.assigneeId === user?.id;
    
          if (!isAdminOrAssignee) {
            sendErrorResponse(res, 'Unauthorized', 403);
            return;
          }

          const fullTask = await prisma.task.findUnique({
            where: { id: task.id },
            include: {
              assignee: true,
              comments: true,
            },
          });

          if (!fullTask) {
            sendErrorResponse(res, 'Task not found', 404);
            return;
          }
          
          const transformed = TaskResource.toObject(fullTask);
    
          sendSuccessResponse(res, transformed, 'Task updated');
        } catch (error) {
          next(error);
        }
      }
    
      // Delete Task (Admin Only)
      static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { taskId } = req.params;
          const user = req.user;

          if (!taskId) {
            sendErrorResponse(res, 'Task ID is required', 400);
            return;
          }
    
          const task = await prisma.task.findUnique({ where: { id: taskId } });
    
          if (!task || user?.role !== 'ADMIN') {
            sendErrorResponse(res, 'Unauthorized or Task not found', 403);
            return;
          }
    
          await prisma.task.delete({ where: { id: taskId } });
          sendSuccessResponse(res, null, 'Task deleted');
        } catch (error) {
          next(error);
        }
      }
    
      // Comments
      static async addComment(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { taskId } = req.params;
          const { content } = req.body;
          const user = req.user;

          if (!taskId) {
            sendErrorResponse(res, 'Task ID is required', 400);
            return;
          }

          if (!user?.id) {
            sendErrorResponse(res, 'User not authenticated', 401);
            return;
          }
    
          const task = await prisma.task.findUnique({ where: { id: taskId } });
    
          if (!task) {
            sendErrorResponse(res, 'Task not found', 404);
            return;
          }
    
          const isMember = await prisma.projectMember.findFirst({
            where: { projectId: task.projectId, userId: user?.id },
          });
          if (!isMember) {
            sendErrorResponse(res, 'Unauthorized', 403);
            return;
          }
    
          const comment = await prisma.taskComment.create({
            data: {
              content,
              userId: user?.id,
              taskId,
            },
            include: { user: true },
          });
    
          
          const transformed = TaskCommentResource.toJSON(comment);
          sendSuccessResponse(res, transformed, 'Comment added');
        } catch (error) {
          next(error);
        }
      }
    
      static async getComments(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const { taskId } = req.params;
          const user = req.user;

          if (!taskId) {
            sendErrorResponse(res, 'Task ID is required', 400);
            return;
          }
    
          const task = await prisma.task.findUnique({ where: { id: taskId } });
    
          if (!task) {
            sendErrorResponse(res, 'Task not found', 404);
            return;
          }
    
          const isMember = await prisma.projectMember.findFirst({
            where: { projectId: task.projectId, userId: user?.id },
          });
          if (!isMember) {
            sendErrorResponse(res, 'Unauthorized', 403);
            return;
          }
    
          const comments = await prisma.taskComment.findMany({
            where: { taskId },
            include: { user: true },
            orderBy: { createdAt: 'desc' },
          });
    
          
          const transformed = TaskCommentResource.collection(comments);
          sendSuccessResponse(res, transformed, 'Comments fetched');
        } catch (error) {
          next(error);
        }
      }

      static async updateComment(req: Request, res: Response) {
        const { id: projectId, taskId, commentId } = req.params;
        const { content } = req.body;
        const userId = req.user?.id;
      
        try {
          const existingComment = await prisma.taskComment.findFirst({
            where: {
              id: commentId,
              userId,
              task: {
                id: taskId,
                projectId: projectId,
              },
            },
          });
      
          if (!existingComment) {
            sendErrorResponse(res, 'Comment not found or unauthorized', 404);
            return;
          }
      
          const updatedComment = await prisma.taskComment.update({
            where: { id: commentId },
            data: { content },
            include: { user: true },
          });
      
          
          const transformed = TaskCommentResource.toJSON(updatedComment);
          sendSuccessResponse(res, transformed, 'Comment updated successfully');
          return;
        } catch (err) {
          console.error('updateComment error:', err);
          sendErrorResponse(res, 'Server error', 500);
          return;
        }
      }

      static async destroyComment(req: Request, res: Response) {
        const { id: projectId, taskId, commentId } = req.params;
        const userId = req.user?.id;
      
        try {
          const comment = await prisma.taskComment.findFirst({
            where: {
              id: commentId,
              userId,
              task: {
                id: taskId,
                projectId: projectId,
              },
            },
          });
      
          if (!comment) {
            sendErrorResponse(res, 'Comment not found or unauthorized', 404);
            return;
          }
      
          await prisma.taskComment.delete({ where: { id: commentId } });
      
          sendSuccessResponse(res, null, 'Comment deleted successfully');
          return;
        } catch (err) {
          console.error('destroyComment error:', err);
          sendErrorResponse(res, 'Server error', 500);
          return;
        }
      }      
}