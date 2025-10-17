import { Badge, Button, Card } from '../../../components/common';

interface PatientCardProps {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    avatar?: string;
    lastVisit?: string;
    totalVisits?: number;
    allergies?: string[];
    onSelect?: (id: number) => void;
    onViewDetails?: (id: number) => void;
    onEdit?: (id: number) => void;
    onDelete?: (id: number) => void;
    className?: string;
}

export default function PatientCard({
    id,
    firstName,
    lastName,
    email,
    phone,
    avatar,
    lastVisit,
    totalVisits = 0,
    allergies = [],
    onSelect,
    onViewDetails,
    onEdit,
    onDelete,
    className = '',
}: PatientCardProps) {
    const fullName = `${firstName} ${lastName}`;
    const initials = `${firstName[0]}${lastName[0]}`.toUpperCase();

    return (
        <div
        className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${className}`}
        onClick={() => onSelect?.(id)}
        >
        <Card
            bordered
            shadow="shadow-sm"
        >
            <div className="space-y-4">
            {/* Header con paciente */}
            <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                <div className="bg-gradient-to-br from-primary to-secondary rounded-full w-12 h-12 text-white">
                    <span className="text-sm font-bold">{initials}</span>
                </div>
                </div>
                <div className="flex-1">
                <h3 className="font-semibold text-base-content">{fullName}</h3>
                <p className="text-sm text-base-content/60">{email}</p>
                </div>
            </div>

            {/* Información de contacto */}
            <div className="bg-base-200 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2">
                <span className="text-lg">📞</span>
                <p className="text-sm text-base-content">{phone}</p>
                </div>
                {lastVisit && (
                <div className="flex items-center gap-2">
                    <span className="text-lg">📅</span>
                    <p className="text-sm text-base-content">Última visita: {lastVisit}</p>
                </div>
                )}
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-2 gap-2">
                <div className="bg-primary/10 rounded-lg p-2 text-center">
                <p className="text-xs text-base-content/60">Total de visitas</p>
                <p className="font-bold text-lg text-primary">{totalVisits}</p>
                </div>
                <div className="bg-accent/10 rounded-lg p-2 text-center">
                <p className="text-xs text-base-content/60">Estado</p>
                <Badge variant="success" className="justify-center">
                    Activo
                </Badge>
                </div>
            </div>

            {/* Alergias */}
            {allergies.length > 0 && (
                <div className="bg-warning/10 rounded-lg p-3">
                <p className="text-xs font-semibold text-warning mb-2">⚠️ Alergias</p>
                <div className="flex flex-wrap gap-1">
                    {allergies.map((allergy, index) => (
                    <Badge key={index} variant="warning" size="sm">
                        {allergy}
                    </Badge>
                    ))}
                </div>
                </div>
            )}

            {/* Acciones */}
            <div className="flex gap-2 flex-wrap">
                <Button
                size="sm"
                variant="primary"
                onClick={(e) => {
                    e.stopPropagation();
                    onViewDetails?.(id);
                }}
                className="flex-1 min-w-[70px]"
                >
                Ver
                </Button>
                <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(id);
                }}
                className="flex-1 min-w-[70px]"
                >
                Editar
                </Button>
                {onDelete && (
                <Button
                    size="sm"
                    variant="error"
                    onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(id);
                    }}
                    className="flex-1 min-w-[70px]"
                >
                    Eliminar
                </Button>
                )}
            </div>
            </div>
        </Card>
        </div>
    );
}