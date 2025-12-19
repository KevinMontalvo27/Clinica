import { Badge, Button, Card } from '../../../components/common';

export type AppointmentStatus = 
  | 'SCHEDULED' 
  | 'CONFIRMED' 
  | 'CANCELLED' 
  | 'COMPLETED' 
  | 'NO_SHOW' 
  | 'RESCHEDULED';

interface AppointmentCardProps {
    id: string;
    patientName: string;
    patientAvatar?: string;
    date: string;
    time: string;
    duration: number;
    status: AppointmentStatus;
    reason?: string;
    onConfirm?: (id: string) => void;
    onCancel?: (id: string) => void;
    onReschedule?: (id: string) => void;
    onViewDetails?: (id: string) => void;
    onStartConsultation?: (id: string) => void;
    className?: string;
}

const statusConfig: Record<AppointmentStatus, { badge: string; color: string; text: string }> = {
    SCHEDULED: { badge: 'badge-info', color: 'bg-info/5 border-info/20', text: 'Programada' },
    CONFIRMED: { badge: 'badge-success', color: 'bg-success/5 border-success/20', text: 'Confirmada' },
    COMPLETED: { badge: 'badge-success', color: 'bg-success/5 border-success/20', text: 'Completada' },
    CANCELLED: { badge: 'badge-error', color: 'bg-error/5 border-error/20', text: 'Cancelada' },
    NO_SHOW: { badge: 'badge-warning', color: 'bg-warning/5 border-warning/20', text: 'No presentada' },
    RESCHEDULED: { badge: 'badge-warning', color: 'bg-warning/5 border-warning/20', text: 'Reagendada' },
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
    onStartConsultation,
    className = '',
}: AppointmentCardProps) {
    const config = statusConfig[status] || statusConfig.SCHEDULED;
    const initials = patientName
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase();

    return (
        <div
            className={`card bg-base-100 border-2 ${config.color} hover:shadow-lg transition-all duration-200 ${className}`}
        >
            <div className="card-body p-4 space-y-4">
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
                <div className="grid grid-cols-2 gap-2 bg-base-200 rounded-lg p-3">
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
                    <div className="bg-base-200 rounded-lg p-3">
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
                            {status === 'CONFIRMED' && onStartConsultation && (
                                <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => onStartConsultation(id)}
                                    className="flex-1 min-w-[100px]"
                                >
                                    Iniciar Consulta
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
        </div>
    );
}