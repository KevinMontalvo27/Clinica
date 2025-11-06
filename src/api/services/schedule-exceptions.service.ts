// src/api/services/schedule-exceptions.service.ts
import axios from '../axios.config';

export interface ScheduleException {
  id: string;
  doctorId: string;
  exceptionDate: string; // YYYY-MM-DD
  startTime?: string | null; // HH:MM:SS (null si es día completo)
  endTime?: string | null; // HH:MM:SS (null si es día completo)
  reason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExceptionDto {
  doctorId: string;
  exceptionDate: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
}

export interface CreateMultipleExceptionsDto {
  doctorId: string;
  startDate: string;
  endDate: string;
  reason: string;
  startTime?: string;
  endTime?: string;
}

export interface ExceptionStats {
  doctorId: string;
  total: number;
  future: number;
  expired: number;
  fullDay: number;
  partial: number;
  nextException: ScheduleException | null;
}

class ScheduleExceptionsService {
  /**
   * Crear excepción de horario
   */
  async create(data: CreateExceptionDto): Promise<ScheduleException> {
    const response = await axios.post('/schedule-exceptions', data);
    return response.data;
  }

  /**
   * Crear excepciones para múltiples días (vacaciones)
   */
  async createMultipleDays(data: CreateMultipleExceptionsDto): Promise<ScheduleException[]> {
    const response = await axios.post('/schedule-exceptions/bulk', data);
    return response.data;
  }

  /**
   * Obtener todas las excepciones con filtros
   */
  async getAll(
    doctorId?: string, 
    startDate?: string, 
    endDate?: string
  ): Promise<ScheduleException[]> {
    const response = await axios.get('/schedule-exceptions', {
      params: { doctorId, startDate, endDate }
    });
    return response.data;
  }

  /**
   * Obtener excepción por ID
   */
  async getById(id: string): Promise<ScheduleException> {
    const response = await axios.get(`/schedule-exceptions/${id}`);
    return response.data;
  }

  /**
   * Obtener excepciones de un doctor
   */
  async getByDoctor(
    doctorId: string, 
    includeExpired = false
  ): Promise<ScheduleException[]> {
    const response = await axios.get(`/schedule-exceptions/doctor/${doctorId}`, {
      params: { includeExpired }
    });
    return response.data;
  }

  /**
   * Obtener excepciones por fecha
   */
  async getByDoctorAndDate(
    doctorId: string, 
    date: string
  ): Promise<ScheduleException[]> {
    const response = await axios.get(`/schedule-exceptions/doctor/${doctorId}/date`, {
      params: { date }
    });
    return response.data;
  }

  /**
   * Obtener excepciones en un rango de fechas
   */
  async getByDoctorAndDateRange(
    doctorId: string, 
    startDate: string, 
    endDate: string
  ): Promise<ScheduleException[]> {
    const response = await axios.get(`/schedule-exceptions/doctor/${doctorId}/date-range`, {
      params: { startDate, endDate }
    });
    return response.data;
  }

  /**
   * Obtener próximas excepciones
   */
  async getUpcoming(
    doctorId: string, 
    limit = 10
  ): Promise<ScheduleException[]> {
    const response = await axios.get(`/schedule-exceptions/doctor/${doctorId}/upcoming`, {
      params: { limit }
    });
    return response.data;
  }

  /**
   * Verificar si hay excepción en fecha/hora
   */
  async hasExceptionOnDate(
    doctorId: string, 
    date: string, 
    time?: string
  ): Promise<{ doctorId: string; date: string; time?: string; hasException: boolean }> {
    const response = await axios.get(`/schedule-exceptions/doctor/${doctorId}/check`, {
      params: { date, time }
    });
    return response.data;
  }

  /**
   * Verificar si es día completo bloqueado
   */
  async isFullDayException(
    doctorId: string, 
    date: string
  ): Promise<{ doctorId: string; date: string; isFullDay: boolean }> {
    const response = await axios.get(`/schedule-exceptions/doctor/${doctorId}/is-full-day`, {
      params: { date }
    });
    return response.data;
  }

  /**
   * Obtener rangos de tiempo bloqueados
   */
  async getBlockedTimeRanges(
    doctorId: string, 
    date: string
  ) {
    const response = await axios.get(`/schedule-exceptions/doctor/${doctorId}/blocked-times`, {
      params: { date }
    });
    return response.data;
  }

  /**
   * Obtener días bloqueados en un mes
   */
  async getBlockedDaysInMonth(
    doctorId: string, 
    year: number, 
    month: number
  ): Promise<{ doctorId: string; year: number; month: number; blockedDays: Date[] }> {
    const response = await axios.get(`/schedule-exceptions/doctor/${doctorId}/blocked-days-in-month`, {
      params: { year, month }
    });
    return response.data;
  }

  /**
   * Eliminar excepción
   */
  async delete(id: string): Promise<{ message: string }> {
    const response = await axios.delete(`/schedule-exceptions/${id}`);
    return response.data;
  }

  /**
   * Eliminar todas las excepciones de un doctor
   */
  async deleteAllByDoctor(doctorId: string): Promise<{ message: string }> {
    const response = await axios.delete(`/schedule-exceptions/doctor/${doctorId}/all`);
    return response.data;
  }

  /**
   * Eliminar excepciones por fecha
   */
  async deleteByDate(
    doctorId: string, 
    date: string
  ): Promise<{ message: string }> {
    const response = await axios.delete(`/schedule-exceptions/doctor/${doctorId}/date`, {
      params: { date }
    });
    return response.data;
  }

  /**
   * Eliminar excepciones expiradas
   */
  async deleteExpired(
    doctorId?: string
  ): Promise<{ message: string; deletedCount: number }> {
    const response = await axios.delete('/schedule-exceptions/cleanup/expired', {
      params: { doctorId }
    });
    return response.data;
  }

  /**
   * Obtener estadísticas de excepciones
   */
  async getStats(doctorId: string): Promise<ExceptionStats> {
    const response = await axios.get(`/schedule-exceptions/doctor/${doctorId}/stats`);
    return response.data;
  }

  /**
   * Contar excepciones
   */
  async count(
    doctorId: string, 
    onlyFuture = true
  ): Promise<{ doctorId: string; count: number; onlyFuture: boolean }> {
    const response = await axios.get(`/schedule-exceptions/doctor/${doctorId}/count`, {
      params: { onlyFuture }
    });
    return response.data;
  }
}

export const scheduleExceptionsService = new ScheduleExceptionsService();