import { Router, Request, Response, NextFunction } from 'express';
import * as userService from '../services/userService';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse } from '../types';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.getAllUsers();
    const response: ApiResponse<typeof users> = { success: true, data: users };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) throw new AppError('User not found', 404);
    const response: ApiResponse<typeof user> = { success: true, data: user };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// POST /users — NOTE: email validation intentionally missing (Session 1 + Session 4 Bug)
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new AppError('name, email, and password are required', 400);
    }
    const user = await userService.createUser(name, email, password);
    const response: ApiResponse<typeof user> = { success: true, data: user, message: 'User created' };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
