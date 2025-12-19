import { Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDTOSchema, LoginDTOSchema } from '../dtos/auth.dto';
import { AuthRequest } from '../middleware/auth.middleware';

const authService = new AuthService();

export class AuthController {
    async register(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const validatedData = RegisterDTOSchema.parse(req.body);
            const result = await authService.register(validatedData);
            res.status(201).json(result);
        } catch (error) {
            next(error);
        }
    }

    async login(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const validatedData = LoginDTOSchema.parse(req.body);
            const result = await authService.login(validatedData);
            res.status(200).json(result);
        } catch (error) {
            next(error);
        }
    }

    async getMe(req: AuthRequest, res: Response, next: NextFunction) {
        try {
            res.status(200).json({ user: req.user });
        } catch (error) {
            next(error);
        }
    }

    async getAllUsers(_req: AuthRequest, res: Response, next: NextFunction) {
        try {
            const users = await authService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    }
}
