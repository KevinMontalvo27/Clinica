import DoctorCard from './DoctorCard';
import { EmptyState, Spinner } from '../../../components/common';

interface Doctor {
  id: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  specialty: {
    id: string;
    name: string;
    basePrice: number;
  };
  licenseNumber: string;
  yearsExperience?: number;
  consultationPrice?: number;
  biography?: string;
  profileImageUrl?: string;
  isAvailable: boolean;
}

interface DoctorListProps {
  doctors: Doctor[];
  isLoading?: boolean;
  onViewProfile?: (id: string) => void;
  onBookAppointment?: (id: string) => void;
  className?: string;
}

export default function DoctorList({
  doctors = [],
  isLoading = false,
  onViewProfile,
  onBookAppointment,
  className = '',
}: DoctorListProps) {
  if (isLoading) {
    return (
      <div className={`flex justify-center py-12 ${className}`}>
        <Spinner size="lg" text="Cargando doctores..." />
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <EmptyState
        icon="👨‍⚕️"
        title="No se encontraron doctores"
        description="No hay doctores disponibles con los filtros seleccionados"
        className={className}
      />
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {doctors.map((doctor) => (
        <DoctorCard
          key={doctor.id}
          {...doctor}
          onViewProfile={onViewProfile}
          onBookAppointment={onBookAppointment}
        />
      ))}
    </div>
  );
}