// src/routes/AppRoutes.tsx
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import PrivateRoute from './PrivateRoute';
import { RoleBasedRoute } from './RoleBasedRoute';

// Pages
import LoginPage from '../features/auth/pages/LoginPage';

// Dashboards
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import DoctorDashboard from '../features/doctor/pages/DoctorDashboard';
import PatientDashboard from '../features/patient/pages/PatientDashboard';

export default function AppRoutes() {
  const { isAuthenticated, user } = useAuthStore();

  // Normalizar el rol
  const userRole: string = typeof user?.role === 'string'
    ? user.role
    : user?.role?.name || '';

  return (
      <Routes>
        {/* Ruta pública - Login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Redirect de raíz según autenticación */}
        <Route
          path="/"
          element={
            isAuthenticated && userRole ? (
              <Navigate to={getRoleBasedPath(userRole)} replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        {/* Rutas protegidas - ADMIN */}
        <Route
          path="/admin/*"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['ADMIN']}>
                <Routes>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  {/* Agregar más rutas de admin aquí */}
                </Routes>
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        {/* Rutas protegidas - DOCTOR */}
        <Route
          path="/doctor/*"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['DOCTOR']}>
                <Routes>
                  <Route path="dashboard" element={<DoctorDashboard />} />
                  {/* Agregar más rutas de doctor aquí */}
                </Routes>
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        {/* Rutas protegidas - PATIENT */}
        <Route
          path="/patient/*"
          element={
            <PrivateRoute>
              <RoleBasedRoute allowedRoles={['PATIENT']}>
                <Routes>
                  <Route path="dashboard" element={<PatientDashboard />} />
                  {/* Agregar más rutas de paciente aquí */}
                </Routes>
              </RoleBasedRoute>
            </PrivateRoute>
          }
        />

        {/* 404 - Página no encontrada */}
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

// Helper para obtener ruta según rol
function getRoleBasedPath(role: string): string {
  const routes: Record<string, string> = {
    ADMIN: '/admin/dashboard',
    DOCTOR: '/doctor/dashboard',
    PATIENT: '/patient/dashboard',
  };
  return routes[role] || '/login';
}

// Componente 404
function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="text-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-6">Página no encontrada</p>
        <a href="/" className="btn btn-primary">Ir al inicio</a>
      </div>
    </div>
  );
}