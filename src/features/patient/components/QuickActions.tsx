import { Card } from '../../../components/common';
import { Calendar, Search, FileText, User } from 'lucide-react';

interface QuickActionsProps {
  onBookAppointment?: () => void;
  onSearchDoctors?: () => void;
  onViewMedicalHistory?: () => void;
  onViewProfile?: () => void;
  className?: string;
}

export default function QuickActions({
  onBookAppointment,
  onSearchDoctors,
  onViewMedicalHistory,
  onViewProfile,
  className = '',
}: QuickActionsProps) {
  const actions = [
    {
      icon: Calendar,
      label: 'Agendar Cita',
      description: 'Programa una nueva consulta',
      color: 'primary',
      onClick: onBookAppointment,
    },
    {
      icon: Search,
      label: 'Buscar Doctores',
      description: 'Encuentra especialistas',
      color: 'info',
      onClick: onSearchDoctors,
    },
    {
      icon: FileText,
      label: 'Mi Historial',
      description: 'Ver expediente médico',
      color: 'success',
      onClick: onViewMedicalHistory,
    },
    {
      icon: User,
      label: 'Mi Perfil',
      description: 'Editar información personal',
      color: 'warning',
      onClick: onViewProfile,
    },
  ];

  return (
    <Card title="Acciones Rápidas" className={className}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className="bg-base-200 hover:bg-base-300 rounded-lg p-4 text-left transition-colors group"
          >
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-lg bg-${action.color}/10 flex items-center justify-center flex-shrink-0 group-hover:bg-${action.color}/20 transition-colors`}>
                <action.icon className={`w-6 h-6 text-${action.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold mb-1">{action.label}</p>
                <p className="text-sm text-base-content/60">{action.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  );
}