import { medicalHistoryService } from '../api/services/medical-history.service';

/**
 * Descargar un PDF de historial médico
 * 
 * @param historyId - ID del historial
 * @param customFilename - Nombre personalizado del archivo (opcional)
 * @returns Promise que resuelve cuando la descarga inicia
 */
export const downloadMedicalHistoryPdf = async (
  historyId: string,
  customFilename?: string
): Promise<void> => {
  try {
    // 1. Obtener el blob del PDF desde el backend
    const blob = await medicalHistoryService.downloadPdf(historyId);

    // 2. Crear URL temporal del blob
    const url = URL.createObjectURL(blob);

    // 3. Generar nombre del archivo
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const filename = customFilename || `Historial_Medico_${timestamp}.pdf`;

    // 4. Crear elemento <a> invisible para forzar la descarga
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    // 5. Agregar al DOM, hacer click, y remover
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // 6. Limpiar la URL del blob después de un breve delay
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 100);
  } catch (error) {
    console.error('Error descargando PDF:', error);
    throw new Error('No se pudo descargar el PDF. Por favor intenta nuevamente.');
  }
};

/**
 * Abrir PDF en una nueva pestaña (en lugar de descargar)
 * 
 * @param historyId - ID del historial
 */
export const openMedicalHistoryPdfInNewTab = async (
  historyId: string
): Promise<void> => {
  try {
    const blob = await medicalHistoryService.downloadPdf(historyId);
    const url = URL.createObjectURL(blob);
    
    // Abrir en nueva pestaña
    window.open(url, '_blank');
    
    // Limpiar después de 1 segundo (dar tiempo a que cargue)
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (error) {
    console.error('Error abriendo PDF:', error);
    throw new Error('No se pudo abrir el PDF. Por favor intenta nuevamente.');
  }
};

/**
 * Obtener tamaño legible del blob
 * 
 * @param blob - Blob del PDF
 * @returns Tamaño formateado (ej: "2.5 MB")
 */
export const formatBlobSize = (blob: Blob): string => {
  const bytes = blob.size;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  if (bytes === 0) return '0 Bytes';
  
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = (bytes / Math.pow(1024, i)).toFixed(2);
  
  return `${size} ${sizes[i]}`;
};