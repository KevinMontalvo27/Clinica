import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Shield } from 'lucide-react';
import type { UserRole } from '../types/user.types';

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}

export function RoleBasedRoute({ allowedRoles, children }: RoleBasedRouteProps) {
  const { user, isAuthenticated } = useAuthStore();

  // Si no está autenticado
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Normalizar el rol a string de forma segura
  const userRole: string | undefined = typeof user.role === 'string' 
    ? user.role 
    : user.role?.name;

  // Verificar permisos
  if (!userRole || !allowedRoles.includes(userRole as UserRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error/10 mb-4">
            <Shield className="w-8 h-8 text-error" />
          </div>
          
          <h1 className="text-2xl font-bold mb-2">
            Acceso Denegado
          </h1>
          
          <p className="text-base-content/70 mb-6">
            No tienes permisos para acceder a esta página.
          </p>

          <button
            onClick={() => window.history.back()}
            className="btn btn-primary"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}