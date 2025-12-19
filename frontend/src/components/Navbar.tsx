import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="glass border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <h1 className="text-2xl font-bold text-gradient">TaskFlow</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="text-sm">
                            <p className="font-medium text-gray-900">{user?.name}</p>
                            <p className="text-gray-500">{user?.email}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="btn btn-secondary text-sm"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
