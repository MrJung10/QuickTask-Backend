import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "utils/response.format";

const prisma = new PrismaClient();

export const UpdateTaskRequest: RequestHandler[] = [
    check("title", "Title must be a string").optional().isString(),
    check("priority", "Invalid priority. Priority must be one of LOW, MEDIUM, HIGH, CRITICAL")
      .optional()
      .isIn(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
    check("status", "Invalid task status. Status must be one of TODO, IN_PROGRESS, REVIEW, DONE")
      .optional()
      .isIn(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]),
    check("dueDate", "Due date must be a valid ISO date")
      .optional()
      .isISO8601(),

    check("assigneeId", "Assignee ID must be a string")
    .optional()
    .isString()
    .withMessage("Assignee ID must be a string")
    .custom(async (assigneeId, { req }) => {
        const projectId = req?.params?.id;
      const isMember = await prisma.projectMember.findFirst({
        where: {
          projectId,
          userId: assigneeId,
        },
      });

      if (!isMember) {
        throw new Error("Assignee is not a member of the project");
      }
    }),
    async (req: Request, res: Response, next: NextFunction): Promise<void> => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const firstError = errors.array()[0];
        sendErrorResponse(res, firstError.msg, 400);
        return;
      }
      next();
    },
];
  