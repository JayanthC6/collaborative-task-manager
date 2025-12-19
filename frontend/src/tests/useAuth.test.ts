import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { authAPI } from '../services/api';

// Mock the API
vi.mock('../services/api', () => ({
    authAPI: {
        login: vi.fn(),
        register: vi.fn(),
    },
}));

// Mock socket service
vi.mock('../services/socket', () => ({
    socketService: {
        connect: vi.fn(),
        disconnect: vi.fn(),
    },
}));

describe('useAuth', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.clearAllMocks();
    });

    it('should initialize with no user', () => {
        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });

        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
    });

    it('should login successfully', async () => {
        const mockResponse = {
            user: { id: '1', email: 'test@example.com', name: 'Test User' },
            token: 'mock-token',
        };

        vi.mocked(authAPI.login).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });

        await act(async () => {
            await result.current.login('test@example.com', 'password123');
        });

        expect(result.current.user).toEqual(mockResponse.user);
        expect(result.current.token).toBe('mock-token');
        expect(localStorage.getItem('token')).toBe('mock-token');
    });

    it('should register successfully', async () => {
        const mockResponse = {
            user: { id: '1', email: 'new@example.com', name: 'New User' },
            token: 'new-token',
        };

        vi.mocked(authAPI.register).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });

        await act(async () => {
            await result.current.register('new@example.com', 'password123', 'New User');
        });

        expect(result.current.user).toEqual(mockResponse.user);
        expect(result.current.token).toBe('new-token');
    });

    it('should logout and clear storage', async () => {
        const mockResponse = {
            user: { id: '1', email: 'test@example.com', name: 'Test User' },
            token: 'mock-token',
        };

        vi.mocked(authAPI.login).mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });

        await act(async () => {
            await result.current.login('test@example.com', 'password123');
        });

        act(() => {
            result.current.logout();
        });

        expect(result.current.user).toBeNull();
        expect(result.current.token).toBeNull();
        expect(localStorage.getItem('token')).toBeNull();
    });

    it('should handle login error', async () => {
        vi.mocked(authAPI.login).mockRejectedValue({
            response: { data: { error: 'Invalid credentials' } },
        });

        const { result } = renderHook(() => useAuth(), {
            wrapper: AuthProvider,
        });

        await expect(
            act(async () => {
                await result.current.login('wrong@example.com', 'wrongpassword');
            })
        ).rejects.toThrow('Invalid credentials');
    });
});
