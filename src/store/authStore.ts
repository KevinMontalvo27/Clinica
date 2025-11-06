import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, LoginCredentials, AuthResponse } from '../types/auth.types';
import { authService } from '../api/services/auth.service';
import type { UserDetails } from '../types/user.types';

interface AuthState {
    user: (User | UserDetails) | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (credentials: LoginCredentials) => Promise<void>;
    logout: () => Promise<void>;
    setUser: (user: User) => void;
    setToken: (token: string) => void;
    clearError: () => void;
    checkAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
        // Estado inicial
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,

        // Login
        login: async (credentials: LoginCredentials) => {
            set({ isLoading: true, error: null });
            try {
                const response: AuthResponse = await authService.login(credentials);
                
                const normalizedUser = {
                    ...response.user,
                    role: typeof response.user.role === 'string'
                    ? response.user.role
                    : response.user.role.name, // 🔥 convierte RoleInfo a string
                };
                // Guardar en localStorage
                localStorage.setItem('accessToken', response.accessToken);
                localStorage.setItem('user', JSON.stringify(response.user));

                set({
                    user: normalizedUser,
                    accessToken: response.accessToken,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
            });
            } catch (error: any) {
                const errorMessage = error.response?.data?.message || 'Error al iniciar sesión';
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: errorMessage,
                });
                throw error;
            }
        },

        // Logout
        logout: async () => {
            try {
                await authService.logout();
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
            } finally {
                // Limpiar todo
                localStorage.removeItem('accessToken');
                localStorage.removeItem('user');
            
                set({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                    isLoading: false,
                    error: null,
                });
            }
        },

        // Setters
        setUser: (user: User) => set({ user, isAuthenticated: true }),
        
        setToken: (token: string) => {
            localStorage.setItem('accessToken', token);
            set({ accessToken: token });
        },

        clearError: () => set({ error: null }),

        // Verificar autenticación al cargar la app
        checkAuth: () => {
            set({ isLoading: true });
            
            const token = localStorage.getItem('accessToken');
            const userStr = localStorage.getItem('user');

            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr);
                    set({
                    user,
                    accessToken: token,
                    isAuthenticated: true,
                    isLoading: false,
                    });
                } catch (error) {
                    console.error('Error parseando usuario:', error);
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('user');
                    set({
                        user: null,
                        accessToken: null,
                        isAuthenticated: false,
                        isLoading: false, // 👈 AGREGADO
                    });
                }
            }
        },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);