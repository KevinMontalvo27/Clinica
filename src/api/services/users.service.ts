// src/api/services/users.service.ts
import axios from '../axios.config';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  isActive: boolean;
  emailVerified: boolean;
  role: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  roleId: string;
}

export interface UpdateUserDto {
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

class UsersService {
  /**
   * Crear nuevo usuario
   */
  async create(data: CreateUserDto): Promise<User> {
    const response = await axios.post('/users', data);
    return response.data;
  }

  /**
   * Obtener todos los usuarios
   */
  async getAll(includeInactive: boolean = false): Promise<User[]> {
    const response = await axios.get('/users', {
      params: { includeInactive }
    });
    return response.data;
  }

  /**
   * Obtener usuario por ID
   */
  async getById(id: string): Promise<User> {
    const response = await axios.get(`/users/${id}`);
    return response.data;
  }

  /**
   * Obtener usuario por email
   */
  async getByEmail(email: string): Promise<User> {
    const response = await axios.get(`/users/email/${email}`);
    return response.data;
  }

  /**
   * Buscar usuarios
   */
  async search(searchTerm: string): Promise<User[]> {
    const response = await axios.get('/users/search/query', {
      params: { q: searchTerm }
    });
    return response.data;
  }

  /**
   * Obtener usuarios por rol
   */
  async getByRole(roleId: string): Promise<User[]> {
    const response = await axios.get(`/users/role/${roleId}`);
    return response.data;
  }

  /**
   * Actualizar usuario
   */
  async update(id: string, data: UpdateUserDto): Promise<User> {
    const response = await axios.patch(`/users/${id}`, data);
    return response.data;
  }

  /**
   * Cambiar contraseña
   */
  async changePassword(
    id: string,
    data: ChangePasswordDto
  ): Promise<{ message: string }> {
    const response = await axios.patch(`/users/${id}/change-password`, data);
    return response.data;
  }

  /**
   * Desactivar usuario
   */
  async deactivate(id: string): Promise<User> {
    const response = await axios.patch(`/users/${id}/deactivate`);
    return response.data;
  }

  /**
   * Activar usuario
   */
  async activate(id: string): Promise<User> {
    const response = await axios.patch(`/users/${id}/activate`);
    return response.data;
  }

  /**
   * Verificar email
   */
  async verifyEmail(id: string): Promise<User> {
    const response = await axios.patch(`/users/${id}/verify-email`);
    return response.data;
  }

  /**
   * Eliminar usuario
   */
  async delete(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`/users/${id}`);
    return response.data;
  }

  /**
   * Verificar si email existe
   */
  async checkEmail(email: string): Promise<{ email: string; exists: boolean }> {
    const response = await axios.get(`/users/check-email/${email}`);
    return response.data;
  }

  /**
   * Contar usuarios
   */
  async count(onlyActive: boolean = false): Promise<{ total: number; onlyActive: boolean }> {
    const response = await axios.get('/users/stats/count', {
      params: { onlyActive }
    });
    return response.data;
  }

  /**
   * Contar por rol
   */
  async countByRole(roleId: string): Promise<{ roleId: string; count: number }> {
    const response = await axios.get(`/users/stats/count-by-role/${roleId}`);
    return response.data;
  }
}

export const usersService = new UsersService();