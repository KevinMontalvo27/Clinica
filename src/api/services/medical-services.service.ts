// src/api/services/medical-services.service.ts
import axios from '../axios.config';

export interface MedicalService {
  id: string;
  doctorId: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // minutos
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateServiceDto {
  doctorId: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  isActive?: boolean;
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  isActive?: boolean;
}

export interface ServiceStats {
  doctorId: string;
  total: number;
  active: number;
  inactive: number;
  averagePrice: string;
  averageDuration: number;
  priceRange: {
    min: number;
    max: number;
  };
  durationRange: {
    min: number;
    max: number;
  };
}

class MedicalServicesService {
  /**
   * Crear servicio médico
   */
  async create(data: CreateServiceDto): Promise<MedicalService> {
    const response = await axios.post('/services', data);
    return response.data;
  }

  /**
   * Crear servicios por defecto para un doctor
   */
  async createDefaultServices(
    doctorId: string, 
    specialtyName: string
  ): Promise<MedicalService[]> {
    const response = await axios.post(`/services/doctor/${doctorId}/defaults`, {
      specialtyName
    });
    return response.data;
  }

  /**
   * Duplicar servicios de un doctor a otro
   */
  async duplicateServices(
    sourceDoctorId: string, 
    targetDoctorId: string
  ): Promise<MedicalService[]> {
    const response = await axios.post('/services/duplicate', {
      sourceDoctorId,
      targetDoctorId
    });
    return response.data;
  }

  /**
   * Obtener todos los servicios con filtros
   */
  async getAll(
    doctorId?: string, 
    onlyActive = true, 
    search?: string
  ): Promise<MedicalService[]> {
    const response = await axios.get('/services', {
      params: { doctorId, onlyActive, search }
    });
    return response.data;
  }

  /**
   * Obtener servicio por ID
   */
  async getById(id: string): Promise<MedicalService> {
    const response = await axios.get(`/services/${id}`);
    return response.data;
  }

  /**
   * Obtener servicios de un doctor
   */
  async getByDoctor(
    doctorId: string, 
    onlyActive = true
  ): Promise<MedicalService[]> {
    const response = await axios.get(`/services/doctor/${doctorId}`, {
      params: { onlyActive }
    });
    return response.data;
  }

  /**
   * Obtener servicios por especialidad
   */
  async getBySpecialty(
    specialtyId: string, 
    onlyActive = true
  ): Promise<MedicalService[]> {
    const response = await axios.get(`/services/specialty/${specialtyId}`, {
      params: { onlyActive }
    });
    return response.data;
  }

  /**
   * Buscar servicios
   */
  async search(
    searchTerm: string, 
    onlyActive = true
  ): Promise<MedicalService[]> {
    const response = await axios.get('/services/search/query', {
      params: { q: searchTerm, onlyActive }
    });
    return response.data;
  }

  /**
   * Obtener servicios por rango de precios
   */
  async getByPriceRange(
    minPrice: number, 
    maxPrice: number, 
    onlyActive = true
  ): Promise<MedicalService[]> {
    const response = await axios.get('/services/filter/price-range', {
      params: { minPrice, maxPrice, onlyActive }
    });
    return response.data;
  }

  /**
   * Obtener servicios por duración máxima
   */
  async getByMaxDuration(
    maxDuration: number, 
    onlyActive = true
  ): Promise<MedicalService[]> {
    const response = await axios.get('/services/filter/max-duration', {
      params: { maxDuration, onlyActive }
    });
    return response.data;
  }

  /**
   * Obtener servicios más populares
   */
  async getMostPopular(limit = 10): Promise<MedicalService[]> {
    const response = await axios.get('/services/popular/list', {
      params: { limit }
    });
    return response.data;
  }

  /**
   * Actualizar servicio
   */
  async update(id: string, data: UpdateServiceDto): Promise<MedicalService> {
    const response = await axios.patch(`/services/${id}`, data);
    return response.data;
  }

  /**
   * Actualizar precios masivamente
   */
  async updateAllPrices(
    doctorId: string, 
    percentageChange: number
  ): Promise<MedicalService[]> {
    const response = await axios.patch(`/services/doctor/${doctorId}/update-prices`, {
      percentageChange
    });
    return response.data;
  }

  /**
   * Activar servicio
   */
  async activate(id: string): Promise<MedicalService> {
    const response = await axios.patch(`/services/${id}/activate`);
    return response.data;
  }

  /**
   * Desactivar servicio
   */
  async deactivate(id: string): Promise<MedicalService> {
    const response = await axios.patch(`/services/${id}/deactivate`);
    return response.data;
  }

  /**
   * Eliminar servicio
   */
  async delete(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`/services/${id}`);
    return response.data;
  }

  /**
   * Eliminar todos los servicios de un doctor
   */
  async deleteAllByDoctor(doctorId: string): Promise<{ message: string }> {
    const response = await axios.delete(`/services/doctor/${doctorId}/all`);
    return response.data;
  }

  /**
   * Verificar si un doctor tiene servicios
   */
  async hasServices(doctorId: string): Promise<{ doctorId: string; hasServices: boolean }> {
    const response = await axios.get(`/services/doctor/${doctorId}/has-services`);
    return response.data;
  }

  /**
   * Contar servicios
   */
  async count(
    doctorId: string, 
    onlyActive = true
  ): Promise<{ doctorId: string; count: number }> {
    const response = await axios.get(`/services/doctor/${doctorId}/count`, {
      params: { onlyActive }
    });
    return response.data;
  }

  /**
   * Obtener servicio más caro
   */
  async getMostExpensive(doctorId: string): Promise<MedicalService | null> {
    const response = await axios.get(`/services/doctor/${doctorId}/most-expensive`);
    return response.data;
  }

  /**
   * Obtener servicio más económico
   */
  async getCheapest(doctorId: string): Promise<MedicalService | null> {
    const response = await axios.get(`/services/doctor/${doctorId}/cheapest`);
    return response.data;
  }

  /**
   * Obtener servicio más largo
   */
  async getLongest(doctorId: string): Promise<MedicalService | null> {
    const response = await axios.get(`/services/doctor/${doctorId}/longest`);
    return response.data;
  }

  /**
   * Obtener servicio más corto
   */
  async getShortest(doctorId: string): Promise<MedicalService | null> {
    const response = await axios.get(`/services/doctor/${doctorId}/shortest`);
    return response.data;
  }

  /**
   * Obtener estadísticas de servicios
   */
  async getStats(doctorId: string): Promise<ServiceStats> {
    const response = await axios.get(`/services/doctor/${doctorId}/stats`);
    return response.data;
  }
}

export const medicalServicesService = new MedicalServicesService();