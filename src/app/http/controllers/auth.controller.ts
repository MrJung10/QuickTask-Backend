import { Request, Response, NextFunction } from 'express';

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(201).json({ message: "User registered successfully." });
    } catch (err) {
      next(err);
    }
  };
  
  export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.status(200).json({ message: "Login successful." });
    } catch (err) {
      next(err);
    }
  };
  
