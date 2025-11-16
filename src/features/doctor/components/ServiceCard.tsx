import { Badge, Button, Card } from '../../../components/common';

interface ServiceCardProps {
    id: string;
    name: string;
    description?: string;
    price: number;
    duration: number;
    isActive: boolean;
    totalAppointments?: number;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    onToggleActive?: (id: string, active: boolean) => void;
    className?: string;
}

export default function ServiceCard({
    id,
    name,
    description,
    price,
    duration,
    isActive,
    totalAppointments = 0,
    onEdit,
    onDelete,
    onToggleActive,
    className = '',
}: ServiceCardProps) {
    return (
        <Card
        className={`hover:shadow-lg transition-all duration-200 ${!isActive ? 'opacity-60' : ''} ${className}`}
        bordered
        shadow="shadow-sm"
        >
        <div className="space-y-4">
            {/* Header con nombre y estado */}
            <div className="flex items-start justify-between">
            <div className="flex-1">
                <h3 className="font-semibold text-base-content text-lg">{name}</h3>
                {description && (
                <p className="text-sm text-base-content/60 line-clamp-2 mt-1">{description}</p>
                )}
            </div>
            <Badge variant={isActive ? 'success' : 'error'}>
                {isActive ? 'Activo' : 'Inactivo'}
            </Badge>
            </div>

            {/* Detalles del servicio */}
            <div className="grid grid-cols-3 gap-3">
            <div className="bg-primary/10 rounded-lg p-3 text-center">
                <p className="text-xs text-base-content/60 mb-1">Precio</p>
                <p className="font-bold text-lg text-primary">${price.toFixed(2)}</p>
            </div>
            <div className="bg-secondary/10 rounded-lg p-3 text-center">
                <p className="text-xs text-base-content/60 mb-1">Duración</p>
                <p className="font-bold text-lg text-secondary">{duration} min</p>
            </div>
            <div className="bg-accent/10 rounded-lg p-3 text-center">
                <p className="text-xs text-base-content/60 mb-1">Citas</p>
                <p className="font-bold text-lg text-accent">{totalAppointments}</p>
            </div>
            </div>

            {/* Acciones */}
            <div className="flex gap-2 flex-wrap">
            <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit?.(id)}
                className="flex-1 min-w-[70px]"
            >
                Editar
            </Button>
            {onToggleActive && (
                <Button
                size="sm"
                variant={isActive ? 'warning' : 'success'}
                onClick={() => onToggleActive(id, !isActive)}
                className="flex-1 min-w-[70px]"
                >
                {isActive ? 'Desactivar' : 'Activar'}
                </Button>
            )}
            {onDelete && (
                <Button
                size="sm"
                variant="error"
                onClick={() => onDelete?.(id)}
                className="flex-1 min-w-[70px]"
                >
                Eliminar
                </Button>
            )}
            </div>
        </div>
        </Card>
    );
}