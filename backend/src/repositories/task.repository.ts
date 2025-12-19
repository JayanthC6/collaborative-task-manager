import { PrismaClient, Task, Prisma } from '@prisma/client';
import { QueryTaskDTO } from '../dtos/task.dto';

const prisma = new PrismaClient();

export class TaskRepository {
    async createTask(data: Prisma.TaskCreateInput): Promise<Task> {
        return prisma.task.create({
            data,
            include: {
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
                assignedTo: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }

    async findTaskById(id: string): Promise<Task | null> {
        return prisma.task.findUnique({
            where: { id },
            include: {
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
                assignedTo: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }

    async findTasks(query: QueryTaskDTO, userId: string): Promise<Task[]> {
        const where: Prisma.TaskWhereInput = {
            OR: [
                { createdById: userId },
                { assignedToId: userId },
            ],
        };

        if (query.status) {
            where.status = query.status;
        }

        if (query.priority) {
            where.priority = query.priority;
        }

        if (query.assignedToId) {
            where.assignedToId = query.assignedToId;
        }

        if (query.search) {
            where.OR = [
                { title: { contains: query.search } },
                { description: { contains: query.search } },
            ];
        }

        const orderBy: Prisma.TaskOrderByWithRelationInput = {
            [query.sortBy || 'createdAt']: query.sortOrder || 'desc',
        };

        return prisma.task.findMany({
            where,
            orderBy,
            include: {
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
                assignedTo: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }

    async updateTask(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
        return prisma.task.update({
            where: { id },
            data,
            include: {
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
                assignedTo: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
    }

    async deleteTask(id: string): Promise<Task> {
        return prisma.task.delete({
            where: { id },
        });
    }
}
