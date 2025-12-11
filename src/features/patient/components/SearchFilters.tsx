import { useState } from 'react';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

export interface SearchFilters {
  search: string;
  specialtyId: string;
  minYearsExperience?: number;
  maxPrice?: number;
  isAvailable?: boolean;
  sortBy: string;
  order: 'ASC' | 'DESC';
}

interface Specialty {
  id: string;
  name: string;
}

interface SearchFiltersProps {
  onSearch: (filters: SearchFilters) => void;
  specialties: Specialty[];
  initialFilters?: Partial<SearchFilters>;
}

export default function SearchFilters({
  onSearch,
  specialties,
  initialFilters = {},
}: SearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    search: initialFilters.search || '',
    specialtyId: initialFilters.specialtyId || '',
    minYearsExperience: initialFilters.minYearsExperience,
    maxPrice: initialFilters.maxPrice,
    isAvailable: initialFilters.isAvailable !== undefined ? initialFilters.isAvailable : true,
    sortBy: initialFilters.sortBy || 'firstName',
    order: initialFilters.order || 'ASC',
  });

  const handleSearchChange = (value: string) => {
    const newFilters = { ...filters, search: value };
    setFilters(newFilters);
    
    // Búsqueda en tiempo real después de 500ms
    setTimeout(() => {
      if (newFilters.search === filters.search) {
        onSearch(newFilters);
      }
    }, 500);
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleApplyFilters = () => {
    onSearch(filters);
  };

  const handleClearFilters = () => {
    const clearedFilters: SearchFilters = {
      search: '',
      specialtyId: '',
      minYearsExperience: undefined,
      maxPrice: undefined,
      isAvailable: true,
      sortBy: 'firstName',
      order: 'ASC',
    };
    setFilters(clearedFilters);
    onSearch(clearedFilters);
  };

  const hasActiveFilters =
    filters.specialtyId ||
    filters.minYearsExperience ||
    filters.maxPrice ||
    filters.isAvailable === false;

  return (
    <div className="bg-base-100 rounded-lg shadow-sm p-6 space-y-4">
      {/* Barra de búsqueda principal */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-base-content/40" />
          </div>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar por nombre del doctor..."
            className="input input-bordered w-full pl-10"
          />
          {filters.search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-error"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Botón de filtros */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn ${hasActiveFilters ? 'btn-primary' : 'btn-outline'} gap-2`}
        >
          <Filter className="h-5 w-5" />
          Filtros
          {hasActiveFilters && (
            <span className="badge badge-sm">{
              [
                filters.specialtyId,
                filters.minYearsExperience,
                filters.maxPrice,
                filters.isAvailable === false,
              ].filter(Boolean).length
            }</span>
          )}
          {showFilters ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* Panel de filtros expandible */}
      {showFilters && (
        <div className="border-t pt-4 space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Especialidad */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Especialidad</span>
              </label>
              <select
                value={filters.specialtyId}
                onChange={(e) => handleFilterChange('specialtyId', e.target.value)}
                className="select select-bordered w-full"
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
                <span className="label-text font-medium">Experiencia mínima</span>
              </label>
              <select
                value={filters.minYearsExperience || ''}
                onChange={(e) =>
                  handleFilterChange(
                    'minYearsExperience',
                    e.target.value ? Number(e.target.value) : undefined
                  )
                }
                className="select select-bordered w-full"
              >
                <option value="">Cualquier experiencia</option>
                <option value="1">1+ años</option>
                <option value="3">3+ años</option>
                <option value="5">5+ años</option>
                <option value="10">10+ años</option>
                <option value="15">15+ años</option>
              </select>
            </div>

            {/* Precio máximo */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">
                  Precio máximo
                  {filters.maxPrice && (
                    <span className="label-text-alt text-primary font-bold ml-2">
                      ${filters.maxPrice}
                    </span>
                  )}
                </span>
              </label>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={filters.maxPrice || 5000}
                onChange={(e) =>
                  handleFilterChange('maxPrice', Number(e.target.value))
                }
                className="range range-primary range-sm"
              />
              <div className="flex justify-between text-xs px-1 mt-1">
                <span>$0</span>
                <span>$2,500</span>
                <span>$5,000</span>
              </div>
            </div>

            {/* Disponibilidad */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Disponibilidad</span>
              </label>
              <select
                value={filters.isAvailable === undefined ? 'all' : filters.isAvailable.toString()}
                onChange={(e) => {
                  const value = e.target.value;
                  handleFilterChange(
                    'isAvailable',
                    value === 'all' ? undefined : value === 'true'
                  );
                }}
                className="select select-bordered w-full"
              >
                <option value="all">Todos</option>
                <option value="true">Solo disponibles</option>
                <option value="false">No disponibles</option>
              </select>
            </div>

            {/* Ordenar por */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Ordenar por</span>
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="select select-bordered w-full"
              >
                <option value="firstName">Nombre</option>
                <option value="yearsExperience">Experiencia</option>
                <option value="consultationPrice">Precio</option>
              </select>
            </div>

            {/* Orden */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Orden</span>
              </label>
              <select
                value={filters.order}
                onChange={(e) => handleFilterChange('order', e.target.value as 'ASC' | 'DESC')}
                className="select select-bordered w-full"
              >
                <option value="ASC">Ascendente</option>
                <option value="DESC">Descendente</option>
              </select>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex flex-wrap gap-3 justify-end pt-2">
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="btn btn-ghost btn-sm gap-2"
              >
                <X className="h-4 w-4" />
                Limpiar filtros
              </button>
            )}
            <button
              onClick={handleApplyFilters}
              className="btn btn-primary btn-sm gap-2"
            >
              <Filter className="h-4 w-4" />
              Aplicar filtros
            </button>
          </div>

          {/* Indicadores de filtros activos */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 pt-2 border-t">
              {filters.specialtyId && (
                <div className="badge badge-primary gap-2">
                  {specialties.find((s) => s.id === filters.specialtyId)?.name}
                  <button
                    onClick={() => handleFilterChange('specialtyId', '')}
                    className="hover:text-error"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {filters.minYearsExperience && (
                <div className="badge badge-primary gap-2">
                  {filters.minYearsExperience}+ años exp.
                  <button
                    onClick={() => handleFilterChange('minYearsExperience', undefined)}
                    className="hover:text-error"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {filters.maxPrice && (
                <div className="badge badge-primary gap-2">
                  Max ${filters.maxPrice}
                  <button
                    onClick={() => handleFilterChange('maxPrice', undefined)}
                    className="hover:text-error"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
              {filters.isAvailable === false && (
                <div className="badge badge-primary gap-2">
                  No disponibles
                  <button
                    onClick={() => handleFilterChange('isAvailable', true)}
                    className="hover:text-error"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}