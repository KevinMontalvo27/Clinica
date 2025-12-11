import { Badge } from '../../../components/common';
import { FileText, User, Calendar, Activity, Pill, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ConsultationCardProps {
  id: string;
  consultationDate: Date | string;
  doctor: {
    user: {
      firstName: string;
      lastName: string;
    };
    specialty: {
      name: string;
    };
  };
  // Signos vitales
  weight?: number;
  height?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  // Consulta
  chiefComplaint?: string;
  symptoms?: string;
  diagnosis?: string;
  treatmentPlan?: string;
  prescriptions?: string;
  followUpInstructions?: string;
  notes?: string;
  onViewDetails?: (id: string) => void;
  className?: string;
}

export default function ConsultationCard({
  id,
  consultationDate,
  doctor,
  weight,
  height,
  bloodPressureSystolic,
  bloodPressureDiastolic,
  heartRate,
  temperature,
  chiefComplaint,
  symptoms,
  diagnosis,
  treatmentPlan,
  prescriptions,
  followUpInstructions,
  notes,
  onViewDetails,
  className = '',
}: ConsultationCardProps) {
  const doctorName = `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`;
  const date = typeof consultationDate === 'string' ? new Date(consultationDate) : consultationDate;
  const formattedDate = format(date, "d 'de' MMMM, yyyy", { locale: es });

  const hasVitalSigns = weight || height || bloodPressureSystolic || bloodPressureDiastolic || heartRate || temperature;

  return (
    <div className={`card bg-base-100 border-2 border-base-300 hover:shadow-lg transition-all ${className}`}>
      <div className="card-body p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="w-4 h-4 text-primary flex-shrink-0" />
              <h3 className="font-bold text-base-content">Consulta Médica</h3>
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/70 mb-1">
              <User className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{doctorName}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-base-content/60">
              <Calendar className="w-3 h-3 flex-shrink-0" />
              <span>{formattedDate}</span>
            </div>
          </div>
          <Badge variant="info" size="sm">
            {doctor.specialty.name}
          </Badge>
        </div>

        {/* Signos vitales resumidos */}
        {hasVitalSigns && (
          <div className="bg-base-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-success" />
              <span className="text-sm font-semibold">Signos Vitales</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {weight && <div>Peso: <span className="font-medium">{weight} kg</span></div>}
              {bloodPressureSystolic && bloodPressureDiastolic && (
                <div>
                  PA: <span className="font-medium">{bloodPressureSystolic}/{bloodPressureDiastolic} mmHg</span>
                </div>
              )}
              {heartRate && <div>FC: <span className="font-medium">{heartRate} lpm</span></div>}
              {temperature && <div>Temp: <span className="font-medium">{temperature}°C</span></div>}
            </div>
          </div>
        )}

        {/* Motivo de consulta */}
        {chiefComplaint && (
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ClipboardList className="w-4 h-4 text-info" />
              <span className="text-sm font-semibold">Motivo de Consulta</span>
            </div>
            <p className="text-sm text-base-content/70 pl-6 line-clamp-2">{chiefComplaint}</p>
          </div>
        )}

        {/* Diagnóstico */}
        {diagnosis && (
          <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
            <p className="text-xs text-base-content/60 mb-1">Diagnóstico:</p>
            <p className="text-sm font-medium line-clamp-2">{diagnosis}</p>
          </div>
        )}

        {/* Prescripciones */}
        {prescriptions && (
          <div className="flex items-start gap-2">
            <Pill className="w-4 h-4 text-success mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-base-content/60">Medicamentos recetados</p>
              <p className="text-sm line-clamp-2">{prescriptions}</p>
            </div>
          </div>
        )}

        {/* Botón ver detalles */}
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(id)}
            className="btn btn-sm btn-outline w-full"
          >
            Ver Detalles Completos
          </button>
        )}
      </div>
    </div>
  );
}