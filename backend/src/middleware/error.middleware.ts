import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

export const errorMiddleware = (
    error: Error,
    _req: Request,
    res: Response,
    _next: NextFunction
) => {
    console.error('Error:', error);

    // Zod validation errors
    if (error instanceof ZodError) {
        return res.status(400).json({
            error: 'Validation error',
            details: error.errors.map((err) => ({
                field: err.path.join('.'),
                message: err.message,
            })),
        });
    }

    // Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            return res.status(409).json({
                error: 'A record with this value already exists',
            });
        }
        if (error.code === 'P2025') {
            return res.status(404).json({
                error: 'Record not found',
            });
        }
    }

    // JWT errors
    if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
            error: 'Invalid token',
        });
    }

    if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
            error: 'Token expired',
        });
    }

    // Custom application errors
    if (error.message === 'User with this email already exists') {
        return res.status(409).json({ error: error.message });
    }

    if (error.message === 'Invalid credentials') {
        return res.status(401).json({ error: error.message });
    }

    if (error.message === 'Task not found' || error.message === 'User not found') {
        return res.status(404).json({ error: error.message });
    }

    if (error.message.startsWith('Unauthorized')) {
        return res.status(403).json({ error: error.message });
    }

    // Default error
    return res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
};
