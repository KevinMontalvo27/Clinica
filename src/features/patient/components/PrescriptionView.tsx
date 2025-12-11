import { Card } from '../../../components/common';
import { Pill, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface PrescriptionViewProps {
  prescriptions: string;
  doctor: {
    user: {
      firstName: string;
      lastName: string;
    };
    specialty: {
      name: string;
    };
    licenseNumber: string;
  };
  date: Date | string;
  diagnosis?: string;
  followUpInstructions?: string;
  className?: string;
}

export default function PrescriptionView({
  prescriptions,
  doctor,
  date,
  diagnosis,
  followUpInstructions,
  className = '',
}: PrescriptionViewProps) {
  const doctorName = `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`;
  const prescriptionDate = typeof date === 'string' ? new Date(date) : date;
  const formattedDate = format(prescriptionDate, "d 'de' MMMM 'de' yyyy", { locale: es });

  // Dividir las prescripciones en líneas individuales
  const prescriptionLines = prescriptions.split('\n').filter(line => line.trim());

  return (
    <Card className={className}>
      <div className="space-y-4">
        {/* Header con estilo de receta médica */}
        <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-bold text-lg">{doctorName}</h3>
              <p className="text-sm text-base-content/70">{doctor.specialty.name}</p>
              <p className="text-xs text-base-content/60">Cédula Prof.: {doctor.licenseNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-base-content/60">Fecha</p>
              <p className="text-sm font-medium">{formattedDate}</p>
            </div>
          </div>
        </div>

        {/* Diagnóstico */}
        {diagnosis && (
          <div>
            <h4 className="font-semibold text-sm text-base-content/70 mb-2">Diagnóstico:</h4>
            <p className="text-sm bg-base-200 rounded-lg p-3">{diagnosis}</p>
          </div>
        )}

        {/* Prescripciones */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Pill className="w-5 h-5 text-success" />
            <h4 className="font-bold">Medicamentos Recetados</h4>
          </div>
          <div className="space-y-2">
            {prescriptionLines.map((line, index) => (
              <div
                key={index}
                className="bg-base-200 rounded-lg p-3 border-l-4 border-success"
              >
                <p className="text-sm whitespace-pre-line">{line}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Instrucciones de seguimiento */}
        {followUpInstructions && (
          <div className="border-t border-base-300 pt-4">
            <h4 className="font-semibold text-sm text-base-content/70 mb-2">
              Instrucciones de Seguimiento:
            </h4>
            <p className="text-sm whitespace-pre-line bg-info/10 rounded-lg p-3 border-l-4 border-info">
              {followUpInstructions}
            </p>
          </div>
        )}

        {/* Nota importante */}
        <div className="alert alert-warning">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <span className="text-sm">
            No automedicarse. Seguir las indicaciones del médico. Ante cualquier reacción adversa, consultar inmediatamente.
          </span>
        </div>
      </div>
    </Card>
  );
}