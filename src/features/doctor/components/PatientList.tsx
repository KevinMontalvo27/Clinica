import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import PatientCard from './PatientCard';
import { EmptyState, Spinner } from '../../../components/common';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar?: string;
  lastVisit?: string;
  totalVisits?: number;
  allergies?: string[];
}

interface PatientListProps {
  patients: Patient[];
  isLoading?: boolean;
  onPatientSelect?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

export default function PatientList({
  patients = [],
  isLoading = false,
  onPatientSelect,
  onViewDetails,
  onEdit,
  onDelete,
  className = '',
}: PatientListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'visits' | 'recent'>('name');

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    const search = searchTerm.toLowerCase();
    return (
      fullName.includes(search) ||
      patient.email.toLowerCase().includes(search) ||
      patient.phone.includes(search)
    );
  });

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sortBy === 'name') {
      return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    }
    if (sortBy === 'visits') {
      return (b.totalVisits || 0) - (a.totalVisits || 0);
    }
    if (sortBy === 'recent' && a.lastVisit && b.lastVisit) {
      return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
    }
    return 0;
  });

  if (isLoading) {
    return (
      <div className={`flex justify-center py-12 ${className}`}>
        <Spinner size="lg" text="Cargando pacientes..." />
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Barra de búsqueda y filtros */}
      <div className="mb-6 space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
            <input
              type="text"
              placeholder="Buscar paciente por nombre, email o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-10"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="select select-bordered"
          >
            <option value="name">Ordenar por nombre</option>
            <option value="visits">Ordenar por visitas</option>
            <option value="recent">Más recientes</option>
          </select>
        </div>

        {searchTerm && (
          <p className="text-sm text-base-content/60">
            {sortedPatients.length} resultado{sortedPatients.length !== 1 ? 's' : ''} encontrado{sortedPatients.length !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Lista de pacientes */}
      {sortedPatients.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No hay pacientes"
          description={
            searchTerm
              ? 'No se encontraron pacientes con ese criterio de búsqueda'
              : 'Aún no tienes pacientes registrados'
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedPatients.map((patient) => (
            <PatientCard
              key={patient.id}
              {...patient}
              onSelect={onPatientSelect}
              onViewDetails={onViewDetails}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}