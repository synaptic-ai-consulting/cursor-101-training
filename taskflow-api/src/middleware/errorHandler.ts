import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  if (err instanceof AppError) {
    const response: ApiResponse<null> = { success: false, error: err.message };
    res.status(err.statusCode).json(response);
    return;
  }

  // BUG #4 (Session 4): DB constraint errors leak internal details to the client
  // Should map pg error codes to friendly messages before sending
  const response: ApiResponse<null> = { success: false, error: err.message };
  res.status(500).json(response);
};

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
};
