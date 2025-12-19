import { TaskFilters } from '../types';

interface TaskFiltersProps {
    filters: TaskFilters;
    onFilterChange: (filters: TaskFilters) => void;
}

export const TaskFiltersComponent = ({ filters, onFilterChange }: TaskFiltersProps) => {
    const handleChange = (key: keyof TaskFilters, value: any) => {
        onFilterChange({ ...filters, [key]: value || undefined });
    };

    const clearFilters = () => {
        onFilterChange({
            sortBy: 'createdAt',
            sortOrder: 'desc',
        });
    };

    return (
        <div className="card mb-6">
            <div className="flex flex-wrap gap-4 items-end">
                <div className="flex-1 min-w-[200px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Search
                    </label>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={filters.search || ''}
                        onChange={(e) => handleChange('search', e.target.value)}
                        className="input"
                    />
                </div>

                <div className="min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        value={filters.status || ''}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="input"
                    >
                        <option value="">All Statuses</option>
                        <option value="TODO">To Do</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="DONE">Done</option>
                    </select>
                </div>

                <div className="min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Priority
                    </label>
                    <select
                        value={filters.priority || ''}
                        onChange={(e) => handleChange('priority', e.target.value)}
                        className="input"
                    >
                        <option value="">All Priorities</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                </div>

                <div className="min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sort By
                    </label>
                    <select
                        value={filters.sortBy || 'createdAt'}
                        onChange={(e) => handleChange('sortBy', e.target.value)}
                        className="input"
                    >
                        <option value="createdAt">Created Date</option>
                        <option value="dueDate">Due Date</option>
                        <option value="priority">Priority</option>
                        <option value="status">Status</option>
                    </select>
                </div>

                <div className="min-w-[120px]">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order
                    </label>
                    <select
                        value={filters.sortOrder || 'desc'}
                        onChange={(e) => handleChange('sortOrder', e.target.value)}
                        className="input"
                    >
                        <option value="desc">Descending</option>
                        <option value="asc">Ascending</option>
                    </select>
                </div>

                <button
                    onClick={clearFilters}
                    className="btn btn-secondary whitespace-nowrap"
                >
                    Clear Filters
                </button>
            </div>
        </div>
    );
};
