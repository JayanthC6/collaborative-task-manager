import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
const taskController = new TaskController();

// All task routes require authentication
router.use(authMiddleware);

router.post('/', (req, res, next) => taskController.createTask(req, res, next));
router.get('/', (req, res, next) => taskController.getTasks(req, res, next));
router.get('/:id', (req, res, next) => taskController.getTaskById(req, res, next));
router.put('/:id', (req, res, next) => taskController.updateTask(req, res, next));
router.delete('/:id', (req, res, next) => taskController.deleteTask(req, res, next));

export { router as default, taskController };
