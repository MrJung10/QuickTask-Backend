import { NextFunction, Request, Response } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';
  res.status(status).json({
    message: 'Something went wrong!',
    error: message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });
}
