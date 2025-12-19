import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { TaskCard } from '../components/TaskCard';
import { TaskForm } from '../components/TaskForm';
import { TaskFiltersComponent } from '../components/TaskFilters';
import { NotificationToast } from '../components/NotificationToast';
import { useTasks } from '../hooks/useTasks';
import { Task } from '../types';

export const DashboardPage = () => {
    const { tasks, loading, filters, setFilters, createTask, updateTask, deleteTask } = useTasks();
    const [showForm, setShowForm] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleCreateTask = () => {
        setEditingTask(null);
        setShowForm(true);
    };

    const handleEditTask = (task: Task) => {
        setEditingTask(task);
        setShowForm(true);
    };

    const handleDeleteTask = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await deleteTask(id);
            } catch (error: any) {
                alert(error.message);
            }
        }
    };

    const handleSubmitTask = async (data: Partial<Task>) => {
        if (editingTask) {
            await updateTask(editingTask.id, data);
        } else {
            await createTask(data);
        }
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingTask(null);
    };

    const stats = {
        total: tasks.length,
        todo: tasks.filter((t) => t.status === 'TODO').length,
        inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
        done: tasks.filter((t) => t.status === 'DONE').length,
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <Navbar />
            <NotificationToast />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Task Dashboard</h1>
                    <p className="text-gray-600">Manage and collaborate on tasks in real-time</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="card bg-gradient-to-br from-primary-500 to-primary-600 text-white">
                        <h3 className="text-sm font-medium opacity-90">Total Tasks</h3>
                        <p className="text-3xl font-bold mt-2">{stats.total}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-gray-500 to-gray-600 text-white">
                        <h3 className="text-sm font-medium opacity-90">To Do</h3>
                        <p className="text-3xl font-bold mt-2">{stats.todo}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        <h3 className="text-sm font-medium opacity-90">In Progress</h3>
                        <p className="text-3xl font-bold mt-2">{stats.inProgress}</p>
                    </div>
                    <div className="card bg-gradient-to-br from-green-500 to-green-600 text-white">
                        <h3 className="text-sm font-medium opacity-90">Done</h3>
                        <p className="text-3xl font-bold mt-2">{stats.done}</p>
                    </div>
                </div>

                {/* Filters */}
                <TaskFiltersComponent filters={filters} onFilterChange={setFilters} />

                {/* Create Button */}
                <div className="mb-6">
                    <button onClick={handleCreateTask} className="btn btn-primary">
                        + Create New Task
                    </button>
                </div>

                {/* Tasks Grid */}
                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        <p className="mt-4 text-gray-600">Loading tasks...</p>
                    </div>
                ) : tasks.length === 0 ? (
                    <div className="card text-center py-12">
                        <p className="text-gray-600 text-lg">No tasks found</p>
                        <p className="text-gray-500 text-sm mt-2">Create your first task to get started!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onEdit={handleEditTask}
                                onDelete={handleDeleteTask}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Task Form Modal */}
            {showForm && (
                <TaskForm
                    task={editingTask}
                    onSubmit={handleSubmitTask}
                    onCancel={handleCloseForm}
                />
            )}
        </div>
    );
};
