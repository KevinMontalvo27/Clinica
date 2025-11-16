// src/api/services/medical-records.service.ts
import axios from '../axios.config';

export interface MedicalRecord {
  id: string;
  patientId: string;
  patient: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      dateOfBirth?: Date;
    };
    bloodType?: string;
  };
  createdBy: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
    specialty: {
      name: string;
    };
  };
  medicalHistory?: string;
  familyHistory?: string;
  allergies?: string;
  chronicDiseases?: string;
  currentMedications?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMedicalRecordDto {
  patientId: string;
  created_by: string;
  medicalHistory?: string;
  familyHistory?: string;
  allergies?: string;
  chronicDiseases?: string;
  currentMedications?: string;
  notes?: string;
}

export interface MedicalRecordQuery {
  patientId?: string;
  doctorId?: string;
  allergySearch?: string;
  diseaseSearch?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

class MedicalRecordsService {
  async create(data: CreateMedicalRecordDto): Promise<MedicalRecord> {
    const response = await axios.post('/medical-records', data);
    return response.data;
  }

  async getAll(query?: MedicalRecordQuery) {
    const response = await axios.get('/medical-records', { params: query });
    return response.data;
  }

  async getById(id: string): Promise<MedicalRecord> {
    const response = await axios.get(`/medical-records/${id}`);
    return response.data;
  }

  async getByPatient(patientId: string): Promise<MedicalRecord> {
    const response = await axios.get(`/medical-records/patient/${patientId}`);
    return response.data;
  }

  async getByDoctor(doctorId: string): Promise<MedicalRecord[]> {
    const response = await axios.get(`/medical-records/doctor/${doctorId}`);
    return response.data;
  }

  async searchByAllergy(searchTerm: string): Promise<MedicalRecord[]> {
    const response = await axios.get('/medical-records/search/allergy', {
      params: { q: searchTerm }
    });
    return response.data;
  }

  async searchByChronicDisease(searchTerm: string): Promise<MedicalRecord[]> {
    const response = await axios.get('/medical-records/search/disease', {
      params: { q: searchTerm }
    });
    return response.data;
  }

  async getWithAllergies(): Promise<MedicalRecord[]> {
    const response = await axios.get('/medical-records/with-allergies/list');
    return response.data;
  }

  async getWithChronicDiseases(): Promise<MedicalRecord[]> {
    const response = await axios.get('/medical-records/with-chronic-diseases/list');
    return response.data;
  }

  async update(id: string, data: Partial<CreateMedicalRecordDto>): Promise<MedicalRecord> {
    const response = await axios.patch(`/medical-records/${id}`, data);
    return response.data;
  }

  async updateByPatient(patientId: string, data: Partial<CreateMedicalRecordDto>): Promise<MedicalRecord> {
    const response = await axios.patch(`/medical-records/patient/${patientId}`, data);
    return response.data;
  }

  async appendMedicalHistory(id: string, additionalHistory: string): Promise<MedicalRecord> {
    const response = await axios.post(`/medical-records/${id}/append-history`, {
      additionalHistory
    });
    return response.data;
  }

  async addAllergy(id: string, allergy: string): Promise<MedicalRecord> {
    const response = await axios.post(`/medical-records/${id}/add-allergy`, {
      allergy
    });
    return response.data;
  }

  async addChronicDisease(id: string, disease: string): Promise<MedicalRecord> {
    const response = await axios.post(`/medical-records/${id}/add-disease`, {
      disease
    });
    return response.data;
  }

  async updateCurrentMedications(id: string, medications: string): Promise<MedicalRecord> {
    const response = await axios.patch(`/medical-records/${id}/medications`, {
      medications
    });
    return response.data;
  }

  async delete(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`/medical-records/${id}`);
    return response.data;
  }

  async hasRecord(patientId: string): Promise<{ patientId: string; hasRecord: boolean }> {
    const response = await axios.get(`/medical-records/patient/${patientId}/exists`);
    return response.data;
  }

  async count(): Promise<{ total: number }> {
    const response = await axios.get('/medical-records/stats/count');
    return response.data;
  }

  async getStatistics(): Promise<any> {
    const response = await axios.get('/medical-records/stats/general');
    return response.data;
  }

  async getCommonAllergies(limit: number = 10): Promise<any[]> {
    const response = await axios.get('/medical-records/stats/common-allergies', {
      params: { limit }
    });
    return response.data;
  }

  async getCommonChronicDiseases(limit: number = 10): Promise<any[]> {
    const response = await axios.get('/medical-records/stats/common-diseases', {
      params: { limit }
    });
    return response.data;
  }
}

export const medicalRecordsService = new MedicalRecordsService();