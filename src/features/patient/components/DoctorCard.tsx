import { Badge, Button, Card, Avatar } from '../../../components/common';
import { Star, Clock, DollarSign, Stethoscope } from 'lucide-react';

interface DoctorCardProps {
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
  onViewProfile?: (id: string) => void;
  onBookAppointment?: (id: string) => void;
  className?: string;
}

export default function DoctorCard({
  id,
  user,
  specialty,
  yearsExperience = 0,
  consultationPrice,
  profileImageUrl,
  isAvailable,
  onViewProfile,
  onBookAppointment,
  className = '',
}: DoctorCardProps) {
  const fullName = `Dr. ${user.firstName} ${user.lastName}`;
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const price = consultationPrice || specialty.basePrice;

  return (
    <Card
      className={`hover:shadow-lg transition-all duration-200 ${className}`}
      bordered
      shadow="shadow-sm"
    >
      <div className="space-y-4">
        {/* Header con doctor y especialidad */}
        <div className="flex items-start gap-3">
          <Avatar
            src={profileImageUrl}
            alt={fullName}
            size="lg"
            placeholder={initials}
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-base-content truncate">{fullName}</h3>
            <p className="text-sm text-base-content/70 flex items-center gap-1">
              <Stethoscope className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{specialty.name}</span>
            </p>
          </div>
          <Badge variant={isAvailable ? 'success' : 'error'} size="sm">
            {isAvailable ? 'Disponible' : 'No disponible'}
          </Badge>
        </div>

        {/* Información adicional */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-primary/10 rounded-lg p-3">
            <p className="text-xs text-base-content/60 mb-1">Experiencia</p>
            <p className="font-bold text-primary">{yearsExperience} años</p>
          </div>
          <div className="bg-success/10 rounded-lg p-3">
            <p className="text-xs text-base-content/60 mb-1">Consulta</p>
            <p className="font-bold text-success">${price}</p>
          </div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewProfile?.(id)}
            className="flex-1"
          >
            Ver Perfil
          </Button>
          <Button
            size="sm"
            variant="primary"
            onClick={() => onBookAppointment?.(id)}
            disabled={!isAvailable}
            className="flex-1"
          >
            Agendar Cita
          </Button>
        </div>
      </div>
    </Card>
  );
}