// src/api/services/availability.service.ts
import axios from '../axios.config';

export interface TimeSlot {
  time: string;
  available: boolean;
  duration: number;
  reason?: string;
}

export interface DayAvailability {
  date: Date;
  dayOfWeek: number;
  dayName: string;
  isWorkingDay: boolean;
  hasException: boolean;
  slots: TimeSlot[];
}

export interface AvailabilityCheck {
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  available: boolean;
  reason?: string;
}

export interface AvailabilitySummary {
  date: Date;
  available: boolean;
  slotsCount: number;
}

export interface AvailabilityStats {
  doctorId: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  availableDays: number;
  unavailableDays: number;
  totalAvailableSlots: number;
  averageSlotsPerDay: string;
}

class AvailabilityService {
  /**
   * Obtener slots disponibles de un doctor en una fecha
   */
  async getAvailableSlots(doctorId: string, date: string, duration = 30) {
    const response = await axios.get(`/availability/doctor/${doctorId}`, {
      params: { date, duration }
    });
    return response.data;
  }

  /**
   * Verificar si un slot específico está disponible
   */
  async checkTimeSlot(doctorId: string, date: string, time: string, duration = 30): Promise<AvailabilityCheck> {
    const response = await axios.get(`/availability/doctor/${doctorId}/check`, {
      params: { date, time, duration }
    });
    return response.data;
  }

  /**
   * Obtener próximos slots disponibles
   */
  async getNextAvailableSlots(
    doctorId: string, 
    fromDate?: string, 
    count = 10, 
    duration = 30
  ) {
    const response = await axios.get(`/availability/doctor/${doctorId}/next-available`, {
      params: { from: fromDate, count, duration }
    });
    return response.data;
  }

  /**
   * Obtener primer slot disponible
   */
  async getFirstAvailableSlot(
    doctorId: string, 
    fromDate?: string, 
    duration = 30
  ) {
    const response = await axios.get(`/availability/doctor/${doctorId}/first-available`, {
      params: { from: fromDate, duration }
    });
    return response.data;
  }

  /**
   * Obtener disponibilidad de una semana
   */
  async getWeekAvailability(
    doctorId: string, 
    startDate: string, 
    duration = 30
  ): Promise<{ doctorId: string; startDate: string; days: DayAvailability[] }> {
    const response = await axios.get(`/availability/doctor/${doctorId}/week`, {
      params: { startDate, duration }
    });
    return response.data;
  }

  /**
   * Obtener disponibilidad de un mes
   */
  async getMonthAvailability(
    doctorId: string, 
    year: number, 
    month: number, 
    duration = 30
  ): Promise<{ doctorId: string; year: number; month: number; days: DayAvailability[] }> {
    const response = await axios.get(`/availability/doctor/${doctorId}/month`, {
      params: { year, month, duration }
    });
    return response.data;
  }

  /**
   * Obtener resumen de disponibilidad
   */
  async getAvailabilitySummary(
    doctorId: string, 
    startDate: string, 
    endDate: string
  ): Promise<{ doctorId: string; startDate: string; endDate: string; summary: AvailabilitySummary[] }> {
    const response = await axios.get(`/availability/doctor/${doctorId}/summary`, {
      params: { startDate, endDate }
    });
    return response.data;
  }

  /**
   * Verificar si hay disponibilidad en un rango
   */
  async hasAvailabilityInRange(
    doctorId: string, 
    startDate: string, 
    endDate: string
  ): Promise<{ doctorId: string; startDate: string; endDate: string; hasAvailability: boolean }> {
    const response = await axios.get(`/availability/doctor/${doctorId}/has-availability`, {
      params: { startDate, endDate }
    });
    return response.data;
  }

  /**
   * Obtener estadísticas de disponibilidad
   */
  async getStats(
    doctorId: string, 
    startDate: string, 
    endDate: string
  ): Promise<AvailabilityStats> {
    const response = await axios.get(`/availability/doctor/${doctorId}/stats`, {
      params: { startDate, endDate }
    });
    return response.data;
  }
}

export const availabilityService = new AvailabilityService();