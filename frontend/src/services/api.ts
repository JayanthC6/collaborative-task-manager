import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: async (data: { email: string; password: string; name: string }) => {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    login: async (data: { email: string; password: string }) => {
        const response = await api.post('/auth/login', data);
        return response.data;
    },

    getMe: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    getAllUsers: async () => {
        const response = await api.get('/auth/users');
        return response.data;
    },
};

// Task API
export const taskAPI = {
    getTasks: async (params?: any) => {
        const response = await api.get('/tasks', { params });
        return response.data;
    },

    getTaskById: async (id: string) => {
        const response = await api.get(`/tasks/${id}`);
        return response.data;
    },

    createTask: async (data: any) => {
        const response = await api.post('/tasks', data);
        return response.data;
    },

    updateTask: async (id: string, data: any) => {
        const response = await api.put(`/tasks/${id}`, data);
        return response.data;
    },

    deleteTask: async (id: string) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    },
};

export default api;
