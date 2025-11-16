// src/api/services/appointments.service.ts
import axios from '../axios.config';

export type AppointmentStatus = 
  | 'SCHEDULED' 
  | 'CONFIRMED' 
  | 'CANCELLED' 
  | 'COMPLETED' 
  | 'NO_SHOW' 
  | 'RESCHEDULED';

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  serviceId: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // HH:MM:SS
  duration: number;
  status: AppointmentStatus;
  notes?: string;
  reason?: string;
  createdAt: string;
  updatedAt: string;
  patient?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
    };
  };
  doctor?: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
    specialty: {
      id: string;
      name: string;
    };
  };
  service?: {
    id: string;
    name: string;
    price: number;
    duration: number;
  };
}

export interface CreateAppointmentDto {
  patientId: string;
  doctorId: string;
  serviceId: string;
  appointmentDate: string;
  appointmentTime: string;
  duration?: number;
  notes?: string;
  reason?: string;
}

export interface UpdateAppointmentDto {
  appointmentDate?: string;
  appointmentTime?: string;
  duration?: number;
  notes?: string;
  reason?: string;
}

export interface RescheduleAppointmentDto {
  newDate: string;
  newTime: string;
  reason?: string;
}

export interface CancelAppointmentDto {
  reason: string;
}

export interface AppointmentQuery {
  doctorId?: string;
  patientId?: string;
  status?: AppointmentStatus;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface AppointmentStatistics {
  total: number;
  byStatus: Record<AppointmentStatus, number>;
  completionRate: string;
  cancellationRate: string;
  noShowRate: string;
}

class AppointmentsService {
  /**
   * Crear nueva cita
   */
  async create(data: CreateAppointmentDto): Promise<Appointment> {
    const response = await axios.post('/appointments', data);
    return response.data;
  }

  /**
   * Obtener todas las citas con filtros
   */
  async getAll(query?: AppointmentQuery) {
    const response = await axios.get('/appointments', { params: query });
    return response.data;
  }

  /**
   * Obtener cita por ID
   */
  async getById(id: string): Promise<Appointment> {
    const response = await axios.get(`/appointments/${id}`);
    return response.data;
  }

  /**
   * Obtener citas de un doctor
   */
  async getByDoctor(
    doctorId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Appointment[]> {
    const response = await axios.get(`/appointments/doctor/${doctorId}`, {
      params: { startDate, endDate }
    });
    return response.data;
  }

  /**
   * Obtener citas de un paciente
   */
  async getByPatient(
    patientId: string,
    startDate?: string,
    endDate?: string
  ): Promise<Appointment[]> {
    const response = await axios.get(`/appointments/patient/${patientId}`, {
      params: { startDate, endDate }
    });
    return response.data;
  }

  /**
   * Obtener citas por estado
   */
  async getByStatus(status: AppointmentStatus): Promise<Appointment[]> {
    const response = await axios.get(`/appointments/status/${status}`);
    return response.data;
  }

  /**
   * Obtener citas de hoy
   */
  async getToday(doctorId?: string): Promise<Appointment[]> {
    const response = await axios.get('/appointments/today/list', {
      params: { doctorId }
    });
    return response.data;
  }

  /**
   * Obtener citas próximas (próximos 7 días)
   */
  async getUpcoming(
    patientId?: string,
    doctorId?: string
  ): Promise<Appointment[]> {
    const response = await axios.get('/appointments/upcoming/list', {
      params: { patientId, doctorId }
    });
    return response.data;
  }

  /**
   * Actualizar cita
   */
  async update(id: string, data: UpdateAppointmentDto): Promise<Appointment> {
    const response = await axios.patch(`/appointments/${id}`, data);
    return response.data;
  }

  /**
   * Actualizar estado de cita
   */
  async updateStatus(
    id: string,
    status: AppointmentStatus,
    reason?: string
  ): Promise<Appointment> {
    const response = await axios.patch(`/appointments/${id}/status`, {
      status,
      reason
    });
    return response.data;
  }

  /**
   * Confirmar cita
   */
  async confirm(id: string): Promise<Appointment> {
    const response = await axios.patch(`/appointments/${id}/confirm`);
    return response.data;
  }

  /**
   * Completar cita
   */
  async complete(id: string): Promise<Appointment> {
    const response = await axios.patch(`/appointments/${id}/complete`);
    return response.data;
  }

  /**
   * Marcar como no se presentó
   */
  async markAsNoShow(id: string): Promise<Appointment> {
    const response = await axios.patch(`/appointments/${id}/no-show`);
    return response.data;
  }

  /**
   * Reagendar cita
   */
  async reschedule(
    id: string,
    data: RescheduleAppointmentDto
  ): Promise<Appointment> {
    const response = await axios.patch(`/appointments/${id}/reschedule`, data);
    return response.data;
  }

  /**
   * Cancelar cita
   */
  async cancel(id: string, data: CancelAppointmentDto): Promise<Appointment> {
    const response = await axios.patch(`/appointments/${id}/cancel`, data);
    return response.data;
  }

  /**
   * Eliminar cita
   */
  async delete(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`/appointments/${id}`);
    return response.data;
  }

  /**
   * Obtener historial de cambios de una cita
   */
  async getHistory(id: string): Promise<any[]> {
    const response = await axios.get(`/appointments/${id}/history`);
    return response.data;
  }

  /**
   * Contar citas por estado
   */
  async countByStatus(
    doctorId?: string,
    patientId?: string
  ): Promise<Record<AppointmentStatus, number>> {
    const response = await axios.get('/appointments/stats/count-by-status', {
      params: { doctorId, patientId }
    });
    return response.data;
  }

  /**
   * Obtener estadísticas generales
   */
  async getStatistics(
    doctorId?: string,
    patientId?: string
  ): Promise<AppointmentStatistics> {
    const response = await axios.get('/appointments/stats/general', {
      params: { doctorId, patientId }
    });
    return response.data;
  }
}

export const appointmentsService = new AppointmentsService();