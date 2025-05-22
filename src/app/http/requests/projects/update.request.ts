import { Request, Response, NextFunction, RequestHandler } from "express";
import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "utils/response.format";

export const UpdateProjectRequest: RequestHandler[] = [
    check("name", "Name is required").optional().not().isEmpty(),
    check("description", "Description is required").optional().not().isEmpty(),
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