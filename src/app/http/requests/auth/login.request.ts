import { Request, Response, NextFunction, RequestHandler } from "express";
import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../../../../utils/response.format.js";

export const LoginRequest: RequestHandler[] = [
  check("email", "Email is required").notEmpty(),

  check("email", "Please include a valid email").isEmail(),

  check("password", "Password is required").exists(),

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
