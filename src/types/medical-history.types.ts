/**
 * Tipos de historial médico disponibles
 */
export type MedicalHistoryType = 
  | 'complete'      // Historial completo
  | 'summary'       // Resumen ejecutivo
  | 'chronological' // Cronológico
  | 'by_systems';   // Por sistemas

/**
 * Formatos de salida disponibles
 */
export type MedicalHistoryFormat = 
  | 'markdown'      // Formato Markdown
  | 'plain_text';   // Texto plano

/**
 * Idiomas soportados
 */
export type MedicalHistoryLanguage = 
  | 'es'  // Español
  | 'en'; // Inglés

/**
 * DTO para generar un nuevo historial médico
 */
export interface GenerateMedicalHistoryDto {
  historyType: MedicalHistoryType;
  format: MedicalHistoryFormat;
  language: MedicalHistoryLanguage;
  startDate?: string; // ISO 8601 format (YYYY-MM-DD)
  endDate?: string;   // ISO 8601 format (YYYY-MM-DD)
}

/**
 * Entidad de historial médico generado (respuesta del servidor)
 */
export interface GeneratedMedicalHistory {
  id: string;
  patientId: string;
  content: string; // Contenido en Markdown o texto plano
  format: MedicalHistoryFormat;
  historyType: MedicalHistoryType;
  language: MedicalHistoryLanguage;
  startDate?: Date;
  endDate?: Date;
  generatedAt: Date;
  generatedBy: string; // ID del usuario que lo generó
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Parámetros de consulta para listar historiales
 */
export interface MedicalHistoryQuery {
  patientId?: string;
  historyType?: MedicalHistoryType;
  format?: MedicalHistoryFormat;
  language?: MedicalHistoryLanguage;
  startDate?: string; // Filtrar por fecha de generación
  endDate?: string;
  sortBy?: 'generatedAt' | 'historyType' | 'createdAt';
  order?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

/**
 * Respuesta paginada de historiales
 */
export interface MedicalHistoryListResponse {
  data: GeneratedMedicalHistory[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Opciones para descargar PDF
 */
export interface DownloadPdfOptions {
  historyId: string;
  filename?: string; // Nombre personalizado del archivo
}

/**
 * Estadísticas de historiales de un paciente
 */
export interface MedicalHistoryStats {
  patientId: string;
  totalHistories: number;
  lastGenerated?: Date;
  byType: Record<MedicalHistoryType, number>;
  byLanguage: Record<MedicalHistoryLanguage, number>;
}