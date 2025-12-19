import { Task } from '../types';
import { format } from 'date-fns';

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

export const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
    const getStatusBadgeClass = (status: string) => {
        switch (status) {
            case 'TODO':
                return 'badge-todo';
            case 'IN_PROGRESS':
                return 'badge-in-progress';
            case 'DONE':
                return 'badge-done';
            default:
                return 'badge-todo';
        }
    };

    const getPriorityBadgeClass = (priority: string) => {
        switch (priority) {
            case 'LOW':
                return 'badge-low';
            case 'MEDIUM':
                return 'badge-medium';
            case 'HIGH':
                return 'badge-high';
            default:
                return 'badge-medium';
        }
    };

    const formatStatus = (status: string) => {
        return status.replace('_', ' ');
    };

    return (
        <div className="card hover:scale-[1.02] transition-transform duration-200">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-900 flex-1">{task.title}</h3>
                <div className="flex gap-2 ml-2">
                    <button
                        onClick={() => onEdit(task)}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(task.id)}
                        className="text-danger-600 hover:text-danger-700 text-sm font-medium"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {task.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{task.description}</p>
            )}

            <div className="flex flex-wrap gap-2 mb-3">
                <span className={`badge ${getStatusBadgeClass(task.status)}`}>
                    {formatStatus(task.status)}
                </span>
                <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                    {task.priority}
                </span>
            </div>

            <div className="text-xs text-gray-500 space-y-1">
                {task.assignedTo && (
                    <p>
                        <span className="font-medium">Assigned to:</span> {task.assignedTo.name}
                    </p>
                )}
                {task.dueDate && (
                    <p>
                        <span className="font-medium">Due:</span>{' '}
                        {format(new Date(task.dueDate), 'MMM dd, yyyy')}
                    </p>
                )}
                <p>
                    <span className="font-medium">Created:</span>{' '}
                    {format(new Date(task.createdAt), 'MMM dd, yyyy')}
                </p>
            </div>
        </div>
    );
};
