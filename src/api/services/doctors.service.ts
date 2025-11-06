// src/api/services/doctors.service.ts
import axios from '../axios.config';

export interface Doctor {
  id: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    isActive: boolean;
  };
  specialty: {
    id: string;
    name: string;
    basePrice: number;
  };
  licenseNumber: string;
  yearsExperience?: number;
  education?: string;
  certifications?: string;
  consultationPrice?: number;
  biography?: string;
  profileImageUrl?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorQuery {
  search?: string;
  specialtyId?: string;
  isAvailable?: boolean;
  isActive?: boolean;
  minYearsExperience?: number;
  maxPrice?: number;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface DoctorStatistics {
  doctorId: string;
  name: string;
  specialty: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalPatients: number;
  averageRating: number;
  totalEarnings: number;
}

class DoctorsService {
  /**
   * Obtener todos los doctores con filtros
   */
  async getAll(query?: DoctorQuery) {
    const response = await axios.get('/doctors', { params: query });
    return response.data;
  }

  /**
   * Obtener doctor por ID
   */
  async getById(id: string): Promise<Doctor> {
    const response = await axios.get(`/doctors/${id}`);
    return response.data;
  }

  /**
   * Obtener doctor por ID de usuario
   */
  async getByUserId(userId: string): Promise<Doctor> {
    const response = await axios.get(`/doctors/user/${userId}`);
    return response.data;
  }

  /**
   * Obtener doctores disponibles
   */
  async getAvailable(): Promise<Doctor[]> {
    const response = await axios.get('/doctors/available/list');
    return response.data;
  }

  /**
   * Obtener doctores por especialidad
   */
  async getBySpecialty(specialtyId: string, onlyAvailable = true): Promise<Doctor[]> {
    const response = await axios.get(`/doctors/specialty/${specialtyId}`, {
      params: { onlyAvailable }
    });
    return response.data;
  }

  /**
   * Buscar doctores
   */
  async search(searchTerm: string): Promise<Doctor[]> {
    const response = await axios.get('/doctors/search/query', {
      params: { q: searchTerm }
    });
    return response.data;
  }

  /**
   * Obtener doctores más populares
   */
  async getMostPopular(limit = 10): Promise<Doctor[]> {
    const response = await axios.get('/doctors/popular/list', {
      params: { limit }
    });
    return response.data;
  }

  /**
   * Actualizar doctor
   */
  async update(id: string, data: Partial<Doctor>) {
    const response = await axios.patch(`/doctors/${id}`, data);
    return response.data;
  }

  /**
   * Actualizar disponibilidad
   */
  async updateAvailability(id: string, isAvailable: boolean) {
    const response = await axios.patch(`/doctors/${id}/availability`, { isAvailable });
    return response.data;
  }

  /**
   * Obtener estadísticas del doctor
   */
  async getStatistics(id: string): Promise<DoctorStatistics> {
    const response = await axios.get(`/doctors/${id}/statistics`);
    return response.data;
  }

  /**
   * Contar doctores
   */
  async count(onlyActive = false, onlyAvailable = false) {
    const response = await axios.get('/doctors/stats/count', {
      params: { onlyActive, onlyAvailable }
    });
    return response.data;
  }
}

export const doctorsService = new DoctorsService();