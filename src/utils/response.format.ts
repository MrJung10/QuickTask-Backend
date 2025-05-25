import { Response } from "express";

export const sendSuccessResponse = <T> (
  res: Response,
  data: T,
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
