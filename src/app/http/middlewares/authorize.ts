import { Request, Response, NextFunction } from 'express';
import { sendErrorResponse } from '../../../utils/response.format.js';

export function authorize(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const role = req.user?.role;

    if (!role || !roles.includes(role)) {
      sendErrorResponse(res, 'You do not have permission to access this resource.', 403);
      return;
    }

    next();
  };
}