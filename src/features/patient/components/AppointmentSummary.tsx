import { Card, Badge } from '../../../components/common';
import { Calendar, Clock, User, Stethoscope, DollarSign, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface AppointmentSummaryProps {
  selectedDate?: Date;
  selectedTime?: string;
  duration: number;
  doctor?: {
    user: {
      firstName: string;
      lastName: string;
    };
    specialty: {
      name: string;
    };
    profileImageUrl?: string;
  };
  service?: {
    name: string;
    price: number;
    duration: number;
  };
  reasonForVisit?: string;
  className?: string;
}

export default function AppointmentSummary({
  selectedDate,
  selectedTime,
  duration,
  doctor,
  service,
  reasonForVisit,
  className = '',
}: AppointmentSummaryProps) {
  if (!selectedDate || !selectedTime || !doctor) {
    return (
      <Card className={className}>
        <div className="text-center py-8">
          <p className="text-base-content/60">
            Completa la información para ver el resumen de tu cita
          </p>
        </div>
      </Card>
    );
  }

  const doctorName = `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`;
  const formattedDate = format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es });
  const timeFormatted = selectedTime.substring(0, 5);

  return (
    <Card title="Resumen de la Cita" className={className}>
      <div className="space-y-4">
        {/* Doctor */}
        <div className="flex items-start gap-3 pb-4 border-b border-base-300">
          {doctor.profileImageUrl && (
            <img
              src={doctor.profileImageUrl}
              alt={doctorName}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
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
        </div>

        {/* Fecha y hora */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-info" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-base-content/60">Fecha</p>
              <p className="font-medium capitalize truncate">{formattedDate}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5 text-warning" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-base-content/60">Hora</p>
              <p className="font-medium">
                {timeFormatted} ({duration} minutos)
              </p>
            </div>
          </div>
        </div>

        {/* Servicio */}
        {service && (
          <div className="flex items-center gap-3 pt-4 border-t border-base-300">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-success" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-base-content/60">Servicio</p>
              <p className="font-medium truncate">{service.name}</p>
            </div>
          </div>
        )}

        {/* Motivo */}
        {reasonForVisit && (
          <div className="bg-base-200 rounded-lg p-3">
            <p className="text-xs text-base-content/60 mb-1">Motivo de la consulta:</p>
            <p className="text-sm">{reasonForVisit}</p>
          </div>
        )}

        {/* Precio */}
        {service && (
          <div className="flex items-center justify-between pt-4 border-t border-base-300">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-success" />
              <span className="font-semibold">Total a pagar:</span>
            </div>
            <span className="text-2xl font-bold text-success">${service.price}</span>
          </div>
        )}

        {/* Aviso */}
        <div className="alert alert-info">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span className="text-sm">
            Por favor llega 10 minutos antes de tu cita programada.
          </span>
        </div>
      </div>
    </Card>
  );
}