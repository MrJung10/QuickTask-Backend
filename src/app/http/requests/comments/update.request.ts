import { NextFunction, Request, RequestHandler, Response } from "express";
import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "utils/response.format";

export const UpdateCommentRequest: RequestHandler[] = [
    check("content", "Comment content is required").not().isEmpty(),
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
  