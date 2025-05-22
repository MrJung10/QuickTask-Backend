import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { sendSuccessResponse } from "utils/response.format";
import { MemberResource } from "../resources/MemberResource";

const prisma = new PrismaClient();

export class UserController {
    static async getAllMembers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
          const members = await prisma.user.findMany({
            where: {
              role: 'MEMBER',
            },
            select: {
              id: true,
              name: true,
              email: true,
              createdAt: true,
              memberships: {
                select: {
                    project: {
                        select: {
                            id: true,
                            name: true,
                            description: true
                        }
                    },
                    role: true
                }
              }
            },
          });
      
          sendSuccessResponse(res, MemberResource.collection(members), 'All members fetched successfully');
        } catch (error) {
          next(error);
        }
    }      
}