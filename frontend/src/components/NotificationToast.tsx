import { useState, useEffect } from 'react';
import { socketService } from '../services/socket';
import { Task } from '../types';

interface Notification {
    id: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
}

export const NotificationToast = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const handleTaskAssigned = (task: Task) => {
            addNotification({
                id: `assigned-${task.id}-${Date.now()}`,
                message: `You've been assigned to: ${task.title}`,
                type: 'info',
            });
        };

        socketService.on('task:assigned', handleTaskAssigned);

        return () => {
            socketService.off('task:assigned', handleTaskAssigned);
        };
    }, []);

    const addNotification = (notification: Notification) => {
        setNotifications((prev) => [...prev, notification]);

        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            removeNotification(notification.id);
        }, 5000);
    };

    const removeNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed top-20 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`
            animate-slide-down glass rounded-lg shadow-lg p-4 max-w-sm
            ${notification.type === 'success' ? 'border-l-4 border-success-500' : ''}
            ${notification.type === 'info' ? 'border-l-4 border-primary-500' : ''}
            ${notification.type === 'warning' ? 'border-l-4 border-warning-500' : ''}
            ${notification.type === 'error' ? 'border-l-4 border-danger-500' : ''}
          `}
                >
                    <div className="flex items-start justify-between">
                        <p className="text-sm font-medium text-gray-900">{notification.message}</p>
                        <button
                            onClick={() => removeNotification(notification.id)}
                            className="ml-4 text-gray-400 hover:text-gray-600"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};
