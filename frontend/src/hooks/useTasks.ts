import { useState, useEffect, useCallback } from 'react';
import { taskAPI } from '../services/api';
import { socketService } from '../services/socket';
import { Task, TaskFilters } from '../types';

export const useTasks = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<TaskFilters>({
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await taskAPI.getTasks(filters);
            setTasks(data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    // Real-time updates
    useEffect(() => {
        const handleTaskCreated = (task: Task) => {
            setTasks((prev) => [task, ...prev]);
        };

        const handleTaskUpdated = (updatedTask: Task) => {
            setTasks((prev) =>
                prev.map((task) => (task.id === updatedTask.id ? updatedTask : task))
            );
        };

        const handleTaskDeleted = ({ id }: { id: string }) => {
            setTasks((prev) => prev.filter((task) => task.id !== id));
        };

        socketService.on('task:created', handleTaskCreated);
        socketService.on('task:updated', handleTaskUpdated);
        socketService.on('task:deleted', handleTaskDeleted);

        return () => {
            socketService.off('task:created', handleTaskCreated);
            socketService.off('task:updated', handleTaskUpdated);
            socketService.off('task:deleted', handleTaskDeleted);
        };
    }, []);

    const createTask = async (taskData: Partial<Task>) => {
        try {
            const newTask = await taskAPI.createTask(taskData);
            // Task will be added via socket event
            return newTask;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Failed to create task');
        }
    };

    const updateTask = async (id: string, taskData: Partial<Task>) => {
        try {
            const updatedTask = await taskAPI.updateTask(id, taskData);
            // Task will be updated via socket event
            return updatedTask;
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Failed to update task');
        }
    };

    const deleteTask = async (id: string) => {
        try {
            await taskAPI.deleteTask(id);
            // Task will be removed via socket event
        } catch (err: any) {
            throw new Error(err.response?.data?.error || 'Failed to delete task');
        }
    };

    return {
        tasks,
        loading,
        error,
        filters,
        setFilters,
        createTask,
        updateTask,
        deleteTask,
        refetch: fetchTasks,
    };
};
