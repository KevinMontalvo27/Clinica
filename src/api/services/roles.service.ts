// src/api/services/roles.service.ts
import axios from '../axios.config';

export interface Role {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateRoleDto {
  name: string;
  description?: string;
}

class RolesService {
  async create(data: CreateRoleDto): Promise<Role> {
    const response = await axios.post('/roles', data);
    return response.data;
  }

  async getAll(): Promise<Role[]> {
    const response = await axios.get('/roles');
    return response.data;
  }

  async getById(id: string): Promise<Role> {
    const response = await axios.get(`/roles/${id}`);
    return response.data;
  }

  async getByName(name: string): Promise<Role> {
    const response = await axios.get(`/roles/name/${name}`);
    return response.data;
  }

  async update(id: string, data: Partial<CreateRoleDto>): Promise<Role> {
    const response = await axios.patch(`/roles/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`/roles/${id}`);
    return response.data;
  }

  async countUsers(id: string): Promise<{ roleId: string; roleName: string; usersCount: number }> {
    const response = await axios.get(`/roles/${id}/users/count`);
    return response.data;
  }

  async exists(name: string): Promise<{ name: string; exists: boolean }> {
    const response = await axios.get(`/roles/exists/${name}`);
    return response.data;
  }
}

export const rolesService = new RolesService();

