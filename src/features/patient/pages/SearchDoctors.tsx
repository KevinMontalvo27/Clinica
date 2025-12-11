import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../../../components/common';
import { DoctorList } from '../components';
import { doctorsService, type Doctor } from '../../../api/services/doctors.service';
import { specialtiesService, type Specialty } from '../../../api/services/specialties.service';
import SearchFilters, { type SearchFilters as SearchFiltersType } from '../components/SearchFilters';

export default function SearchDoctors() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentFilters, setCurrentFilters] = useState<SearchFiltersType>({
    search: '',
    specialtyId: '',
    minYearsExperience: undefined,
    maxPrice: undefined,
    isAvailable: true,
    sortBy: 'firstName',
    order: 'ASC',
  });

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Cargar especialidades y doctores disponibles en paralelo
      const [specialtiesData, doctorsData] = await Promise.all([
        specialtiesService.getAll(),
        doctorsService.getAvailable(),
      ]);

      setSpecialties(specialtiesData);
      setDoctors(doctorsData);
    } catch (err: any) {
      console.error('Error loading initial data:', err);
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (filters: SearchFiltersType) => {
    try {
      setIsLoading(true);
      setError(null);
      setCurrentFilters(filters);

      // Si hay búsqueda por texto, usar el endpoint de búsqueda
      if (filters.search) {
        const results = await doctorsService.search(filters.search);
        
        // Aplicar filtros adicionales en el cliente
        let filteredResults = results;

        if (filters.specialtyId) {
          filteredResults = filteredResults.filter(
            (d: Doctor) => d.specialty.id === filters.specialtyId
          );
        }
        if (filters.minYearsExperience) {
          filteredResults = filteredResults.filter(
            (d: Doctor) => (d.yearsExperience || 0) >= filters.minYearsExperience!
          );
        }
        if (filters.maxPrice) {
          filteredResults = filteredResults.filter((d: Doctor) => {
            const price = d.consultationPrice || d.specialty.basePrice;
            return price <= filters.maxPrice!;
          });
        }
        if (filters.isAvailable !== undefined) {
          filteredResults = filteredResults.filter(
            (d: Doctor) => d.isAvailable === filters.isAvailable
          );
        }

        // Ordenar resultados
        filteredResults = sortDoctors(filteredResults, filters.sortBy, filters.order);

        setDoctors(filteredResults);
      } else if (filters.specialtyId) {
        // Si solo hay filtro por especialidad, usar endpoint específico
        const results = await doctorsService.getBySpecialty(
          filters.specialtyId,
          filters.isAvailable
        );

        // Aplicar filtros adicionales
        let filteredResults = results;

        if (filters.minYearsExperience) {
          filteredResults = filteredResults.filter(
            (d: Doctor) => (d.yearsExperience || 0) >= filters.minYearsExperience!
          );
        }
        if (filters.maxPrice) {
          filteredResults = filteredResults.filter((d: Doctor) => {
            const price = d.consultationPrice || d.specialty.basePrice;
            return price <= filters.maxPrice!;
          });
        }

        filteredResults = sortDoctors(filteredResults, filters.sortBy, filters.order);

        setDoctors(filteredResults);
      } else {
        // Sin filtros específicos, obtener todos disponibles o todos
        const results = filters.isAvailable
          ? await doctorsService.getAvailable()
          : await doctorsService.getAll({ page: 1, limit: 100 });

        const doctorsList = Array.isArray(results) ? results : results.data;

        // Aplicar filtros adicionales
        let filteredResults = doctorsList;

        if (filters.minYearsExperience) {
          filteredResults = filteredResults.filter(
            (d: Doctor) => (d.yearsExperience || 0) >= filters.minYearsExperience!
          );
        }
        if (filters.maxPrice) {
          filteredResults = filteredResults.filter((d: Doctor) => {
            const price = d.consultationPrice || d.specialty.basePrice;
            return price <= filters.maxPrice!;
          });
        }

        filteredResults = sortDoctors(filteredResults, filters.sortBy, filters.order);

        setDoctors(filteredResults);
      }
    } catch (err: any) {
      console.error('Error searching doctors:', err);
      setError(err.message || 'Error al buscar doctores');
      setDoctors([]);
    } finally {
      setIsLoading(false);
    }
  };

  const sortDoctors = (
    doctorsList: Doctor[],
    sortBy: string,
    order: 'ASC' | 'DESC'
  ): Doctor[] => {
    const sorted = [...doctorsList].sort((a: Doctor, b: Doctor) => {
      let comparison = 0;

      switch (sortBy) {
        case 'firstName':
          comparison = a.user.firstName.localeCompare(b.user.firstName);
          break;
        case 'yearsExperience':
          comparison = (a.yearsExperience || 0) - (b.yearsExperience || 0);
          break;
        case 'consultationPrice':
          const priceA = a.consultationPrice || a.specialty.basePrice;
          const priceB = b.consultationPrice || b.specialty.basePrice;
          comparison = priceA - priceB;
          break;
        default:
          comparison = 0;
      }

      return order === 'ASC' ? comparison : -comparison;
    });

    return sorted;
  };

  const handleViewProfile = (doctorId: string) => {
    navigate(`/patient/doctor/${doctorId}`);
  };

  const handleBookAppointment = (doctorId: string) => {
    navigate(`/patient/book-appointment?doctorId=${doctorId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-base-100 rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-base-content mb-2">
              Buscar Doctores
            </h1>
            <p className="text-base-content/60">
              Encuentra el especialista que necesitas
            </p>
          </div>
          {doctors.length > 0 && (
            <div className="badge badge-primary badge-lg">
              {doctors.length} {doctors.length === 1 ? 'doctor' : 'doctores'}
            </div>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert type="error" title="Error" closeable onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Búsqueda y filtros */}
      <SearchFilters
        onSearch={handleSearch}
        specialties={specialties}
        initialFilters={currentFilters}
      />

      {/* Resultados */}
      <div>
        {!isLoading && doctors.length > 0 && (
          <div className="mb-4">
            <p className="text-sm text-base-content/60">
              Mostrando {doctors.length} resultado{doctors.length !== 1 ? 's' : ''}
              {currentFilters.specialtyId && (
                <span>
                  {' '}
                  en{' '}
                  <span className="font-semibold">
                    {specialties.find((s: Specialty) => s.id === currentFilters.specialtyId)?.name}
                  </span>
                </span>
              )}
            </p>
          </div>
        )}

        <DoctorList
          doctors={doctors}
          isLoading={isLoading}
          onViewProfile={handleViewProfile}
          onBookAppointment={handleBookAppointment}
        />
      </div>

      {/* Estado vacío con ilustración */}
      {!isLoading && doctors.length === 0 && !error && (
        <div className="bg-base-100 rounded-lg shadow-sm p-8 text-center">
          <div className="max-w-md mx-auto">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto text-base-content/30 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-bold mb-2">No se encontraron doctores</h3>
            <p className="text-base-content/60 mb-4">
              Intenta ajustar los filtros de búsqueda para encontrar más resultados
            </p>
            <button
              onClick={() =>
                handleSearch({
                  search: '',
                  specialtyId: '',
                  minYearsExperience: undefined,
                  maxPrice: undefined,
                  isAvailable: true,
                  sortBy: 'firstName',
                  order: 'ASC',
                })
              }
              className="btn btn-outline btn-sm"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      )}

      {/* Tips de búsqueda */}
      {!isLoading && doctors.length > 0 && (
        <div className="bg-info/5 border-2 border-info/20 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-info"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold mb-2">Consejos para elegir un doctor</h3>
              <ul className="text-sm text-base-content/70 space-y-1">
                <li>• Revisa la especialidad y años de experiencia</li>
                <li>• Consulta los servicios que ofrece cada doctor</li>
                <li>• Verifica la disponibilidad antes de agendar</li>
                <li>• Lee el perfil completo para más información</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}