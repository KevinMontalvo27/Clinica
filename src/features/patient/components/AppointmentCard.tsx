import { Badge, Button } from '../../../components/common';
import { Calendar, Clock, User, Stethoscope, FileText, XCircle, RotateCcw } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type AppointmentStatus =
  | 'SCHEDULED'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED'
  | 'NO_SHOW'
  | 'RESCHEDULED';

interface AppointmentCardProps {
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
  onViewDetails?: (id: string) => void;
  onCancel?: (id: string) => void;
  onReschedule?: (id: string) => void;
  className?: string;
}

const statusConfig: Record<AppointmentStatus, { variant: 'info' | 'success' | 'error' | 'warning'; text: string }> = {
  SCHEDULED: { variant: 'info', text: 'Programada' },
  CONFIRMED: { variant: 'success', text: 'Confirmada' },
  COMPLETED: { variant: 'success', text: 'Completada' },
  CANCELLED: { variant: 'error', text: 'Cancelada' },
  NO_SHOW: { variant: 'warning', text: 'No presentada' },
  RESCHEDULED: { variant: 'warning', text: 'Reagendada' },
};

export default function AppointmentCard({
  id,
  appointmentDate,
  appointmentTime,
  duration,
  status,
  reasonForVisit,
  notes,
  price,
  doctor,
  service,
  onViewDetails,
  onCancel,
  onReschedule,
  className = '',
}: AppointmentCardProps) {
  const config = statusConfig[status];
  const doctorName = `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`;
  const date = typeof appointmentDate === 'string' ? new Date(appointmentDate) : appointmentDate;
  const formattedDate = format(date, "d 'de' MMMM, yyyy", { locale: es });
  
  // Convertir appointmentTime (HH:MM:SS o HH:MM) a formato legible
  const timeFormatted = appointmentTime.substring(0, 5); // HH:MM

  const canCancel = status === 'SCHEDULED' || status === 'CONFIRMED';
  const canReschedule = status === 'SCHEDULED' || status === 'CONFIRMED';

  return (
    <div
      className={`card bg-base-100 border-2 border-base-300 hover:shadow-lg transition-all ${className}`}
    >
      <div className="card-body p-4 space-y-4">
        {/* Header con doctor y estado */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <User className="w-4 h-4 text-primary flex-shrink-0" />
              <h3 className="font-bold text-base-content truncate">{doctorName}</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/70">
              <Stethoscope className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{doctor.specialty.name}</span>
            </div>
          </div>
          <Badge variant={config.variant} size="sm">
            {config.text}
          </Badge>
        </div>

        {/* Información de la cita */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-info flex-shrink-0" />
            <span className="font-medium">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="w-4 h-4 text-warning flex-shrink-0" />
            <span>{timeFormatted} ({duration} min)</span>
          </div>
          {service && (
            <div className="flex items-center gap-2 text-sm">
              <FileText className="w-4 h-4 text-success flex-shrink-0" />
              <span className="truncate">{service.name}</span>
            </div>
          )}
          {price && (
            <div className="text-sm">
              <span className="font-semibold text-success">${price}</span>
            </div>
          )}
        </div>

        {/* Motivo de la visita */}
        {reasonForVisit && (
          <div className="bg-base-200 rounded-lg p-3">
            <p className="text-xs text-base-content/60 mb-1">Motivo de la consulta:</p>
            <p className="text-sm line-clamp-2">{reasonForVisit}</p>
          </div>
        )}

        {/* Acciones */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onViewDetails?.(id)}
            className="flex-1"
          >
            Ver Detalles
          </Button>
          {canReschedule && onReschedule && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onReschedule(id)}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
          )}
          {canCancel && onCancel && (
            <Button
              size="sm"
              variant="error"
              onClick={() => onCancel(id)}
            >
              <XCircle className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}