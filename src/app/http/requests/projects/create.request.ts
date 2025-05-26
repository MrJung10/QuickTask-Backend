import { Request, Response, NextFunction, RequestHandler } from "express";
import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../../../../utils/response.format.js";

export const CreateProjectRequest: RequestHandler[] = [
  check("name", "Name is required").not().isEmpty(),
  check("description", "Description is required").not().isEmpty(),
  check("startDate", "Start date is required").not().isEmpty(),
  check("deadline", "End date is required").not().isEmpty(),
  check("members", "Members is required").not().isEmpty(),
  check("members", "Members must be an array").isArray(),
  check("members.*.userId", "Member userId is required").not().isEmpty(),
  check("members.*.role", "Member role is required").not().isEmpty(),
  check("members.*.role", "Member role must be a valid role").isIn(["ADMIN", "MEMBER"]),
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