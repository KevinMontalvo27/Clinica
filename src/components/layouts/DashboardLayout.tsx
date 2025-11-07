import { useAuthStore } from '../../store/authStore';
import { LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userRole = typeof user?.role === 'string' 
    ? user.role 
    : user?.role?.name || '';

  return (
    <div className="min-h-screen bg-base-200">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl">
            Dashboard {userRole}
          </a>
        </div>
        <div className="flex-none gap-2">
          {/* User info */}
          <div className="flex items-center gap-2 px-4">
            <User className="w-5 h-5" />
            <div className="text-sm">
              <p className="font-medium">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs opacity-70">{user?.email}</p>
            </div>
          </div>

          {/* Logout button */}
          <button 
            onClick={handleLogout}
            className="btn btn-ghost btn-circle"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="container mx-auto p-8">
        {children}
      </main>
    </div>
  );
}