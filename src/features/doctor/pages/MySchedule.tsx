import { useState, useEffect } from 'react';
import { Plus, Calendar, Clock, Trash2 } from 'lucide-react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { Card, Button, Modal, Alert, Spinner, ConfirmDialog, Badge } from '../../../components/common';
import ScheduleForm from '../components/ScheduleForm';
import ExceptionForm from '../components/ExceptionForm';
import { schedulesService } from '../../../api/services/schedules.service';
import { scheduleExceptionsService } from '../../../api/services/schedule-exceptions.service';
import type { DoctorSchedule } from '../../../api/services/schedules.service';
import type { ScheduleException } from '../../../api/services/schedule-exceptions.service';
import { useAuthStore } from '../../../store/authStore';
import { doctorsService } from '../../../api/services/doctors.service';

const daysOfWeek = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

export default function MySchedule() {
  const { user } = useAuthStore();
  const [schedules, setSchedules] = useState<DoctorSchedule[]>([]);
  const [exceptions, setExceptions] = useState<ScheduleException[]>([]);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [deleteScheduleId, setDeleteScheduleId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDoctorData();
  }, [user]);

  const loadDoctorData = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Obtener doctor por userId
      const doctor = await doctorsService.getByUserId(user.id);
      setDoctorId(doctor.id);

      // Cargar horarios y excepciones
      await Promise.all([
        loadSchedules(doctor.id),
        loadExceptions(doctor.id)
      ]);
    } catch (err: any) {
      console.error('Error cargando datos:', err);
      setError(err.response?.data?.message || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const loadSchedules = async (docId: string) => {
    const data = await schedulesService.getByDoctor(docId);
    setSchedules(data);
  };

  const loadExceptions = async (docId: string) => {
    const data = await scheduleExceptionsService.getByDoctor(docId, false);
    setExceptions(data);
  };

  const handleCreateSchedule = async (values: any) => {
    if (!doctorId) return;

    try {
      await schedulesService.create({
        doctorId,
        ...values,
      });
      await loadSchedules(doctorId);
      setShowScheduleModal(false);
    } catch (err: any) {
      console.error('Error creando horario:', err);
      throw err;
    }
  };

  const handleCreateException = async (values: any) => {
    if (!doctorId) return;

    try {
      await scheduleExceptionsService.create({
        doctorId,
        exceptionDate: values.exceptionDate,
        startTime: values.isFullDay ? undefined : values.startTime,
        endTime: values.isFullDay ? undefined : values.endTime,
        reason: values.reason,
      });
      await loadExceptions(doctorId);
      setShowExceptionModal(false);
    } catch (err: any) {
      console.error('Error creando excepción:', err);
      throw err;
    }
  };

  const handleDeleteSchedule = async () => {
    if (!deleteScheduleId || !doctorId) return;

    try {
      await schedulesService.delete(deleteScheduleId);
      await loadSchedules(doctorId);
      setDeleteScheduleId(null);
    } catch (err: any) {
      console.error('Error eliminando horario:', err);
      setError(err.response?.data?.message || 'Error al eliminar horario');
    }
  };

  const handleToggleScheduleStatus = async (scheduleId: string, isActive: boolean) => {
    if (!doctorId) return;

    try {
      if (isActive) {
        await schedulesService.activate(scheduleId);
      } else {
        await schedulesService.deactivate(scheduleId);
      }
      await loadSchedules(doctorId);
    } catch (err: any) {
      console.error('Error cambiando estado:', err);
      setError(err.response?.data?.message || 'Error al cambiar estado');
    }
  };

  const handleDeleteException = async (exceptionId: string) => {
    if (!doctorId) return;

    try {
      await scheduleExceptionsService.delete(exceptionId);
      await loadExceptions(doctorId);
    } catch (err: any) {
      console.error('Error eliminando excepción:', err);
      setError(err.response?.data?.message || 'Error al eliminar excepción');
    }
  };

  // Agrupar horarios por día
  const schedulesByDay = schedules.reduce((acc, schedule) => {
    if (!acc[schedule.dayOfWeek]) {
      acc[schedule.dayOfWeek] = [];
    }
    acc[schedule.dayOfWeek].push(schedule);
    return acc;
  }, {} as Record<number, DoctorSchedule[]>);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <Spinner size="lg" text="Cargando horarios..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mi Horario</h1>
            <p className="text-base-content/60 mt-1">
              Gestiona tu disponibilidad y excepciones
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowExceptionModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Excepción
            </Button>
            <Button
              variant="primary"
              onClick={() => setShowScheduleModal(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Horario
            </Button>
          </div>
        </div>

        {error && (
          <Alert type="error" closeable onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Horarios Semanales */}
        <Card title="Horarios Semanales">
          {schedules.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-base-content/30" />
              <p className="text-base-content/60 mb-4">
                No has configurado tus horarios
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowScheduleModal(true)}
              >
                Agregar Primer Horario
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {daysOfWeek.map((dayName, dayIndex) => {
                const daySchedules = schedulesByDay[dayIndex] || [];
                if (daySchedules.length === 0) return null;

                return (
                  <div key={dayIndex} className="border-b border-base-300 pb-4 last:border-0">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      {dayName}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {daySchedules.map((schedule) => (
                        <div
                          key={schedule.id}
                          className={`p-3 rounded-lg border transition-all ${
                            schedule.isActive
                              ? 'bg-base-100 border-base-300'
                              : 'bg-base-200 border-base-300 opacity-60'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Clock className="w-5 h-5 text-primary" />
                              <div>
                                <p className="font-medium">
                                  {schedule.startTime.slice(0, 5)} - {schedule.endTime.slice(0, 5)}
                                </p>
                                <Badge
                                  variant={schedule.isActive ? 'success' : 'error'}
                                  size="sm"
                                >
                                  {schedule.isActive ? 'Activo' : 'Inactivo'}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => handleToggleScheduleStatus(schedule.id, !schedule.isActive)}
                                className="btn btn-sm btn-ghost"
                                title={schedule.isActive ? 'Desactivar' : 'Activar'}
                              >
                                {schedule.isActive ? '🔴' : '🟢'}
                              </button>
                              <button
                                onClick={() => setDeleteScheduleId(schedule.id)}
                                className="btn btn-sm btn-ghost text-error"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* Excepciones */}
        <Card title="Excepciones y Bloqueos">
          {exceptions.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto mb-3 text-base-content/30" />
              <p className="text-base-content/60">
                No tienes excepciones programadas
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {exceptions.map((exception) => (
                <div
                  key={exception.id}
                  className="p-3 bg-warning/10 border border-warning/30 rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {new Date(exception.exceptionDate).toLocaleDateString('es-MX')}
                        {exception.startTime && exception.endTime && (
                          <span className="ml-2 text-sm text-base-content/70">
                            {exception.startTime.slice(0, 5)} - {exception.endTime.slice(0, 5)}
                          </span>
                        )}
                        {!exception.startTime && !exception.endTime && (
                          <Badge variant="warning" size="sm" className="ml-2">
                            Día completo
                          </Badge>
                        )}
                      </p>
                      {exception.reason && (
                        <p className="text-sm text-base-content/60 mt-1">
                          {exception.reason}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDeleteException(exception.id)}
                      className="btn btn-sm btn-ghost text-error"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Modal: Crear Horario */}
        <Modal
          isOpen={showScheduleModal}
          title="Agregar Horario"
          onClose={() => setShowScheduleModal(false)}
          size="lg"
        >
          <ScheduleForm
            onSubmit={handleCreateSchedule}
            onCancel={() => setShowScheduleModal(false)}
          />
        </Modal>

        {/* Modal: Crear Excepción */}
        <Modal
          isOpen={showExceptionModal}
          title="Agregar Excepción"
          onClose={() => setShowExceptionModal(false)}
          size="lg"
        >
          <ExceptionForm
            onSubmit={handleCreateException}
            onCancel={() => setShowExceptionModal(false)}
          />
        </Modal>

        {/* Confirm Dialog: Eliminar Horario */}
        <ConfirmDialog
          isOpen={!!deleteScheduleId}
          title="Eliminar Horario"
          message="¿Estás seguro de que deseas eliminar este horario? Esta acción no se puede deshacer."
          confirmText="Eliminar"
          cancelText="Cancelar"
          onConfirm={handleDeleteSchedule}
          onCancel={() => setDeleteScheduleId(null)}
          isDangerous
        />
      </div>
    </DashboardLayout>
  );
}