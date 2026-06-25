import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';

// INCOMPLETE (Session 1 Lab): This middleware exists but is not applied to any routes yet.
// Students will add @docs context and use Cursor to complete validation logic.

export const validateCreateTask = (req: Request, res: Response, next: NextFunction): void => {
  const { title } = req.body;
  // TODO: add full validation (title required, status enum, priority enum, due_date format)
  if (!title || typeof title !== 'string') {
    throw new AppError('title is required', 400);
  }
  next();
};

export const validateCreateProject = (req: Request, res: Response, next: NextFunction): void => {
  const { name, owner_id } = req.body;
  // TODO: add full validation (name required, owner_id must be a valid UUID)
  if (!name) {
    throw new AppError('name is required', 400);
  }
  next();
};
