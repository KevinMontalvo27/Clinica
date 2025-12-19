import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Heart, 
  LogOut, 
  User, 
  Menu, 
  X,
  Calendar,
  Search,
  FileText,
  Home
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function PatientNavbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    {
      label: 'Inicio',
      path: '/patient/dashboard',
      icon: Home,
    },
    {
      label: 'Buscar Doctores',
      path: '/patient/search-doctors',
      icon: Search,
    },
    {
      label: 'Mis Citas',
      path: '/patient/appointments',
      icon: Calendar,
    },
    {
      label: 'Mi Historial',
      path: '/patient/medical-history',
      icon: FileText,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        {/* Mobile menu button */}
        <div className="flex-none lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="btn btn-ghost btn-circle"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Logo */}
        <div className="flex-none">
          <Link to="/patient/dashboard" className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-base-content">Clínica Médica</h1>
              <p className="text-xs text-base-content/60">Portal del Paciente</p>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-1 justify-center">
          <ul className="menu menu-horizontal px-1 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`gap-2 ${
                      isActive(item.path)
                        ? 'bg-primary text-primary-content'
                        : 'hover:bg-base-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        {/* User menu */}
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost gap-2">
              <div className="avatar placeholder">
                <div className="bg-gradient-to-br from-primary to-secondary rounded-full w-8 h-8 text-white">
                  <span className="text-xs font-bold">
                    {user?.firstName?.[0] || ''}{user?.lastName?.[0] || ''}
                  </span>
                </div>
              </div>
              <span className="hidden md:inline text-sm">
                {user?.firstName}
              </span>
            </label>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300"
            >
              <li className="menu-title px-4 py-2">
                <span className="text-xs">
                  {user?.email}
                </span>
              </li>
              <div className="divider my-1"></div>
              <li>
                <Link to="/patient/profile" className="gap-2">
                  <User className="w-4 h-4" />
                  Mi Perfil
                </Link>
              </li>
              <div className="divider my-1"></div>
              <li>
                <button onClick={handleLogout} className="gap-2 text-error">
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-base-100 border-b border-base-300 shadow-lg">
          <ul className="menu p-4 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`gap-3 ${
                      isActive(item.path)
                        ? 'bg-primary text-primary-content'
                        : 'hover:bg-base-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <div className="divider my-2"></div>
            <li>
              <Link
                to="/patient/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="gap-3"
              >
                <User className="w-5 h-5" />
                Mi Perfil
              </Link>
            </li>
            <li>
              <button onClick={handleLogout} className="gap-3 text-error">
                <LogOut className="w-5 h-5" />
                Cerrar Sesión
              </button>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}