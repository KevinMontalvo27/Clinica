import axiosInstance from '../axios.config';
import { ENDPOINTS } from '../endpoints';
import type { LoginCredentials, AuthResponse, User } from '../../types/auth.types';

export const authService = {
    /**
     * Iniciar sesión
     */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await axiosInstance.post<AuthResponse>(
        ENDPOINTS.AUTH.LOGIN,
        credentials
        );
        return response.data;
    },

    /**
     * Registrar nuevo usuario (paciente)
     */
    async register(data: any): Promise<AuthResponse> {
        const response = await axiosInstance.post<AuthResponse>(
        ENDPOINTS.AUTH.REGISTER,
        data
        );
        return response.data;
    },

    /**
     * Obtener perfil del usuario autenticado
     */
    async getProfile(): Promise<User> {
        const response = await axiosInstance.get<User>(ENDPOINTS.AUTH.PROFILE);
        return response.data;
    },

    /**
     * Cerrar sesión
     */
    async logout(): Promise<void> {
        await axiosInstance.post(ENDPOINTS.AUTH.LOGOUT);
    },

    /**
     * Refrescar token
     */
    async refreshToken(): Promise<{ accessToken: string }> {
        const response = await axiosInstance.post<{ accessToken: string }>(
        ENDPOINTS.AUTH.REFRESH
        );
        return response.data;
    },

    /**
     * Cambiar contraseña
     */
    async changePassword(data: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{ message: string }> {
        const response = await axiosInstance.patch<{ message: string }>(
        ENDPOINTS.AUTH.CHANGE_PASSWORD,
        data
        );
        return response.data;
    },

    /**
     * Solicitar reseteo de contraseña
     */
    async forgotPassword(email: string): Promise<{ message: string }> {
        const response = await axiosInstance.post<{ message: string }>(
        ENDPOINTS.AUTH.FORGOT_PASSWORD,
        { email }
        );
        return response.data;
    },

    /**
     * Resetear contraseña
     */
    async resetPassword(data: {
        token: string;
        newPassword: string;
    }): Promise<{ message: string }> {
        const response = await axiosInstance.post<{ message: string }>(
        ENDPOINTS.AUTH.RESET_PASSWORD,
        data
        );
        return response.data;
    },
};