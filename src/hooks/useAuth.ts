import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import type { LoginCredentials } from '../types/auth.types';
import type { UserRole } from '../types/user.types';

export const useAuth = () => {
    const navigate = useNavigate();
    const {
        user,
        accessToken,
        isAuthenticated,
        isLoading,
        error,
        login: loginAction,
        logout: logoutAction,
        clearError,
    } = useAuthStore();

    /**
     * Iniciar sesión y redirigir según el rol
     */
    const login = async (credentials: LoginCredentials) => {
        try {
            await loginAction(credentials);
            
            // Obtener el usuario actualizado
            const currentUser = useAuthStore.getState().user;
            
            if (currentUser) {
                // Redirigir según el rol
                const redirectPath = getRoleBasedPath(currentUser.role as UserRole);
                navigate(redirectPath, { replace: true });
            }
        } catch (error) {
            console.error('Error en login:', error);
            throw error;
        }
    };

    /**
     * Cerrar sesión y redirigir al login
     */
    const logout = async () => {
        await logoutAction();
        navigate('/login', { replace: true });
    };

    /**
     * Verificar si el usuario tiene un rol específico
     */
    const hasRole = (role: UserRole): boolean => {
        return user?.role === role;
    };

    /**
     * Verificar si el usuario tiene alguno de los roles especificados
     */
    const hasAnyRole = (roles: UserRole[]): boolean => {
        return user ? roles.includes(user.role as UserRole) : false;
    };

    return {
        // Estado
        user,
        accessToken,
        isAuthenticated,
        isLoading,
        error,

        // Acciones
        login,
        logout,
        clearError,

        // Helpers
        hasRole,
        hasAnyRole,
    };
    };

    /**
     * Obtener la ruta según el rol del usuario
     */
    function getRoleBasedPath(role: UserRole): string {
    const routes: Record<UserRole, string> = {
        ADMIN: '/admin/dashboard',
        DOCTOR: '/doctor/dashboard',
        PATIENT: '/patient/dashboard',
    };

    return routes[role] || '/';
}