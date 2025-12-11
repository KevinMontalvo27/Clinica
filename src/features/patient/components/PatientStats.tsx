import { Card } from '../../../components/common';
import { Calendar, FileText, Activity, Clock } from 'lucide-react';

interface PatientStatsProps {
  totalAppointments: number;
  completedAppointments: number;
  upcomingAppointments: number;
  totalConsultations: number;
  className?: string;
}

export default function PatientStats({
  totalAppointments,
  completedAppointments,
  upcomingAppointments,
  totalConsultations,
  className = '',
}: PatientStatsProps) {
  const stats = [
    {
      icon: Calendar,
      label: 'Citas Totales',
      value: totalAppointments,
      color: 'primary',
    },
    {
      icon: Activity,
      label: 'Citas Completadas',
      value: completedAppointments,
      color: 'success',
    },
    {
      icon: Clock,
      label: 'Próximas Citas',
      value: upcomingAppointments,
      color: 'warning',
    },
    {
      icon: FileText,
      label: 'Consultas Registradas',
      value: totalConsultations,
      color: 'info',
    },
  ];

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-lg bg-${stat.color}/10 flex items-center justify-center flex-shrink-0`}>
              <stat.icon className={`w-8 h-8 text-${stat.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-base-content/60 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}