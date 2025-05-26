import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { check, validationResult } from "express-validator";
import { sendErrorResponse } from "../../../../utils/response.format.js";

const prisma = new PrismaClient();

export const RegisterRequest: RequestHandler[] = [
    check("name", "Name is required").not().isEmpty(),

    check("email", "Email is required").not().isEmpty(),

    check("email", "Please include a valid email")
    .isEmail()
    .custom(async (email: string) => {
      const user = await prisma.user.findUnique({
        where: { email },
      });
      if (user) {
        throw new Error("User email already exists.");
      }
    }),
  
    check(
      "password",
      "Please enter a password with 8 or more characters"
    ).isLength({ min: 8 }),

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