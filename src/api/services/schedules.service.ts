// src/api/services/schedules.service.ts
import axios from '../axios.config';

export interface DoctorSchedule {
  id: string;
  doctorId: string;
  dayOfWeek: number; // 0=Domingo, 6=Sábado
  startTime: string; // HH:MM:SS
  endTime: string; // HH:MM:SS
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateScheduleDto {
  doctorId: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive?: boolean;
}

export interface ScheduleStats {
  doctorId: string;
  totalSchedules: number;
  workingDays: number[];
  totalWorkingDays: number;
  totalWeeklyHours: number;
  schedulesByDay: Record<string, any[]>;
}

class SchedulesService {
  /**
   * Crear horario
   */
  async create(data: CreateScheduleDto): Promise<DoctorSchedule> {
    const response = await axios.post('/schedules', data);
    return response.data;
  }

  /**
   * Crear múltiples horarios
   */
  async createBulk(schedules: CreateScheduleDto[]): Promise<DoctorSchedule[]> {
    const response = await axios.post('/schedules/bulk', schedules);
    return response.data;
  }

  /**
   * Obtener todos los horarios con filtros
   */
  async getAll(doctorId?: string, dayOfWeek?: number, onlyActive = true): Promise<DoctorSchedule[]> {
    const response = await axios.get('/schedules', {
      params: { doctorId, dayOfWeek, onlyActive }
    });
    return response.data;
  }

  /**
   * Obtener horario por ID
   */
  async getById(id: string): Promise<DoctorSchedule> {
    const response = await axios.get(`/schedules/${id}`);
    return response.data;
  }

  /**
   * Obtener horarios de un doctor
   */
  async getByDoctor(doctorId: string, onlyActive = true): Promise<DoctorSchedule[]> {
    const response = await axios.get(`/schedules/doctor/${doctorId}`, {
      params: { onlyActive }
    });
    return response.data;
  }

  /**
   * Obtener horarios por día
   */
  async getByDoctorAndDay(doctorId: string, dayOfWeek: number, onlyActive = true): Promise<DoctorSchedule[]> {
    const response = await axios.get(`/schedules/doctor/${doctorId}/day/${dayOfWeek}`, {
      params: { onlyActive }
    });
    return response.data;
  }

  /**
   * Obtener horarios por fecha
   */
  async getByDoctorAndDate(doctorId: string, date: string): Promise<DoctorSchedule[]> {
    const response = await axios.get(`/schedules/doctor/${doctorId}/date`, {
      params: { date }
    });
    return response.data;
  }

  /**
   * Actualizar horario
   */
  async update(id: string, data: Partial<CreateScheduleDto>): Promise<DoctorSchedule> {
    const response = await axios.patch(`/schedules/${id}`, data);
    return response.data;
  }

  /**
   * Activar horario
   */
  async activate(id: string): Promise<DoctorSchedule> {
    const response = await axios.patch(`/schedules/${id}/activate`);
    return response.data;
  }

  /**
   * Desactivar horario
   */
  async deactivate(id: string): Promise<DoctorSchedule> {
    const response = await axios.patch(`/schedules/${id}/deactivate`);
    return response.data;
  }

  /**
   * Eliminar horario
   */
  async delete(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`/schedules/${id}`);
    return response.data;
  }

  /**
   * Eliminar todos los horarios de un doctor
   */
  async deleteAllByDoctor(doctorId: string): Promise<{ message: string }> {
    const response = await axios.delete(`/schedules/doctor/${doctorId}/all`);
    return response.data;
  }

  /**
   * Duplicar horarios
   */
  async duplicate(doctorId: string, sourceDayOfWeek: number, targetDayOfWeek: number): Promise<DoctorSchedule[]> {
    const response = await axios.post(`/schedules/doctor/${doctorId}/duplicate`, {
      sourceDayOfWeek,
      targetDayOfWeek
    });
    return response.data;
  }

  /**
   * Verificar si tiene horarios
   */
  async hasSchedules(doctorId: string): Promise<{ doctorId: string; hasSchedules: boolean }> {
    const response = await axios.get(`/schedules/doctor/${doctorId}/has-schedules`);
    return response.data;
  }

  /**
   * Obtener días laborales
   */
  async getWorkingDays(doctorId: string): Promise<{ doctorId: string; workingDays: number[]; dayNames: string[] }> {
    const response = await axios.get(`/schedules/doctor/${doctorId}/working-days`);
    return response.data;
  }

  /**
   * Obtener próximo día disponible
   */
  async getNextAvailableDay(doctorId: string, fromDate?: string) {
    const response = await axios.get(`/schedules/doctor/${doctorId}/next-available-day`, {
      params: { fromDate }
    });
    return response.data;
  }

  /**
   * Verificar si trabaja en una fecha
   */
  async isWorkingOnDate(doctorId: string, date: string) {
    const response = await axios.get(`/schedules/doctor/${doctorId}/is-working`, {
      params: { date }
    });
    return response.data;
  }

  /**
   * Obtener rango de horas
   */
  async getWorkingHoursRange(doctorId: string, date: string) {
    const response = await axios.get(`/schedules/doctor/${doctorId}/working-hours-range`, {
      params: { date }
    });
    return response.data;
  }

  /**
   * Obtener estadísticas
   */
  async getStats(doctorId: string): Promise<ScheduleStats> {
    const response = await axios.get(`/schedules/doctor/${doctorId}/stats`);
    return response.data;
  }
}

export const schedulesService = new SchedulesService();