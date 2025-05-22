import { PrismaClient, Role } from '@prisma/client';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from 'utils/jwt';
import redis from 'config/redis';
import { sendErrorResponse, sendSuccessResponse } from 'utils/response.format';
import { send } from 'process';

const prisma = new PrismaClient();

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, email, password } = req.body;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        sendErrorResponse(res, 'Email already exists.', 400);
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role: Role.MEMBER,
        },
      });

      const user_details = { id: user.id, name: user.name, email: user.email, role: user.role };

      sendSuccessResponse(res, user_details, 'User registered successfully.');
      return;
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        sendErrorResponse(res, 'Invalid credentials.', 401);
        return;
      }

      const payload = { id: user.id, role: user.role };

      const accessToken = generateAccessToken(payload);
      const refreshToken = generateRefreshToken(payload);
      const userDetails = { id: user.id, name: user.name, email: user.email, role: user.role };

      sendSuccessResponse(res, { accessToken, refreshToken, userDetails }, 'Login successful.');
      return;
    } catch (error) {
      next(error);
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    const userId = req.user?.id;

    if (!userId) {
      sendErrorResponse(res, 'User ID is missing', 400);    
      return;
    }

    try {
      await redis.del(userId.toString());
      sendSuccessResponse(res, null, 'Logged out successfully.');
      return;
    } catch (error) {
      sendErrorResponse(res, 'Error while logging out' , 500);
      return;
    }
  }

static async refreshToken(req: Request, res: Response): Promise<void> {
    const { refreshToken } = req.body;
    if (!refreshToken) {
    //   return res.status(400).json({ message: 'Refresh token required' });
        sendErrorResponse(res, 'Refresh token required', 400);
        return;
    }
  
    try {
      const payload = verifyRefreshToken(refreshToken);

      if (typeof payload === 'string' || !('id' in payload) || !('role' in payload)) {
        sendErrorResponse(res, 'Invalid refresh token', 401);
        return;
      }

      const accessToken = generateAccessToken({ id: payload.id, role: payload.role });
  
      sendSuccessResponse(res, { accessToken }, 'Refresh token successful.');
      return;
    } catch (err) {
      sendErrorResponse(res, 'Invalid refresh token', 401);
      return;
    }
  }
}
