import { Card, Badge } from '../../../components/common';
import { FileText, Calendar, User, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface MedicalHistoryCardProps {
  id: string;
  medicalHistory?: string;
  familyHistory?: string;
  allergies?: string;
  chronicDiseases?: string;
  currentMedications?: string;
  notes?: string;
  createdBy: {
    user: {
      firstName: string;
      lastName: string;
    };
    specialty: {
      name: string;
    };
  };
  createdAt: Date | string;
  updatedAt: Date | string;
  onEdit?: (id: string) => void;
  className?: string;
}

export default function MedicalHistoryCard({
  id,
  medicalHistory,
  familyHistory,
  allergies,
  chronicDiseases,
  currentMedications,
  notes,
  createdBy,
  createdAt,
  updatedAt,
  onEdit,
  className = '',
}: MedicalHistoryCardProps) {
  const doctorName = `Dr. ${createdBy.user.firstName} ${createdBy.user.lastName}`;
  const created = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  const updated = typeof updatedAt === 'string' ? new Date(updatedAt) : updatedAt;

  const InfoSection = ({ title, content, icon: Icon, variant = 'default' }: any) => {
    if (!content) return null;

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${variant === 'warning' ? 'text-warning' : 'text-primary'}`} />
          <h4 className="font-semibold text-sm">{title}</h4>
        </div>
        <p className="text-sm text-base-content/70 pl-6 whitespace-pre-line">{content}</p>
      </div>
    );
  };

  return (
    <Card className={className}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-base-300">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold mb-1">Expediente Médico</h3>
              <div className="flex items-center gap-2 text-sm text-base-content/70">
                <User className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{doctorName} - {createdBy.specialty.name}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-base-content/60 mt-1">
                <Calendar className="w-3 h-3 flex-shrink-0" />
                <span>
                  Creado: {format(created, "d MMM yyyy", { locale: es })}
                </span>
              </div>
            </div>
          </div>
          {onEdit && (
            <button
              onClick={() => onEdit(id)}
              className="btn btn-sm btn-ghost"
            >
              Editar
            </button>
          )}
        </div>

        {/* Alergias - destacadas */}
        {allergies && (
          <div className="alert alert-warning">
            <AlertCircle className="w-5 h-5" />
            <div>
              <h4 className="font-bold">Alergias</h4>
              <p className="text-sm">{allergies}</p>
            </div>
          </div>
        )}

        {/* Secciones de información */}
        <div className="space-y-4">
          <InfoSection
            title="Historial Médico"
            content={medicalHistory}
            icon={FileText}
          />
          
          <InfoSection
            title="Historial Familiar"
            content={familyHistory}
            icon={FileText}
          />
          
          <InfoSection
            title="Enfermedades Crónicas"
            content={chronicDiseases}
            icon={AlertCircle}
            variant="warning"
          />
          
          <InfoSection
            title="Medicamentos Actuales"
            content={currentMedications}
            icon={FileText}
          />
          
          {notes && (
            <div className="bg-base-200 rounded-lg p-3">
              <h4 className="font-semibold text-sm mb-2">Notas Adicionales</h4>
              <p className="text-sm text-base-content/70 whitespace-pre-line">{notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-base-300">
          <p className="text-xs text-base-content/60">
            Última actualización: {format(updated, "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}
          </p>
        </div>
      </div>
    </Card>
  );
}