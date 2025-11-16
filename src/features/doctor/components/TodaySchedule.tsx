import { useState } from 'react';
import { Calendar, Clock, User, MapPin } from 'lucide-react';
import { Card, Badge, Button } from '../../../components/common';

interface ScheduleItem {
  id: string;
  time: string;
  patientName: string;
  service: string;
  duration: number;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  location?: string;
}

interface TodayScheduleProps {
  schedules: ScheduleItem[];
  onStartConsultation?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  className?: string;
}

export default function TodaySchedule({
  schedules = [],
  onStartConsultation,
  onViewDetails,
  className = '',
}: TodayScheduleProps) {
  const [currentTime] = useState(new Date());

  const statusConfig = {
    PENDING: { color: 'badge-info', label: 'Pendiente' },
    IN_PROGRESS: { color: 'badge-warning', label: 'En Curso' },
    COMPLETED: { color: 'badge-success', label: 'Completada' },
    CANCELLED: { color: 'badge-error', label: 'Cancelada' },
  };

  const getStatusBadge = (status: ScheduleItem['status']) => {
    const config = statusConfig[status];
    return (
      <Badge variant={config.color.replace('badge-', '') as any} size="sm">
        {config.label}
      </Badge>
    );
  };

  const isUpcoming = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const scheduleTime = new Date(currentTime);
    scheduleTime.setHours(hours, minutes, 0);
    return scheduleTime > currentTime;
  };

  if (schedules.length === 0) {
    return (
      <Card title="Agenda de Hoy" className={className}>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 mx-auto mb-3 text-base-content/30" />
          <p className="text-base-content/60">No hay citas programadas para hoy</p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Agenda de Hoy" className={className}>
      <div className="space-y-3">
        {schedules.map((schedule) => (
          <div
            key={schedule.id}
            className={`p-4 rounded-lg border transition-all hover:shadow-md ${
              isUpcoming(schedule.time)
                ? 'bg-primary/5 border-primary/20'
                : 'bg-base-200 border-base-300'
            }`}
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-lg">{schedule.time}</p>
                  <p className="text-sm text-base-content/60">{schedule.duration} min</p>
                </div>
              </div>
              {getStatusBadge(schedule.status)}
            </div>

            {/* Details */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-base-content/60" />
                <span className="font-medium">{schedule.patientName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <span className="font-medium">Servicio:</span>
                <span>{schedule.service}</span>
              </div>
              {schedule.location && (
                <div className="flex items-center gap-2 text-sm text-base-content/70">
                  <MapPin className="w-4 h-4" />
                  <span>{schedule.location}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            {schedule.status === 'PENDING' && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => onStartConsultation?.(schedule.id)}
                  className="flex-1"
                >
                  Iniciar Consulta
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onViewDetails?.(schedule.id)}
                >
                  Detalles
                </Button>
              </div>
            )}

            {schedule.status === 'COMPLETED' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewDetails?.(schedule.id)}
                fullWidth
              >
                Ver Registro
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}