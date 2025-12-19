import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskCard } from '../components/TaskCard';
import { Task } from '../types';

describe('TaskCard', () => {
    const mockTask: Task = {
        id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'TODO',
        priority: 'HIGH',
        createdById: 'user-1',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z',
    };

    const mockOnEdit = vi.fn();
    const mockOnDelete = vi.fn();

    it('should render task title and description', () => {
        render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
    });

    it('should display correct status and priority badges', () => {
        render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

        expect(screen.getByText('TODO')).toBeInTheDocument();
        expect(screen.getByText('HIGH')).toBeInTheDocument();
    });

    it('should call onEdit when edit button is clicked', () => {
        render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

        const editButton = screen.getByText('Edit');
        fireEvent.click(editButton);

        expect(mockOnEdit).toHaveBeenCalledWith(mockTask);
    });

    it('should call onDelete when delete button is clicked', () => {
        render(<TaskCard task={mockTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);

        expect(mockOnDelete).toHaveBeenCalledWith('1');
    });

    it('should display assigned user when task is assigned', () => {
        const assignedTask = {
            ...mockTask,
            assignedTo: {
                id: 'user-2',
                name: 'John Doe',
                email: 'john@example.com',
            },
        };

        render(<TaskCard task={assignedTask} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

        expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    });

    it('should display due date when present', () => {
        const taskWithDueDate = {
            ...mockTask,
            dueDate: '2024-12-31T00:00:00.000Z',
        };

        render(<TaskCard task={taskWithDueDate} onEdit={mockOnEdit} onDelete={mockOnDelete} />);

        expect(screen.getByText(/Dec 31, 2024/)).toBeInTheDocument();
    });
});
