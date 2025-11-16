// src/api/services/consultations.service.ts
import axios from '../axios.config';

export interface Consultation {
  id: string;
  appointmentId?: string;
  patientId: string;
  doctorId: string;
  patient: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
  doctor: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
    specialty: {
      name: string;
    };
  };
  weight?: number;
  height?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  chiefComplaint?: string;
  symptoms?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  prescriptions?: string;
  followUpInstructions?: string;
  attachments?: string;
  notes?: string;
  consultationDate: Date;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConsultationDto {
  appointmentId?: string;
  patientId: string;
  doctorId: string;
  weight?: number;
  height?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  chiefComplaint?: string;
  symptoms?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  prescriptions?: string;
  followUpInstructions?: string;
  attachments?: string;
  notes?: string;
}

export interface ConsultationQuery {
  patientId?: string;
  doctorId?: string;
  appointmentId?: string;
  startDate?: string;
  endDate?: string;
  diagnosisSearch?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

class ConsultationsService {
  async create(data: CreateConsultationDto): Promise<Consultation> {
    const response = await axios.post('/consultations', data);
    return response.data;
  }

  async getAll(query?: ConsultationQuery) {
    const response = await axios.get('/consultations', { params: query });
    return response.data;
  }

  async getById(id: string): Promise<Consultation> {
    const response = await axios.get(`/consultations/${id}`);
    return response.data;
  }

  async getByPatient(
    patientId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Consultation[]> {
    const response = await axios.get(`/consultations/patient/${patientId}`, {
      params: { startDate, endDate }
    });
    return response.data;
  }

  async getByDoctor(
    doctorId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Consultation[]> {
    const response = await axios.get(`/consultations/doctor/${doctorId}`, {
      params: { startDate, endDate }
    });
    return response.data;
  }

  async getLastByPatient(patientId: string): Promise<Consultation | null> {
    const response = await axios.get(`/consultations/patient/${patientId}/last`);
    return response.data;
  }

  async getRecent(limit: number = 10): Promise<Consultation[]> {
    const response = await axios.get('/consultations/recent/list', {
      params: { limit }
    });
    return response.data;
  }

  async getToday(doctorId?: string): Promise<Consultation[]> {
    const response = await axios.get('/consultations/today/list', {
      params: { doctorId }
    });
    return response.data;
  }

  async searchByDiagnosis(searchTerm: string): Promise<Consultation[]> {
    const response = await axios.get('/consultations/search/diagnosis', {
      params: { q: searchTerm }
    });
    return response.data;
  }

  async update(id: string, data: Partial<CreateConsultationDto>): Promise<Consultation> {
    const response = await axios.patch(`/consultations/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`/consultations/${id}`);
    return response.data;
  }

  async countByPatient(patientId: string): Promise<{ patientId: string; count: number }> {
    const response = await axios.get(`/consultations/patient/${patientId}/count`);
    return response.data;
  }

  async countByDoctor(doctorId: string): Promise<{ doctorId: string; count: number }> {
    const response = await axios.get(`/consultations/doctor/${doctorId}/count`);
    return response.data;
  }

  async getVitalSignsStats(patientId: string): Promise<any> {
    const response = await axios.get(`/consultations/patient/${patientId}/vital-signs-stats`);
    return response.data;
  }

  async getStatistics(): Promise<any> {
    const response = await axios.get('/consultations/stats/general');
    return response.data;
  }

  async getCommonDiagnoses(limit: number = 10): Promise<any[]> {
    const response = await axios.get('/consultations/stats/common-diagnoses', {
      params: { limit }
    });
    return response.data;
  }
}

export const consultationsService = new ConsultationsService();