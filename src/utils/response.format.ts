import { Response } from "express";

export const sendSuccessResponse = (
  res: Response,
  data: any,
  message: string,
  statusCode: number = 200
) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
  });
};

export const sendErrorResponse = (
  res: Response,
  message: string,
  statusCode: number = 500
) => {
  return res.status(statusCode).json({
    success: false,
    message: message,
  });
};
