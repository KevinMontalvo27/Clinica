import { Card } from '../../../components/common';
import { Activity, Weight, Ruler, Heart, Thermometer, TrendingUp } from 'lucide-react';

interface VitalSignsDisplayProps {
  weight?: number;
  height?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
  date?: Date | string;
  className?: string;
}

export default function VitalSignsDisplay({
  weight,
  height,
  bloodPressureSystolic,
  bloodPressureDiastolic,
  heartRate,
  temperature,
  date,
  className = '',
}: VitalSignsDisplayProps) {
  const VitalSignCard = ({ 
    icon: Icon, 
    label, 
    value, 
    unit, 
    color = 'primary' 
  }: { 
    icon: any; 
    label: string; 
    value: string | number; 
    unit: string; 
    color?: string;
  }) => (
    <div className="bg-base-200 rounded-lg p-4">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-lg bg-${color}/10 flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-6 h-6 text-${color}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-base-content/60">{label}</p>
          <p className="text-lg font-bold">
            {value} <span className="text-sm font-normal text-base-content/70">{unit}</span>
          </p>
        </div>
      </div>
    </div>
  );

  // Calcular IMC si hay peso y altura
  let bmi: number | undefined;
  if (weight && height) {
    const heightInMeters = height / 100;
    bmi = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { text: 'Bajo peso', color: 'warning' };
    if (bmi < 25) return { text: 'Normal', color: 'success' };
    if (bmi < 30) return { text: 'Sobrepeso', color: 'warning' };
    return { text: 'Obesidad', color: 'error' };
  };

  return (
    <Card className={className}>
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-4 border-b border-base-300">
          <Activity className="w-5 h-5 text-primary" />
          <h3 className="font-bold">Signos Vitales</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weight && (
            <VitalSignCard
              icon={Weight}
              label="Peso"
              value={weight}
              unit="kg"
              color="primary"
            />
          )}

          {height && (
            <VitalSignCard
              icon={Ruler}
              label="Altura"
              value={height}
              unit="cm"
              color="info"
            />
          )}

          {bloodPressureSystolic && bloodPressureDiastolic && (
            <VitalSignCard
              icon={Activity}
              label="Presión Arterial"
              value={`${bloodPressureSystolic}/${bloodPressureDiastolic}`}
              unit="mmHg"
              color="error"
            />
          )}

          {heartRate && (
            <VitalSignCard
              icon={Heart}
              label="Frecuencia Cardíaca"
              value={heartRate}
              unit="lpm"
              color="success"
            />
          )}

          {temperature && (
            <VitalSignCard
              icon={Thermometer}
              label="Temperatura"
              value={temperature}
              unit="°C"
              color="warning"
            />
          )}

          {bmi && (
            <div className="bg-base-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg bg-${getBMICategory(bmi).color}/10 flex items-center justify-center flex-shrink-0`}>
                  <TrendingUp className={`w-6 h-6 text-${getBMICategory(bmi).color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-base-content/60">Índice de Masa Corporal (IMC)</p>
                  <p className="text-lg font-bold">
                    {bmi} <span className={`text-sm font-normal text-${getBMICategory(bmi).color}`}>
                      {getBMICategory(bmi).text}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {date && (
          <div className="pt-4 border-t border-base-300">
            <p className="text-xs text-base-content/60">
              Medición realizada el {typeof date === 'string' ? date : date.toLocaleDateString('es-MX')}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}