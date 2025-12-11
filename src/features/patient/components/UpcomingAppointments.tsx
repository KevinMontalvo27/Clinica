import { Card } from '../../../components/common';
import { Calendar, Clock, User, Stethoscope, ArrowRight } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface Appointment {
  id: string;
  appointmentDate: Date | string;
  appointmentTime: string;
  doctor: {
    user: {
      firstName: string;
      lastName: string;
    };
    specialty: {
      name: string;
    };
  };
  service?: {
    name: string;
  };
}

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  onViewAll?: () => void;
  onViewDetails?: (id: string) => void;
  className?: string;
}

export default function UpcomingAppointments({
  appointments = [],
  onViewAll,
  onViewDetails,
  className = '',
}: UpcomingAppointmentsProps) {
  const displayAppointments = appointments.slice(0, 3);

  return (
    <Card
      title="Próximas Citas"
      className={className}
    >
      {displayAppointments.length === 0 ? (
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 mx-auto text-base-content/30 mb-3" />
          <p className="text-base-content/60">No tienes citas próximas</p>
          <p className="text-sm text-base-content/40 mt-1">
            Agenda una cita con tu doctor de preferencia
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {displayAppointments.map((appointment) => {
            const doctorName = `Dr. ${appointment.doctor.user.firstName} ${appointment.doctor.user.lastName}`;
            const date = typeof appointment.appointmentDate === 'string' 
              ? new Date(appointment.appointmentDate) 
              : appointment.appointmentDate;
            const timeFormatted = appointment.appointmentTime.substring(0, 5);
            const dateFormatted = format(date, "d MMM yyyy", { locale: es });
            const timeUntil = formatDistanceToNow(date, { locale: es, addSuffix: true });

            return (
              <div
                key={appointment.id}
                onClick={() => onViewDetails?.(appointment.id)}
                className="bg-base-200 rounded-lg p-4 hover:bg-base-300 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-primary flex-shrink-0" />
                      <p className="font-semibold truncate">{doctorName}</p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-base-content/70">
                      <Stethoscope className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{appointment.doctor.specialty.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-info" />
                    <span>{dateFormatted}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-warning" />
                    <span>{timeFormatted}</span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-base-300">
                  <p className="text-xs text-base-content/60">{timeUntil}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}