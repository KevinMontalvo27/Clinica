import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../../components/common';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  isToday,
  isBefore,
  startOfToday,
} from 'date-fns';
import { es } from 'date-fns/locale';

interface CalendarViewProps {
  selectedDate?: Date;
  onDateSelect: (date: Date) => void;
  disabledDates?: Date[];
  availableDates?: Date[];
  className?: string;
}

export default function CalendarView({
  selectedDate,
  onDateSelect,
  disabledDates = [],
  availableDates = [],
  className = '',
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfToday();

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Calcular días para llenar la primera semana
  const startDayOfWeek = monthStart.getDay();
  const previousMonthDays = Array.from({ length: startDayOfWeek }, (_, i) => null);

  const allDays = [...previousMonthDays, ...daysInMonth];

  const isDateDisabled = (date: Date | null) => {
    if (!date) return true;
    if (isBefore(date, today)) return true;
    if (disabledDates.some(d => isSameDay(d, date))) return true;
    if (availableDates.length > 0 && !availableDates.some(d => isSameDay(d, date))) return true;
    return false;
  };

  const isDateAvailable = (date: Date | null) => {
    if (!date) return false;
    return availableDates.some(d => isSameDay(d, date));
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  return (
    <div className={`card bg-base-100 border border-base-300 ${className}`}>
      <div className="card-body p-4">
        {/* Header del calendario */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg capitalize">
            {format(currentMonth, 'MMMM yyyy', { locale: es })}
          </h3>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={handlePreviousMonth}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={handleNextMonth}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Días de la semana */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-base-content/60 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Días del mes */}
        <div className="grid grid-cols-7 gap-1">
          {allDays.map((date, index) => {
            if (!date) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const disabled = isDateDisabled(date);
            const available = isDateAvailable(date);
            const selected = selectedDate && isSameDay(date, selectedDate);
            const todayDate = isToday(date);

            return (
              <button
                key={date.toISOString()}
                onClick={() => !disabled && onDateSelect(date)}
                disabled={disabled}
                className={`
                  aspect-square rounded-lg text-sm font-medium transition-all
                  ${disabled ? 'text-base-content/30 cursor-not-allowed' : 'hover:bg-primary/10'}
                  ${selected ? 'bg-primary text-primary-content' : ''}
                  ${todayDate && !selected ? 'ring-2 ring-primary ring-inset' : ''}
                  ${available && !selected ? 'bg-success/10 text-success' : ''}
                  ${!isSameMonth(date, currentMonth) ? 'text-base-content/40' : ''}
                `}
              >
                {format(date, 'd')}
              </button>
            );
          })}
        </div>

        {/* Leyenda */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-base-300 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-success/10 border-2 border-success"></div>
            <span>Disponible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded ring-2 ring-primary ring-inset"></div>
            <span>Hoy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-primary"></div>
            <span>Seleccionado</span>
          </div>
        </div>
      </div>
    </div>
  );
}