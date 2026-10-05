import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-700 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold">ShelfLife</div>
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/dashboard" className="block py-2 px-4 rounded hover:bg-indigo-600">Dashboard</Link>
          <Link to="/books" className="block py-2 px-4 rounded hover:bg-indigo-600">Books</Link>
          <Link to="/members" className="block py-2 px-4 rounded hover:bg-indigo-600">Members</Link>
          <Link to="/issue" className="block py-2 px-4 rounded hover:bg-indigo-600">Issue Book</Link>
        </nav>
        <div className="p-4 border-t border-indigo-600">
          <div className="mb-2 text-sm">{user?.email}</div>
          <button onClick={handleLogout} className="w-full py-2 bg-indigo-800 rounded hover:bg-indigo-900">
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};
