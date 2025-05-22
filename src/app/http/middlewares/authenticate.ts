import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ message: 'Authorization header missing. Please provide a valid token' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET as string) as Express.UserPayload;
    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized Access.' });
  }
};
