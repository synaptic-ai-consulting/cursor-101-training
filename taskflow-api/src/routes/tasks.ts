import { Router, Request, Response, NextFunction } from 'express';
import * as taskService from '../services/taskService';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse, Task } from '../types';

const router = Router();

// GET /tasks — list all tasks (supports ?status=, ?priority=, ?project_id= filters)
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, priority, project_id } = req.query;
    const tasks = await taskService.getAllTasks({
      status: status as string,
      priority: priority as string,
      project_id: project_id as string,
    });
    const response: ApiResponse<Task[]> = { success: true, data: tasks };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// GET /tasks/:id
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.getTaskById(req.params.id);
    if (!task) throw new AppError('Task not found', 404);
    const response: ApiResponse<Task> = { success: true, data: task };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// POST /tasks — NOTE: validate middleware intentionally NOT applied (Session 1 Lab)
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.createTask(req.body);
    const response: ApiResponse<Task> = { success: true, data: task, message: 'Task created' };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
});

// PATCH /tasks/:id
router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const task = await taskService.updateTask(req.params.id, req.body);
    if (!task) throw new AppError('Task not found', 404);
    const response: ApiResponse<Task> = { success: true, data: task };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// DELETE /tasks/:id
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await taskService.deleteTask(req.params.id);
    if (!deleted) throw new AppError('Task not found', 404);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
