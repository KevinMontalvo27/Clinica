import { Badge, Button } from '../../../components/common';
import { FileText, Download, Eye, Trash2, Calendar, Globe, FileType } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { GeneratedMedicalHistory } from '../../../types/medical-history.types';
import {
  getMedicalHistoryTypeLabel,
  getMedicalHistoryFormatLabel,
  getMedicalHistoryLanguageLabel,
  getMedicalHistoryTypeIcon,
  getMedicalHistoryTypeBadgeVariant,
} from '../../../utils/medicalHistoryHelpers';

interface MedicalHistoryCardProps {
  history: GeneratedMedicalHistory;
  onView?: (historyId: string) => void;
  onDownload?: (historyId: string) => void;
  onDelete?: (historyId: string) => void;
  isDownloading?: boolean;
  className?: string;
}

export default function MedicalHistoryCard({
  history,
  onView,
  onDownload,
  onDelete,
  isDownloading = false,
  className = '',
}: MedicalHistoryCardProps) {
  const generatedDate = new Date(history.generatedAt);
  const formattedDate = format(generatedDate, "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es });
  
  const typeLabel = getMedicalHistoryTypeLabel(history.historyType);
  const formatLabel = getMedicalHistoryFormatLabel(history.format);
  const languageLabel = getMedicalHistoryLanguageLabel(history.language);
  const typeIcon = getMedicalHistoryTypeIcon(history.historyType);
  const badgeVariant = getMedicalHistoryTypeBadgeVariant(history.historyType);

  return (
    <div
      className={`card bg-base-100 border-2 border-base-300 hover:shadow-lg transition-all ${className}`}
    >
      <div className="card-body p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="text-4xl flex-shrink-0">{typeIcon}</div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-base-content mb-1">{typeLabel}</h3>
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{formattedDate}</span>
              </div>
            </div>
          </div>
          <Badge variant={badgeVariant} size="sm">
            {typeLabel}
          </Badge>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-base-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <FileType className="w-4 h-4 text-info" />
              <p className="text-xs text-base-content/60">Formato</p>
            </div>
            <p className="text-sm font-medium">{formatLabel}</p>
          </div>

          <div className="bg-base-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="w-4 h-4 text-success" />
              <p className="text-xs text-base-content/60">Idioma</p>
            </div>
            <p className="text-sm font-medium">{languageLabel}</p>
          </div>
        </div>

        {/* Rango de fechas (si existe) */}
        {(history.startDate || history.endDate) && (
          <div className="bg-info/10 border border-info/30 rounded-lg p-3">
            <p className="text-xs text-base-content/60 mb-1">Período incluido:</p>
            <p className="text-sm font-medium">
              {history.startDate && format(new Date(history.startDate), 'd MMM yyyy', { locale: es })}
              {history.startDate && history.endDate && ' - '}
              {history.endDate && format(new Date(history.endDate), 'd MMM yyyy', { locale: es })}
            </p>
          </div>
        )}

        {/* Vista previa del contenido (primeras líneas) */}
        <div className="bg-base-200 rounded-lg p-3 max-h-20 overflow-hidden relative">
          <p className="text-xs text-base-content/70 line-clamp-3">
            {history.content.substring(0, 150)}...
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-base-200 to-transparent" />
        </div>

        {/* Acciones */}
        <div className="flex flex-wrap gap-2">
          {onView && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onView(history.id)}
              className="flex-1 min-w-[100px]"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver
            </Button>
          )}

          {onDownload && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onDownload(history.id)}
              disabled={isDownloading}
              className="flex-1 min-w-[120px]"
            >
              {isDownloading ? (
                <>
                  <span className="loading loading-spinner loading-sm mr-2"></span>
                  Generando...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Descargar PDF
                </>
              )}
            </Button>
          )}

          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(history.id)}
              className="btn-circle"
            >
              <Trash2 className="w-4 h-4 text-error" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}