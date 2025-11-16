// src/features/doctor/components/AppointmentCard.tsx
import { Badge, Button, Card } from '../../../components/common';

export type AppointmentStatus = 
  | 'SCHEDULED' 
  | 'CONFIRMED' 
  | 'CANCELLED' 
  | 'COMPLETED' 
  | 'NO_SHOW' 
  | 'RESCHEDULED';

interface AppointmentCardProps {
    id: number;
    patientName: string;
    patientAvatar?: string;
    date: string;
    time: string;
    duration: number;
    status: AppointmentStatus;
    reason?: string;
    onConfirm?: (id: number) => void;
    onCancel?: (id: number) => void;
    onReschedule?: (id: number) => void;
    onViewDetails?: (id: number) => void;
    className?: string;
}

const statusConfig: Record<AppointmentStatus, { badge: string; color: string; text: string }> = {
    SCHEDULED: { badge: 'badge-info', color: 'bg-blue-50', text: 'Programada' },
    CONFIRMED: { badge: 'badge-success', color: 'bg-green-50', text: 'Confirmada' },
    COMPLETED: { badge: 'badge-success', color: 'bg-green-50', text: 'Completada' },
    CANCELLED: { badge: 'badge-error', color: 'bg-red-50', text: 'Cancelada' },
    NO_SHOW: { badge: 'badge-warning', color: 'bg-yellow-50', text: 'No presentada' },
    RESCHEDULED: { badge: 'badge-warning', color: 'bg-orange-50', text: 'Reagendada' },
};

export default function AppointmentCard({
    id,
    patientName,
    patientAvatar,
    date,
    time,
    duration,
    status,
    reason,
    onConfirm,
    onCancel,
    onReschedule,
    onViewDetails,
    className = '',
}: AppointmentCardProps) {
    const config = statusConfig[status] || statusConfig.SCHEDULED;
    const initials = patientName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    return (
        <Card
        className={`${config.color} hover:shadow-lg transition-all duration-200 ${className}`}
        bordered
        shadow="shadow-sm"
        >
        <div className="space-y-4">
            {/* Header con paciente y estado */}
            <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 flex-1">
                <div className="avatar placeholder">
                <div className="bg-gradient-to-br from-primary to-secondary rounded-full w-10 h-10 text-white">
                    <span className="text-sm font-bold">{initials}</span>
                </div>
                </div>
                <div className="flex-1">
                <h3 className="font-semibold text-base-content">{patientName}</h3>
                <p className="text-xs text-base-content/60">{date}</p>
                </div>
            </div>
            <Badge variant={
                status === 'COMPLETED' || status === 'CONFIRMED' 
                    ? 'success' 
                    : status === 'CANCELLED' || status === 'NO_SHOW'
                    ? 'error'
                    : status === 'RESCHEDULED'
                    ? 'warning'
                    : 'info'
            }>
                {config.text}
            </Badge>
            </div>

            {/* Detalles de la cita */}
            <div className="grid grid-cols-2 gap-2 bg-base-100 rounded-lg p-3">
            <div>
                <p className="text-xs text-base-content/60">Hora</p>
                <p className="font-semibold text-sm">{time}</p>
            </div>
            <div>
                <p className="text-xs text-base-content/60">Duración</p>
                <p className="font-semibold text-sm">{duration} min</p>
            </div>
            </div>

            {/* Motivo de consulta */}
            {reason && (
            <div className="bg-base-100 rounded-lg p-3">
                <p className="text-xs text-base-content/60 mb-1">Motivo</p>
                <p className="text-sm text-base-content line-clamp-2">{reason}</p>
            </div>
            )}

            {/* Acciones */}
            <div className="flex gap-2 flex-wrap">
            {(status === 'SCHEDULED' || status === 'CONFIRMED') && (
                <>
                {status === 'SCHEDULED' && (
                    <Button
                        size="sm"
                        variant="success"
                        onClick={() => onConfirm?.(id)}
                        className="flex-1 min-w-[80px]"
                    >
                        Confirmar
                    </Button>
                )}
                <Button
                    size="sm"
                    variant="warning"
                    onClick={() => onReschedule?.(id)}
                    className="flex-1 min-w-[80px]"
                >
                    Reprogramar
                </Button>
                <Button
                    size="sm"
                    variant="error"
                    onClick={() => onCancel?.(id)}
                    className="flex-1 min-w-[80px]"
                >
                    Cancelar
                </Button>
                </>
            )}
            {(status === 'COMPLETED' || status === 'CANCELLED' || status === 'NO_SHOW' || status === 'RESCHEDULED') && (
                <Button
                size="sm"
                variant="ghost"
                onClick={() => onViewDetails?.(id)}
                fullWidth
                >
                Ver Detalles
                </Button>
            )}
            </div>
        </div>
        </Card>
    );
}