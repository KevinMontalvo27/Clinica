import { Card, Badge } from '../../../components/common';
import { Clock, DollarSign } from 'lucide-react';

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  isActive: boolean;
}

interface DoctorServicesProps {
  services: Service[];
  onSelectService?: (serviceId: string) => void;
  selectedServiceId?: string;
  className?: string;
}

export default function DoctorServices({
  services = [],
  onSelectService,
  selectedServiceId,
  className = '',
}: DoctorServicesProps) {
  const activeServices = services.filter((s) => s.isActive);

  if (activeServices.length === 0) {
    return (
      <Card className={className}>
        <div className="text-center py-8">
          <p className="text-base-content/60">
            Este doctor no tiene servicios disponibles actualmente
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card title="Servicios Disponibles" className={className}>
      <div className="space-y-3">
        {activeServices.map((service) => {
          const isSelected = selectedServiceId === service.id;

          return (
            <button
              key={service.id}
              onClick={() => onSelectService?.(service.id)}
              className={`
                w-full text-left p-4 rounded-lg border-2 transition-all
                ${
                  isSelected
                    ? 'border-primary bg-primary/10'
                    : 'border-base-300 hover:border-base-400 hover:bg-base-200'
                }
              `}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-base-content mb-1">
                    {service.name}
                  </h4>
                  {service.description && (
                    <p className="text-sm text-base-content/70 mb-3 line-clamp-2">
                      {service.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1 text-sm">
                      <DollarSign className="w-4 h-4 text-success" />
                      <span className="font-medium">${service.price}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Clock className="w-4 h-4 text-info" />
                      <span>{service.duration} min</span>
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <Badge variant="primary" size="sm">
                    Seleccionado
                  </Badge>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}