import { Router, Request, Response, NextFunction } from 'express';
import * as projectService from '../services/projectService';
import { AppError } from '../middleware/errorHandler';
import { ApiResponse, Project } from '../types';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projects = await projectService.getAllProjects();
    const response: ApiResponse<Project[]> = { success: true, data: projects };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.getProjectById(req.params.id);
    if (!project) throw new AppError('Project not found', 404);
    const response: ApiResponse<Project> = { success: true, data: project };
    res.json(response);
  } catch (err) {
    next(err);
  }
});

// POST /projects — NOTE: validate middleware intentionally NOT applied (Session 1 Lab)
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const project = await projectService.createProject(req.body);
    const response: ApiResponse<Project> = { success: true, data: project, message: 'Project created' };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleted = await projectService.deleteProject(req.params.id);
    if (!deleted) throw new AppError('Project not found', 404);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default router;
