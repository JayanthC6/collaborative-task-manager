import { Response, NextFunction } from 'express';
import { TaskService } from '../services/task.service';
import { CreateTaskDTOSchema, UpdateTaskDTOSchema, QueryTaskDTOSchema } from '../dtos/task.dto';
import { AuthRequest } from '../middleware/auth.middleware';

const taskService = new TaskService();

export class TaskController {
    setSocketServer(io: any) {
        taskService.setSocketServer(io);
    }

    async createTask(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const validatedData = CreateTaskDTOSchema.parse(req.body);
            const task = await taskService.createTask(validatedData, req.user!.id);
            res.status(201).json(task);
        } catch (error) {
            next(error);
        }
    }

    async getTasks(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const query = QueryTaskDTOSchema.parse(req.query);
            const tasks = await taskService.getTasks(query, req.user!.id);
            res.status(200).json(tasks);
        } catch (error) {
            next(error);
        }
    }

    async getTaskById(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const task = await taskService.getTaskById(req.params.id, req.user!.id);
            res.status(200).json(task);
        } catch (error) {
            next(error);
        }
    }

    async updateTask(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const validatedData = UpdateTaskDTOSchema.parse(req.body);
            const task = await taskService.updateTask(req.params.id, validatedData, req.user!.id);
            res.status(200).json(task);
        } catch (error) {
            next(error);
        }
    }

    async deleteTask(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const result = await taskService.deleteTask(req.params.id, req.user!.id);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }
}
