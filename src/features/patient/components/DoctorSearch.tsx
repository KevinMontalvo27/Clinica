import { useState } from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Button } from '../../../components/common';

interface DoctorSearchProps {
  onSearch: (filters: SearchFilters) => void;
  specialties?: Array<{ id: string; name: string }>;
  className?: string;
}

export interface SearchFilters {
  search?: string;
  specialtyId?: string;
  minYearsExperience?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  sortBy: 'firstName' | 'yearsExperience' | 'consultationPrice';
  order: 'ASC' | 'DESC';
}

export default function DoctorSearch({
  onSearch,
  specialties = [],
  className = '',
}: DoctorSearchProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    search: '',
    specialtyId: '',
    minYearsExperience: undefined,
    maxPrice: undefined,
    isAvailable: true,
    sortBy: 'firstName',
    order: 'ASC',
  });

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onSearch(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: SearchFilters = {
      search: '',
      specialtyId: '',
      minYearsExperience: undefined,
      maxPrice: undefined,
      isAvailable: true,
      sortBy: 'firstName',
      order: 'ASC',
    };
    setFilters(defaultFilters);
    onSearch(defaultFilters);
  };

  const hasActiveFilters =
    filters.specialtyId ||
    filters.minYearsExperience ||
    filters.maxPrice ||
    filters.isAvailable === false;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Búsqueda principal */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
          <input
            type="text"
            placeholder="Buscar por nombre o apellido..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="input input-bordered w-full pl-10"
          />
        </div>
        <Button
          variant={showFilters ? 'primary' : 'outline'}
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filtros
          {hasActiveFilters && (
            <span className="badge badge-sm badge-error ml-2">!</span>
          )}
        </Button>
      </div>

      {/* Panel de filtros expandible */}
      {showFilters && (
        <div className="card bg-base-200 border border-base-300">
          <div className="card-body p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Filtros Avanzados</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="btn btn-ghost btn-sm gap-1"
                >
                  <X className="w-4 h-4" />
                  Limpiar
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Especialidad */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Especialidad</span>
                </label>
                <select
                  value={filters.specialtyId}
                  onChange={(e) => handleFilterChange('specialtyId', e.target.value)}
                  className="select select-bordered"
                >
                  <option value="">Todas las especialidades</option>
                  {specialties.map((specialty) => (
                    <option key={specialty.id} value={specialty.id}>
                      {specialty.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experiencia mínima */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Años de experiencia</span>
                </label>
                <input
                  type="number"
                  placeholder="Mínimo"
                  value={filters.minYearsExperience || ''}
                  onChange={(e) =>
                    handleFilterChange('minYearsExperience', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="input input-bordered"
                  min="0"
                />
              </div>

              {/* Precio máximo */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Precio máximo</span>
                </label>
                <input
                  type="number"
                  placeholder="Sin límite"
                  value={filters.maxPrice || ''}
                  onChange={(e) =>
                    handleFilterChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="input input-bordered"
                  min="0"
                />
              </div>

              {/* Ordenar por */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium">Ordenar por</span>
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value as any)}
                  className="select select-bordered"
                >
                  <option value="firstName">Nombre</option>
                  <option value="consultationPrice">Precio</option>
                  <option value="yearsExperience">Experiencia</option>
                </select>
              </div>
            </div>

            {/* Opciones adicionales */}
            <div className="flex flex-wrap gap-4">
              <label className="label cursor-pointer gap-2">
                <input
                  type="checkbox"
                  checked={filters.isAvailable !== false}
                  onChange={(e) => handleFilterChange('isAvailable', e.target.checked)}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Solo doctores disponibles</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="label-text font-medium">Orden:</span>
                <select
                  value={filters.order}
                  onChange={(e) => handleFilterChange('order', e.target.value as 'ASC' | 'DESC')}
                  className="select select-bordered select-sm"
                >
                  <option value="ASC">Ascendente</option>
                  <option value="DESC">Descendente</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}