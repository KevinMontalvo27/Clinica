// src/api/services/patients.service.ts
import axios from '../axios.config';

export interface Patient {
  id: string;
  userId: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  bloodType?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
    isActive: boolean;
  };
  appointments?: any[];
  medicalRecords?: any[];
  consultations?: any[];
}

export interface CreatePatientDto {
  user: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
  };
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  bloodType?: string;
}

export interface UpdatePatientDto {
  user?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    dateOfBirth?: string;
    gender?: string;
    address?: string;
  };
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  bloodType?: string;
}

export interface PatientQuery {
  search?: string;
  bloodType?: string;
  isActive?: boolean;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface PatientStatistics {
  patientId: string;
  name: string;
  email: string;
  bloodType?: string;
  hasInsurance: boolean;
  insuranceProvider?: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  upcomingAppointments: number;
  totalMedicalRecords: number;
  totalConsultations: number;
  registeredAt: string;
  lastAppointment?: string;
}

export interface GeneralStatistics {
  total: number;
  active: number;
  inactive: number;
  withInsurance: number;
  withoutInsurance: number;
  bloodTypeDistribution: Array<{
    bloodType: string;
    count: number;
  }>;
  totalAppointments: number;
  averageAppointmentsPerPatient: number;
}

class PatientsService {
  /**
   * Crear nuevo paciente
   */
  async create(data: CreatePatientDto): Promise<Patient> {
    const response = await axios.post('/patients', data);
    return response.data;
  }

  /**
   * Obtener todos los pacientes con filtros
   */
  async getAll(query?: PatientQuery) {
    const response = await axios.get('/patients', { params: query });
    return response.data;
  }

  /**
   * Obtener paciente por ID
   */
  async getById(id: string): Promise<Patient> {
    const response = await axios.get(`/patients/${id}`);
    return response.data;
  }

  /**
   * Obtener paciente por ID de usuario
   */
  async getByUserId(userId: string): Promise<Patient> {
    const response = await axios.get(`/patients/user/${userId}`);
    return response.data;
  }

  /**
   * Obtener pacientes activos
   */
  async getActive(): Promise<Patient[]> {
    const response = await axios.get('/patients/active/list');
    return response.data;
  }

  /**
   * Buscar pacientes
   */
  async search(searchTerm: string): Promise<Patient[]> {
    const response = await axios.get('/patients/search/query', {
      params: { q: searchTerm }
    });
    return response.data;
  }

  /**
   * Obtener pacientes por tipo de sangre
   */
  async getByBloodType(bloodType: string): Promise<Patient[]> {
    const response = await axios.get(`/patients/blood-type/${bloodType}`);
    return response.data;
  }

  /**
   * Obtener pacientes con seguro médico
   */
  async getWithInsurance(provider?: string): Promise<Patient[]> {
    const response = await axios.get('/patients/insurance/list', {
      params: { provider }
    });
    return response.data;
  }

  /**
   * Obtener pacientes recientes
   */
  async getRecent(limit = 10): Promise<Patient[]> {
    const response = await axios.get('/patients/recent/list', {
      params: { limit }
    });
    return response.data;
  }

  /**
   * Obtener pacientes con más citas
   */
  async getMostAppointments(limit = 10): Promise<Patient[]> {
    const response = await axios.get('/patients/most-appointments/list', {
      params: { limit }
    });
    return response.data;
  }

  /**
   * Actualizar paciente
   */
  async update(id: string, data: UpdatePatientDto): Promise<Patient> {
    const response = await axios.patch(`/patients/${id}`, data);
    return response.data;
  }

  /**
   * Actualizar contacto de emergencia
   */
  async updateEmergencyContact(
    id: string,
    emergencyContactName: string,
    emergencyContactPhone: string
  ): Promise<Patient> {
    const response = await axios.patch(`/patients/${id}/emergency-contact`, {
      emergencyContactName,
      emergencyContactPhone
    });
    return response.data;
  }

  /**
   * Actualizar seguro médico
   */
  async updateInsurance(
    id: string,
    insuranceProvider: string,
    insuranceNumber: string
  ): Promise<Patient> {
    const response = await axios.patch(`/patients/${id}/insurance`, {
      insuranceProvider,
      insuranceNumber
    });
    return response.data;
  }

  /**
   * Actualizar tipo de sangre
   */
  async updateBloodType(id: string, bloodType: string): Promise<Patient> {
    const response = await axios.patch(`/patients/${id}/blood-type`, {
      bloodType
    });
    return response.data;
  }

  /**
   * Desactivar paciente
   */
  async deactivate(id: string): Promise<Patient> {
    const response = await axios.patch(`/patients/${id}/deactivate`);
    return response.data;
  }

  /**
   * Activar paciente
   */
  async activate(id: string): Promise<Patient> {
    const response = await axios.patch(`/patients/${id}/activate`);
    return response.data;
  }

  /**
   * Eliminar paciente
   */
  async delete(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`/patients/${id}`);
    return response.data;
  }

  /**
   * Verificar si tiene seguro médico
   */
  async hasInsurance(id: string): Promise<{ patientId: string; hasInsurance: boolean }> {
    const response = await axios.get(`/patients/${id}/has-insurance`);
    return response.data;
  }

  /**
   * Contar pacientes
   */
  async count(onlyActive = false): Promise<{ total: number; onlyActive: boolean }> {
    const response = await axios.get('/patients/stats/count', {
      params: { onlyActive }
    });
    return response.data;
  }

  /**
   * Contar por tipo de sangre
   */
  async countByBloodType(bloodType: string): Promise<{ bloodType: string; count: number }> {
    const response = await axios.get(`/patients/stats/count-by-blood-type/${bloodType}`);
    return response.data;
  }

  /**
   * Obtener distribución de tipos de sangre
   */
  async getBloodTypeDistribution(): Promise<Array<{ bloodType: string; count: number }>> {
    const response = await axios.get('/patients/stats/blood-type-distribution');
    return response.data;
  }

  /**
   * Obtener estadísticas generales
   */
  async getGeneralStatistics(): Promise<GeneralStatistics> {
    const response = await axios.get('/patients/stats/general');
    return response.data;
  }

  /**
   * Obtener estadísticas de un paciente
   */
  async getStatistics(id: string): Promise<PatientStatistics> {
    const response = await axios.get(`/patients/${id}/statistics`);
    return response.data;
  }

  /**
   * Obtener historial completo del paciente
   */
  async getFullHistory(id: string): Promise<{
    patient: any;
    appointments: any[];
    consultations: any[];
    medicalRecords: any[];
  }> {
    const response = await axios.get(`/patients/${id}/full-history`);
    return response.data;
  }
}

export const patientsService = new PatientsService();