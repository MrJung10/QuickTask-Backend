import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction, RequestHandler } from "express";
import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../../../../utils/response.format.js";

const prisma = new PrismaClient();

export const CreateTaskRequest: RequestHandler[] = [
  check("title", "Title is required").not().isEmpty(),
  check("priority", "Priority is required").not().isEmpty(),
  check("priority", "Invalid priority. Priority must be one of LOW, MEDIUM, HIGH, CRITICAL")
    .isIn(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  check("status", "Invalid task status. Status must be one of TODO, IN_PROGRESS, REVIEW, DONE")
    .optional()
    .isIn(["TODO", "IN_PROGRESS", "REVIEW", "DONE"]),
  check("dueDate", "Due date is required").not().isEmpty(),
  // check("dueDate", "Due date must be a valid ISO date").isISO8601(),


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
