// src/api/services/medical-history.service.ts
import type { GeneratedMedicalHistory, GenerateMedicalHistoryDto, MedicalHistoryListResponse, MedicalHistoryQuery, MedicalHistoryStats } from '../../types/medical-history.types';
import axios from '../axios.config';
import { ENDPOINTS } from '../endpoints';


/**
 * Servicio para gestionar historiales médicos generados por IA
 */
class MedicalHistoryService {
  /**
   * Generar un nuevo historial médico usando IA
   * NOTA: Esta operación puede tardar 30-90 segundos
   * 
   * @param patientId - ID del paciente
   * @param data - Opciones de generación
   * @param userId - ID del usuario que genera (doctor/admin)
   * @returns Historial médico generado
   */
  async generateHistory(
    patientId: string,
    data: GenerateMedicalHistoryDto,
    userId: string
  ): Promise<GeneratedMedicalHistory> {
    const response = await axios.post<GeneratedMedicalHistory>(
      ENDPOINTS.MEDICAL_HISTORY.GENERATE(patientId),
      data,
      {
        headers: {
          'x-user-id': userId,
        },
        timeout: 120000, // 2 minutos timeout (generación puede tardar)
      }
    );
    return response.data;
  }

  /**
   * Obtener un historial médico por ID
   * 
   * @param historyId - ID del historial
   * @returns Historial médico
   */
  async getHistoryById(historyId: string): Promise<GeneratedMedicalHistory> {
    const response = await axios.get<GeneratedMedicalHistory>(
      ENDPOINTS.MEDICAL_HISTORY.BY_ID(historyId)
    );
    return response.data;
  }

  /**
   * Obtener todos los historiales de un paciente
   * 
   * @param patientId - ID del paciente
   * @param query - Parámetros de filtro y paginación
   * @returns Lista paginada de historiales
   */
  async getHistoriesByPatient(
    patientId: string,
    query?: Omit<MedicalHistoryQuery, 'patientId'>
  ): Promise<MedicalHistoryListResponse> {
    const response = await axios.get<MedicalHistoryListResponse>(
      ENDPOINTS.MEDICAL_HISTORY.BY_PATIENT(patientId),
      { params: query }
    );
    return response.data;
  }

  /**
   * Obtener todos los historiales con filtros
   * 
   * @param query - Parámetros de filtro y paginación
   * @returns Lista paginada de historiales
   */
  async getAll(query?: MedicalHistoryQuery): Promise<MedicalHistoryListResponse> {
    const response = await axios.get<MedicalHistoryListResponse>(
      ENDPOINTS.MEDICAL_HISTORY.BASE,
      { params: query }
    );
    return response.data;
  }

  /**
   * Descargar historial médico como PDF
   * NOTA: Esta operación puede tardar 10-30 segundos
   * 
   * @param historyId - ID del historial
   * @returns Blob del PDF
   */
  async downloadPdf(historyId: string): Promise<Blob> {
    const response = await axios.get(
      ENDPOINTS.MEDICAL_HISTORY.PDF(historyId),
      {
        responseType: 'blob', // IMPORTANTE: para recibir archivos binarios
        timeout: 60000, // 1 minuto timeout (generación de PDF puede tardar)
        headers: {
          'Accept': 'application/pdf',
        },
      }
    );
    return response.data;
  }

  /**
   * Obtener vista previa del historial en HTML
   * 
   * @param historyId - ID del historial
   * @returns HTML del historial
   */
  async getPreview(historyId: string): Promise<string> {
    const response = await axios.get<string>(
      ENDPOINTS.MEDICAL_HISTORY.PREVIEW(historyId),
      {
        headers: {
          'Accept': 'text/html',
        },
      }
    );
    return response.data;
  }

  /**
   * Eliminar un historial médico
   * 
   * @param historyId - ID del historial
   * @returns Mensaje de confirmación
   */
  async delete(historyId: string): Promise<{ message: string }> {
    const response = await axios.delete<{ message: string }>(
      ENDPOINTS.MEDICAL_HISTORY.DELETE(historyId)
    );
    return response.data;
  }

  /**
   * Obtener estadísticas de historiales de un paciente
   * 
   * @param patientId - ID del paciente
   * @returns Estadísticas
   */
  async getStats(patientId: string): Promise<MedicalHistoryStats> {
    const response = await axios.get<MedicalHistoryStats>(
      ENDPOINTS.MEDICAL_HISTORY.STATS(patientId)
    );
    return response.data;
  }

  /**
   * Verificar si un paciente tiene historiales
   * 
   * @param patientId - ID del paciente
   * @returns true si tiene al menos un historial
   */
  async hasHistories(patientId: string): Promise<boolean> {
    try {
      const response = await this.getHistoriesByPatient(patientId, { limit: 1 });
      return response.total > 0;
    } catch (error) {
      return false;
    }
  }

  /**
   * Obtener el historial más reciente de un paciente
   * 
   * @param patientId - ID del paciente
   * @returns Historial más reciente o null
   */
  async getLatest(patientId: string): Promise<GeneratedMedicalHistory | null> {
    try {
      const response = await this.getHistoriesByPatient(patientId, {
        sortBy: 'generatedAt',
        order: 'DESC',
        limit: 1,
      });
      return response.data[0] || null;
    } catch (error) {
      return null;
    }
  }
}

// Exportar instancia única del servicio
export const medicalHistoryService = new MedicalHistoryService();

// Exportar también la clase por si se necesita extender
export default MedicalHistoryService;