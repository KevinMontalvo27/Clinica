import { useState } from 'react';
import { Filter, SortAsc, SortDesc } from 'lucide-react';
import MedicalHistoryCard from './MedicalHistoryCard';
import { EmptyState, Spinner } from '../../../components/common';
import type { GeneratedMedicalHistory, MedicalHistoryType } from '../../../types/medical-history.types';

interface MedicalHistoryListProps {
  histories: GeneratedMedicalHistory[];
  isLoading?: boolean;
  onView?: (historyId: string) => void;
  onDownload?: (historyId: string) => void;
  onDelete?: (historyId: string) => void;
  downloadingIds?: string[];
  className?: string;
}

export default function MedicalHistoryList({
  histories = [],
  isLoading = false,
  onView,
  onDownload,
  onDelete,
  downloadingIds = [],
  className = '',
}: MedicalHistoryListProps) {
  const [filterType, setFilterType] = useState<MedicalHistoryType | 'ALL'>('ALL');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  // Filtrar por tipo
  const filteredHistories = filterType === 'ALL'
    ? histories
    : histories.filter(h => h.historyType === filterType);

  // Ordenar por fecha
  const sortedHistories = [...filteredHistories].sort((a, b) => {
    const dateA = new Date(a.generatedAt).getTime();
    const dateB = new Date(b.generatedAt).getTime();
    return sortOrder === 'DESC' ? dateB - dateA : dateA - dateB;
  });

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'DESC' ? 'ASC' : 'DESC');
  };

  if (isLoading) {
    return (
      <div className={`flex justify-center py-12 ${className}`}>
        <Spinner size="lg" text="Cargando historiales médicos..." />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controles de filtro y orden */}
      {histories.length > 0 && (
        <div className="flex flex-wrap gap-3 items-center justify-between bg-base-200 rounded-lg p-4">
          {/* Filtros por tipo */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-base-content/60" />
            <button
              onClick={() => setFilterType('ALL')}
              className={`btn btn-sm ${filterType === 'ALL' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilterType('complete')}
              className={`btn btn-sm ${filterType === 'complete' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Completos
            </button>
            <button
              onClick={() => setFilterType('summary')}
              className={`btn btn-sm ${filterType === 'summary' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Resúmenes
            </button>
            <button
              onClick={() => setFilterType('chronological')}
              className={`btn btn-sm ${filterType === 'chronological' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Cronológicos
            </button>
            <button
              onClick={() => setFilterType('by_systems')}
              className={`btn btn-sm ${filterType === 'by_systems' ? 'btn-primary' : 'btn-ghost'}`}
            >
              Por Sistemas
            </button>
          </div>

          {/* Orden */}
          <button
            onClick={toggleSortOrder}
            className="btn btn-sm btn-ghost gap-2"
          >
            {sortOrder === 'DESC' ? (
              <>
                <SortDesc className="w-4 h-4" />
                Más recientes
              </>
            ) : (
              <>
                <SortAsc className="w-4 h-4" />
                Más antiguos
              </>
            )}
          </button>
        </div>
      )}

      {/* Contador de resultados */}
      {histories.length > 0 && (
        <p className="text-sm text-base-content/60">
          {sortedHistories.length} historial{sortedHistories.length !== 1 ? 'es' : ''} 
          {filterType !== 'ALL' && ` (filtrado${sortedHistories.length !== 1 ? 's' : ''})`}
        </p>
      )}

      {/* Lista de historiales */}
      {sortedHistories.length === 0 ? (
        <EmptyState
          icon="📋"
          title={filterType === 'ALL' ? 'No hay historiales médicos' : 'No hay historiales de este tipo'}
          description={
            filterType === 'ALL'
              ? 'Aún no has generado ningún historial médico. Haz clic en "Generar Historial" para crear uno.'
              : 'Intenta cambiar los filtros para ver más resultados.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedHistories.map((history) => (
            <MedicalHistoryCard
              key={history.id}
              history={history}
              onView={onView}
              onDownload={onDownload}
              onDelete={onDelete}
              isDownloading={downloadingIds.includes(history.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}