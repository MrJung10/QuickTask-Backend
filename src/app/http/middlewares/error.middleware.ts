import {  Response } from 'express';

export const errorHandler = (err: any, res: Response) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message || "Something went wrong" });
};
