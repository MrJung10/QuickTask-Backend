import { Response } from "express";

export const sendResponse = (
  res: Response,
  data: any,
  message: string,
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    status: true,
    message: message,
    data: data,
  });
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = 500
) => {
  return res.status(statusCode).json({
    status: false,
    message: message,
  });
};
