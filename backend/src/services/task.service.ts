import { TaskRepository } from '../repositories/task.repository';
import { CreateTaskDTO, UpdateTaskDTO, QueryTaskDTO } from '../dtos/task.dto';
import { Server as SocketServer } from 'socket.io';

export class TaskService {
    private taskRepository: TaskRepository;
    private io: SocketServer | null = null;

    constructor() {
        this.taskRepository = new TaskRepository();
    }

    setSocketServer(io: SocketServer) {
        this.io = io;
    }

    async createTask(data: CreateTaskDTO, userId: string) {
        const task = await this.taskRepository.createTask({
            title: data.title,
            description: data.description,
            status: data.status || 'TODO',
            priority: data.priority || 'MEDIUM',
            dueDate: data.dueDate ? new Date(data.dueDate) : null,
            createdBy: {
                connect: { id: userId },
            },
            assignedTo: data.assignedToId
                ? { connect: { id: data.assignedToId } }
                : undefined,
        });

        // Emit real-time event
        if (this.io) {
            this.io.emit('task:created', task);

            // Notify assigned user
            if (data.assignedToId) {
                this.io.to(data.assignedToId).emit('task:assigned', task);
            }
        }

        return task;
    }

    async getTasks(query: QueryTaskDTO, userId: string) {
        return this.taskRepository.findTasks(query, userId);
    }

    async getTaskById(id: string, userId: string) {
        const task = await this.taskRepository.findTaskById(id);

        if (!task) {
            throw new Error('Task not found');
        }

        // Check authorization
        if (task.createdById !== userId && task.assignedToId !== userId) {
            throw new Error('Unauthorized to view this task');
        }

        return task;
    }

    async updateTask(id: string, data: UpdateTaskDTO, userId: string) {
        const task = await this.taskRepository.findTaskById(id);

        if (!task) {
            throw new Error('Task not found');
        }

        // Check authorization
        if (task.createdById !== userId && task.assignedToId !== userId) {
            throw new Error('Unauthorized to update this task');
        }

        const updatedTask = await this.taskRepository.updateTask(id, {
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
            assignedTo: data.assignedToId !== undefined
                ? data.assignedToId
                    ? { connect: { id: data.assignedToId } }
                    : { disconnect: true }
                : undefined,
        });

        // Emit real-time event
        if (this.io) {
            this.io.emit('task:updated', updatedTask);

            // Notify newly assigned user
            if (data.assignedToId && data.assignedToId !== task.assignedToId) {
                this.io.to(data.assignedToId).emit('task:assigned', updatedTask);
            }
        }

        return updatedTask;
    }

    async deleteTask(id: string, userId: string) {
        const task = await this.taskRepository.findTaskById(id);

        if (!task) {
            throw new Error('Task not found');
        }

        // Only creator can delete
        if (task.createdById !== userId) {
            throw new Error('Unauthorized to delete this task');
        }

        await this.taskRepository.deleteTask(id);

        // Emit real-time event
        if (this.io) {
            this.io.emit('task:deleted', { id });
        }

        return { message: 'Task deleted successfully' };
    }
}
