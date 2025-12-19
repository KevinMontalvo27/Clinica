import type {
  MedicalHistoryType,
  MedicalHistoryFormat,
  MedicalHistoryLanguage,
} from '../types/medical-history.types';

/**
 * Obtener etiqueta legible del tipo de historial
 */
export const getMedicalHistoryTypeLabel = (type: MedicalHistoryType): string => {
  const labels: Record<MedicalHistoryType, string> = {
    complete: 'Historial Completo',
    summary: 'Resumen Ejecutivo',
    chronological: 'Historial Cronológico',
    by_systems: 'Por Sistemas',
  };
  return labels[type];
};

/**
 * Obtener etiqueta legible del formato
 */
export const getMedicalHistoryFormatLabel = (format: MedicalHistoryFormat): string => {
  const labels: Record<MedicalHistoryFormat, string> = {
    markdown: 'Markdown',
    plain_text: 'Texto Plano',
  };
  return labels[format];
};

/**
 * Obtener etiqueta legible del idioma
 */
export const getMedicalHistoryLanguageLabel = (language: MedicalHistoryLanguage): string => {
  const labels: Record<MedicalHistoryLanguage, string> = {
    es: 'Español',
    en: 'English',
  };
  return labels[language];
};

/**
 * Obtener descripción del tipo de historial
 */
export const getMedicalHistoryTypeDescription = (type: MedicalHistoryType): string => {
  const descriptions: Record<MedicalHistoryType, string> = {
    complete: 'Incluye toda la información médica disponible del paciente',
    summary: 'Resumen ejecutivo de los aspectos más importantes',
    chronological: 'Historia médica ordenada cronológicamente',
    by_systems: 'Organizado por sistemas corporales',
  };
  return descriptions[type];
};

/**
 * Obtener icono para el tipo de historial
 */
export const getMedicalHistoryTypeIcon = (type: MedicalHistoryType): string => {
  const icons: Record<MedicalHistoryType, string> = {
    complete: '📋',
    summary: '📝',
    chronological: '📅',
    by_systems: '🏥',
  };
  return icons[type];
};

/**
 * Obtener color del badge según el tipo
 */
export const getMedicalHistoryTypeBadgeVariant = (
  type: MedicalHistoryType
): 'primary' | 'secondary' | 'accent' | 'info' => {
  const variants: Record<MedicalHistoryType, 'primary' | 'secondary' | 'accent' | 'info'> = {
    complete: 'primary',
    summary: 'secondary',
    chronological: 'accent',
    by_systems: 'info',
  };
  return variants[type];
};

/**
 * Validar que un paciente tenga datos suficientes para generar historial
 */
export const canGenerateHistory = (patientData: {
  hasAppointments: boolean;
  hasConsultations: boolean;
  hasMedicalRecords: boolean;
}): { canGenerate: boolean; reason?: string } => {
  if (!patientData.hasAppointments && !patientData.hasConsultations) {
    return {
      canGenerate: false,
      reason: 'El paciente debe tener al menos una cita o consulta registrada.',
    };
  }

  return { canGenerate: true };
};

/**
 * Estimar tiempo de generación del historial (en segundos)
 */
export const estimateGenerationTime = (type: MedicalHistoryType): number => {
  const times: Record<MedicalHistoryType, number> = {
    complete: 60, // 1 minuto
    summary: 30, // 30 segundos
    chronological: 45, // 45 segundos
    by_systems: 50, // 50 segundos
  };
  return times[type];
};

/**
 * Formatear tiempo estimado en texto legible
 */
export const formatEstimatedTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${seconds} segundos`;
  }
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minuto${minutes > 1 ? 's' : ''}`;
};