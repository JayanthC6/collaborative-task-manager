export interface User {
    id: string;
    email: string;
    name: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate?: string;
    createdById: string;
    assignedToId?: string;
    createdAt: string;
    updatedAt: string;
    createdBy?: {
        id: string;
        name: string;
        email: string;
    };
    assignedTo?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface AuthResponse {
    user: User;
    token: string;
}

export interface TaskFilters {
    status?: 'TODO' | 'IN_PROGRESS' | 'DONE';
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
    assignedToId?: string;
    sortBy?: 'createdAt' | 'dueDate' | 'priority' | 'status';
    sortOrder?: 'asc' | 'desc';
    search?: string;
}
