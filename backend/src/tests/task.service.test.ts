import { TaskService } from '../services/task.service';
import { TaskRepository } from '../repositories/task.repository';
import { Server as SocketServer } from 'socket.io';

// Mock dependencies
jest.mock('../repositories/task.repository');

describe('TaskService', () => {
    let taskService: TaskService;
    let mockTaskRepository: jest.Mocked<TaskRepository>;
    let mockIo: jest.Mocked<SocketServer>;

    beforeEach(() => {
        jest.clearAllMocks();

        taskService = new TaskService();
        mockTaskRepository = new TaskRepository() as jest.Mocked<TaskRepository>;
        (taskService as any).taskRepository = mockTaskRepository;

        // Mock Socket.io
        mockIo = {
            emit: jest.fn(),
            to: jest.fn().mockReturnThis(),
        } as any;
        taskService.setSocketServer(mockIo);
    });

    describe('createTask', () => {
        it('should successfully create a task', async () => {
            // Arrange
            const taskData = {
                title: 'Test Task',
                description: 'Test Description',
                status: 'TODO' as const,
                priority: 'HIGH' as const,
                assignedToId: 'user-456',
                dueDate: '2024-12-31T00:00:00.000Z',
            };
            const userId = 'user-123';

            const mockTask = {
                id: 'task-123',
                title: taskData.title,
                description: taskData.description,
                status: taskData.status,
                priority: taskData.priority,
                dueDate: new Date(taskData.dueDate),
                createdById: userId,
                assignedToId: taskData.assignedToId,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: { id: userId, name: 'Creator', email: 'creator@test.com' },
                assignedTo: { id: 'user-456', name: 'Assignee', email: 'assignee@test.com' },
            };

            mockTaskRepository.createTask.mockResolvedValue(mockTask as any);

            // Act
            const result = await taskService.createTask(taskData, userId);

            // Assert
            expect(mockTaskRepository.createTask).toHaveBeenCalled();
            expect(result).toEqual(mockTask);
            expect(mockIo.emit).toHaveBeenCalledWith('task:created', mockTask);
            expect(mockIo.to).toHaveBeenCalledWith(taskData.assignedToId);
        });

        it('should create task without assignment', async () => {
            // Arrange
            const taskData = {
                title: 'Unassigned Task',
                description: 'No assignee',
                status: 'TODO' as const,
                priority: 'MEDIUM' as const,
            };
            const userId = 'user-123';

            const mockTask = {
                id: 'task-123',
                title: taskData.title,
                description: taskData.description,
                status: 'TODO',
                priority: 'MEDIUM',
                dueDate: null,
                createdById: userId,
                assignedToId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
                createdBy: { id: userId, name: 'Creator', email: 'creator@test.com' },
                assignedTo: null,
            };

            mockTaskRepository.createTask.mockResolvedValue(mockTask as any);

            // Act
            const result = await taskService.createTask(taskData, userId);

            // Assert
            expect(result.assignedToId).toBeNull();
            expect(mockIo.emit).toHaveBeenCalledWith('task:created', mockTask);
            expect(mockIo.to).not.toHaveBeenCalled();
        });

        it('should emit real-time events when task is created', async () => {
            // Arrange
            const taskData = {
                title: 'Real-time Task',
                assignedToId: 'user-456',
                status: 'TODO' as const,
                priority: 'MEDIUM' as const,
            };
            const userId = 'user-123';

            const mockTask = {
                id: 'task-123',
                title: taskData.title,
                status: 'TODO',
                priority: 'MEDIUM',
                createdById: userId,
                assignedToId: taskData.assignedToId,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockTaskRepository.createTask.mockResolvedValue(mockTask as any);

            // Act
            await taskService.createTask(taskData, userId);

            // Assert
            expect(mockIo.emit).toHaveBeenCalledWith('task:created', mockTask);
            expect(mockIo.to).toHaveBeenCalledWith('user-456');
        });
    });

    describe('updateTask', () => {
        it('should successfully update a task', async () => {
            // Arrange
            const taskId = 'task-123';
            const userId = 'user-123';
            const updateData = {
                title: 'Updated Title',
                status: 'IN_PROGRESS' as const,
            };

            const existingTask = {
                id: taskId,
                title: 'Original Title',
                status: 'TODO',
                priority: 'MEDIUM',
                createdById: userId,
                assignedToId: null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const updatedTask = {
                ...existingTask,
                ...updateData,
            };

            mockTaskRepository.findTaskById.mockResolvedValue(existingTask as any);
            mockTaskRepository.updateTask.mockResolvedValue(updatedTask as any);

            // Act
            const result = await taskService.updateTask(taskId, updateData, userId);

            // Assert
            expect(mockTaskRepository.findTaskById).toHaveBeenCalledWith(taskId);
            expect(mockTaskRepository.updateTask).toHaveBeenCalled();
            expect(result.title).toBe('Updated Title');
            expect(mockIo.emit).toHaveBeenCalledWith('task:updated', updatedTask);
        });

        it('should throw error if task not found', async () => {
            // Arrange
            const taskId = 'nonexistent-task';
            const userId = 'user-123';
            const updateData = { title: 'Updated' };

            mockTaskRepository.findTaskById.mockResolvedValue(null);

            // Act & Assert
            await expect(taskService.updateTask(taskId, updateData, userId)).rejects.toThrow(
                'Task not found'
            );
            expect(mockTaskRepository.updateTask).not.toHaveBeenCalled();
        });

        it('should throw error if user is not authorized', async () => {
            // Arrange
            const taskId = 'task-123';
            const userId = 'unauthorized-user';
            const updateData = { title: 'Updated' };

            const existingTask = {
                id: taskId,
                title: 'Original',
                createdById: 'other-user',
                assignedToId: 'another-user',
                status: 'TODO',
                priority: 'MEDIUM',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockTaskRepository.findTaskById.mockResolvedValue(existingTask as any);

            // Act & Assert
            await expect(taskService.updateTask(taskId, updateData, userId)).rejects.toThrow(
                'Unauthorized to update this task'
            );
            expect(mockTaskRepository.updateTask).not.toHaveBeenCalled();
        });
    });

    describe('deleteTask', () => {
        it('should successfully delete a task', async () => {
            // Arrange
            const taskId = 'task-123';
            const userId = 'user-123';

            const existingTask = {
                id: taskId,
                title: 'Task to Delete',
                createdById: userId,
                assignedToId: null,
                status: 'TODO',
                priority: 'MEDIUM',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockTaskRepository.findTaskById.mockResolvedValue(existingTask as any);
            mockTaskRepository.deleteTask.mockResolvedValue(existingTask as any);

            // Act
            const result = await taskService.deleteTask(taskId, userId);

            // Assert
            expect(mockTaskRepository.findTaskById).toHaveBeenCalledWith(taskId);
            expect(mockTaskRepository.deleteTask).toHaveBeenCalledWith(taskId);
            expect(result).toEqual({ message: 'Task deleted successfully' });
            expect(mockIo.emit).toHaveBeenCalledWith('task:deleted', { id: taskId });
        });

        it('should throw error if non-creator tries to delete', async () => {
            // Arrange
            const taskId = 'task-123';
            const userId = 'not-creator';

            const existingTask = {
                id: taskId,
                title: 'Task',
                createdById: 'creator-user',
                assignedToId: userId,
                status: 'TODO',
                priority: 'MEDIUM',
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            mockTaskRepository.findTaskById.mockResolvedValue(existingTask as any);

            // Act & Assert
            await expect(taskService.deleteTask(taskId, userId)).rejects.toThrow(
                'Unauthorized to delete this task'
            );
            expect(mockTaskRepository.deleteTask).not.toHaveBeenCalled();
        });

        it('should throw error if task not found', async () => {
            // Arrange
            const taskId = 'nonexistent-task';
            const userId = 'user-123';

            mockTaskRepository.findTaskById.mockResolvedValue(null);

            // Act & Assert
            await expect(taskService.deleteTask(taskId, userId)).rejects.toThrow('Task not found');
            expect(mockTaskRepository.deleteTask).not.toHaveBeenCalled();
        });
    });
});
