import { z } from 'zod';

export const TaskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'DONE']);
export const TaskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const CreateTaskDTOSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
    description: z.string().optional(),
    status: TaskStatusEnum.optional().default('TODO'),
    priority: TaskPriorityEnum.optional().default('MEDIUM'),
    assignedToId: z.string().uuid().optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
});

export const UpdateTaskDTOSchema = z.object({
    title: z.string().min(1).max(200).optional(),
    description: z.string().optional().nullable(),
    status: TaskStatusEnum.optional(),
    priority: TaskPriorityEnum.optional(),
    assignedToId: z.string().uuid().optional().nullable(),
    dueDate: z.string().datetime().optional().nullable(),
});

export const QueryTaskDTOSchema = z.object({
    status: TaskStatusEnum.optional(),
    priority: TaskPriorityEnum.optional(),
    assignedToId: z.string().uuid().optional(),
    createdById: z.string().uuid().optional(),
    sortBy: z.enum(['createdAt', 'dueDate', 'priority', 'status']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
    search: z.string().optional(),
});

export type CreateTaskDTO = z.infer<typeof CreateTaskDTOSchema>;
export type UpdateTaskDTO = z.infer<typeof UpdateTaskDTOSchema>;
export type QueryTaskDTO = z.infer<typeof QueryTaskDTOSchema>;
