import { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { Card, Badge } from '../../../components/common';

export type AppointmentStatus = 
  | 'SCHEDULED' 
  | 'CONFIRMED' 
  | 'CANCELLED' 
  | 'COMPLETED' 
  | 'NO_SHOW' 
  | 'RESCHEDULED';

interface CalendarAppointment {
  id: string;
  date: string;
  time: string;
  patientName: string;
  status: AppointmentStatus;
}

interface AppointmentCalendarProps {
  appointments: CalendarAppointment[];
  onDateSelect?: (date: Date) => void;
  onAppointmentClick?: (id: string) => void;
  className?: string;
}

export default function AppointmentCalendar({
  appointments = [],
  onDateSelect,
  onAppointmentClick,
  className = '',
}: AppointmentCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: startingDayOfWeek }, (_, i) => i);

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const selectedDateAppointments = selectedDate ? getAppointmentsForDate(selectedDate) : [];

  return (
    <Card className={className}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
          </div>
          <div className="flex gap-1">
            <button
              onClick={handlePrevMonth}
              className="btn btn-sm btn-ghost btn-circle"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNextMonth}
              className="btn btn-sm btn-ghost btn-circle"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Day headers */}
          {dayNames.map((day) => (
            <div
              key={day}
              className="text-center text-xs font-semibold text-base-content/60 py-2"
            >
              {day}
            </div>
          ))}

          {/* Empty days */}
          {emptyDays.map((_, index) => (
            <div key={`empty-${index}`} className="aspect-square" />
          ))}

          {/* Days */}
          {days.map((day) => {
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const dayAppointments = getAppointmentsForDate(date);
            const hasAppointments = dayAppointments.length > 0;

            return (
              <button
                key={day}
                onClick={() => handleDateClick(day)}
                className={`
                  aspect-square p-1 rounded-lg transition-all relative
                  ${isToday(day) ? 'bg-primary text-primary-content font-bold' : ''}
                  ${isSelected(day) ? 'ring-2 ring-primary ring-offset-2' : ''}
                  ${!isToday(day) && !isSelected(day) ? 'hover:bg-base-200' : ''}
                `}
              >
                <span className="text-sm">{day}</span>
                {hasAppointments && (
                  <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                    {dayAppointments.slice(0, 3).map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-1 rounded-full ${
                          isToday(day) ? 'bg-primary-content' : 'bg-primary'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Selected Date Appointments */}
        {selectedDate && selectedDateAppointments.length > 0 && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">
              Citas del {selectedDate.getDate()} de {monthNames[selectedDate.getMonth()]}
            </h4>
            <div className="space-y-2">
              {selectedDateAppointments.map((apt) => (
                <button
                  key={apt.id}
                  onClick={() => onAppointmentClick?.(apt.id)}
                  className="w-full p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{apt.time} - {apt.patientName}</p>
                    </div>
                    <Badge
                      variant={
                        apt.status === 'COMPLETED' || apt.status === 'CONFIRMED'
                          ? 'success'
                          : apt.status === 'CANCELLED' || apt.status === 'NO_SHOW'
                          ? 'error'
                          : apt.status === 'RESCHEDULED'
                          ? 'warning'
                          : 'info'
                      }
                      size="sm"
                    >
                      {apt.status === 'COMPLETED'
                        ? 'Completada'
                        : apt.status === 'CONFIRMED'
                        ? 'Confirmada'
                        : apt.status === 'CANCELLED'
                        ? 'Cancelada'
                        : apt.status === 'NO_SHOW'
                        ? 'No presentada'
                        : apt.status === 'RESCHEDULED'
                        ? 'Reagendada'
                        : 'Programada'}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}