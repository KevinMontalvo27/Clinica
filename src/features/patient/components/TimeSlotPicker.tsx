import { useState } from 'react';
import { Clock, CheckCircle } from 'lucide-react';
import { Badge, Spinner } from '../../../components/common';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedTime?: string;
  onTimeSelect: (time: string) => void;
  isLoading?: boolean;
  className?: string;
}

export default function TimeSlotPicker({
  slots = [],
  selectedTime,
  onTimeSelect,
  isLoading = false,
  className = '',
}: TimeSlotPickerProps) {
  if (isLoading) {
    return (
      <div className={`card bg-base-100 border border-base-300 ${className}`}>
        <div className="card-body p-8 flex items-center justify-center">
          <Spinner size="md" text="Cargando horarios disponibles..." />
        </div>
      </div>
    );
  }

  const availableSlots = slots.filter(slot => slot.available);

  if (availableSlots.length === 0) {
    return (
      <div className={`card bg-base-100 border border-base-300 ${className}`}>
        <div className="card-body p-8 text-center">
          <Clock className="w-12 h-12 mx-auto text-base-content/30 mb-4" />
          <p className="text-base-content/60">
            No hay horarios disponibles para esta fecha
          </p>
          <p className="text-sm text-base-content/40 mt-2">
            Por favor selecciona otra fecha
          </p>
        </div>
      </div>
    );
  }

  // Agrupar slots por período del día
  const morningSlots = availableSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour < 12;
  });

  const afternoonSlots = availableSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 12 && hour < 18;
  });

  const eveningSlots = availableSlots.filter(slot => {
    const hour = parseInt(slot.time.split(':')[0]);
    return hour >= 18;
  });

  const SlotGroup = ({ title, slots }: { title: string; slots: TimeSlot[] }) => {
    if (slots.length === 0) return null;

    return (
      <div>
        <h4 className="font-semibold text-sm text-base-content/70 mb-3">{title}</h4>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {slots.map((slot) => {
            const isSelected = selectedTime === slot.time;
            const timeFormatted = slot.time.substring(0, 5); // HH:MM

            return (
              <button
                key={slot.time}
                onClick={() => onTimeSelect(slot.time)}
                className={`
                  relative px-3 py-2 rounded-lg text-sm font-medium transition-all
                  ${
                    isSelected
                      ? 'bg-primary text-primary-content ring-2 ring-primary ring-offset-2'
                      : 'bg-base-200 hover:bg-base-300 text-base-content'
                  }
                `}
              >
                {timeFormatted}
                {isSelected && (
                  <CheckCircle className="absolute -top-1 -right-1 w-4 h-4 text-success bg-base-100 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className={`card bg-base-100 border border-base-300 ${className}`}>
      <div className="card-body p-4 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-bold flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Horarios Disponibles
          </h3>
          <Badge variant="info" size="sm">
            {availableSlots.length} disponibles
          </Badge>
        </div>

        <SlotGroup title="Mañana (6:00 - 11:59)" slots={morningSlots} />
        <SlotGroup title="Tarde (12:00 - 17:59)" slots={afternoonSlots} />
        <SlotGroup title="Noche (18:00 - 22:00)" slots={eveningSlots} />
      </div>
    </div>
  );
}