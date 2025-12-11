import { useState } from 'react';
import AppointmentCard from './AppointmentCard';
import { EmptyState, Spinner } from '../../../components/common';

type AppointmentStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'RESCHEDULED';

interface Appointment {
  id: string;
  appointmentDate: Date | string;
  appointmentTime: string;
  duration: number;
  status: AppointmentStatus;
  reasonForVisit?: string;
  notes?: string;
  price?: number;
  doctor: {
    id: string;
    user: {
      firstName: string;
      lastName: string;
    };
    specialty: {
      name: string;
    };
  };
  service?: {
    id: string;
    name: string;
  };
}

interface AppointmentListProps {
  appointments: Appointment[];
  isLoading?: boolean;
  onViewDetails?: (id: string) => void;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
  filterStatus?: AppointmentStatus | 'ALL';
  className?: string;
}

export default function AppointmentList({
  appointments = [],
  isLoading = false,
  onViewDetails,
  onCancel,
  onReschedule,
  filterStatus = 'ALL',
  className = '',
}: AppointmentListProps) {
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'ALL'>(filterStatus);

  const filteredAppointments = statusFilter === 'ALL'
    ? appointments
    : appointments.filter(apt => apt.status === statusFilter);

  if (isLoading) {
    return (
      <div className={`flex justify-center py-12 ${className}`}>
        <Spinner size="lg" text="Cargando citas..." />
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Filtro de estado */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter('ALL')}
          className={`btn btn-sm ${statusFilter === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
        >
          Todas
        </button>
        <button
          onClick={() => setStatusFilter('SCHEDULED')}
          className={`btn btn-sm ${statusFilter === 'SCHEDULED' ? 'btn-info' : 'btn-outline'}`}
        >
          Programadas
        </button>
        <button
          onClick={() => setStatusFilter('CONFIRMED')}
          className={`btn btn-sm ${statusFilter === 'CONFIRMED' ? 'btn-success' : 'btn-outline'}`}
        >
          Confirmadas
        </button>
        <button
          onClick={() => setStatusFilter('COMPLETED')}
          className={`btn btn-sm ${statusFilter === 'COMPLETED' ? 'btn-success' : 'btn-outline'}`}
        >
          Completadas
        </button>
        <button
          onClick={() => setStatusFilter('CANCELLED')}
          className={`btn btn-sm ${statusFilter === 'CANCELLED' ? 'btn-error' : 'btn-outline'}`}
        >
          Canceladas
        </button>
      </div>

      {/* Lista de citas */}
      {filteredAppointments.length === 0 ? (
        <EmptyState
          icon="📅"
          title="No se encontraron citas"
          description={
            statusFilter === 'ALL'
              ? 'No tienes citas registradas'
              : `No tienes citas con el estado: ${statusFilter}`
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              {...appointment}
              onViewDetails={onViewDetails}
              onCancel={onCancel}
              onReschedule={onReschedule}
            />
          ))}
        </div>
      )}
    </div>
  );
}