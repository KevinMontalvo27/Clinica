import { useState, useEffect } from 'react';
import { Calendar, Search } from 'lucide-react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { Spinner, Alert, EmptyState, Badge, Button } from '../../../components/common';
import { AppointmentCard, AppointmentCalendar } from '../components';
import { appointmentsService } from '../../../api/services/appointments.service';
import type { Appointment, AppointmentStatus } from '../../../api/services/appointments.service';
import { useAuthStore } from '../../../store/authStore';
import { doctorsService } from '../../../api/services/doctors.service';
import { useNavigate } from 'react-router-dom';

type ViewMode = 'list' | 'calendar';
type FilterStatus = 'ALL' | AppointmentStatus;

export default function MyAppointments() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'month' | 'all'>('all');

  useEffect(() => {
    loadDoctorData();
  }, [user]);

  useEffect(() => {
    applyFilters();
  }, [filterStatus, searchTerm, dateFilter, appointments]);

  const loadDoctorData = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      const doctor = await doctorsService.getByUserId(user.id);
      setDoctorId(doctor.id);
      await loadAppointments(doctor.id);
    } catch (err: any) {
      console.error('Error cargando citas:', err);
      setError(err.response?.data?.message || 'Error al cargar las citas');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAppointments = async (docId: string) => {
    const data = await appointmentsService.getByDoctor(docId);
    setAppointments(data);
  };

  const applyFilters = () => {
    let filtered = [...appointments];

    // Filtro por estado
    if (filterStatus !== 'ALL') {
      filtered = filtered.filter(apt => apt.status === filterStatus);
    }

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.patient?.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patient?.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por fecha
    const today = new Date();
    if (dateFilter === 'today') {
      const todayStr = today.toISOString().split('T')[0];
      filtered = filtered.filter(apt => apt.appointmentDate === todayStr);
    } else if (dateFilter === 'week') {
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= today && aptDate <= weekFromNow;
      });
    } else if (dateFilter === 'month') {
      filtered = filtered.filter(apt => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate.getMonth() === today.getMonth() &&
               aptDate.getFullYear() === today.getFullYear();
      });
    }

    setFilteredAppointments(filtered);
  };

  const handleStartConsultation = (appointmentId: string) => {
    navigate(`/doctor/consultation/register?appointmentId=${appointmentId}`);
  };

  const handleConfirm = async (id: string) => {
    try {
      await appointmentsService.confirm(String(id));
      if (doctorId) await loadAppointments(doctorId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al confirmar cita');
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await appointmentsService.cancel(String(id), { reason: 'Cancelada por el doctor' });
      if (doctorId) await loadAppointments(doctorId);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cancelar cita');
    }
  };

  const handleReschedule = async (id: string) => {
    console.log('Reprogramar cita:', id);
    // TODO: Abrir modal de reprogramación
  };

  const handleViewDetails = (id: string) => {
    console.log('Ver detalles:', id);
    // TODO: Navegar a detalles de la cita
  };

  // Estadísticas
  const stats = {
    total: appointments.length,
    scheduled: appointments.filter(a => a.status === 'SCHEDULED').length,
    completed: appointments.filter(a => a.status === 'COMPLETED').length,
    cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
  };

  // Convertir para el calendario
  const calendarAppointments = appointments.map(apt => ({
    id: apt.id,
    date: apt.appointmentDate,
    time: apt.appointmentTime,
    patientName: `${apt.patient?.user.firstName} ${apt.patient?.user.lastName}`,
    status: apt.status,
  }));

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <Spinner size="lg" text="Cargando citas..." />
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
            <h1 className="text-3xl font-bold">Mis Citas</h1>
            <p className="text-base-content/60 mt-1">
              Gestiona tus citas médicas
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('list')}
              className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-outline'}`}
            >
              Lista
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`btn ${viewMode === 'calendar' ? 'btn-primary' : 'btn-outline'}`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Calendario
            </button>
          </div>
        </div>

        {error && (
          <Alert type="error" closeable onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-base-200 rounded-lg p-4">
            <p className="text-sm text-base-content/70">Total</p>
            <p className="text-2xl font-bold text-base-content mt-1">{stats.total}</p>
          </div>
          <div className="bg-info/10 border border-info/30 rounded-lg p-4">
            <p className="text-sm text-base-content/70">Programadas</p>
            <p className="text-2xl font-bold text-info mt-1">{stats.scheduled}</p>
          </div>
          <div className="bg-success/10 border border-success/30 rounded-lg p-4">
            <p className="text-sm text-base-content/70">Completadas</p>
            <p className="text-2xl font-bold text-success mt-1">{stats.completed}</p>
          </div>
          <div className="bg-error/10 border border-error/30 rounded-lg p-4">
            <p className="text-sm text-base-content/70">Canceladas</p>
            <p className="text-2xl font-bold text-error mt-1">{stats.cancelled}</p>
          </div>
        </div>

        {/* Vista de Calendario */}
        {viewMode === 'calendar' ? (
          <AppointmentCalendar
            appointments={calendarAppointments}
            onAppointmentClick={(id) => handleViewDetails(id)}
          />
        ) : (
          <>
            {/* Filtros */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {/* Búsqueda */}
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
                  <input
                    type="text"
                    placeholder="Buscar paciente o motivo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input input-bordered w-full pl-10"
                  />
                </div>

                {/* Filtro por estado */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                  className="select select-bordered"
                >
                  <option value="ALL">Todos los estados</option>
                  <option value="SCHEDULED">Programadas</option>
                  <option value="CONFIRMED">Confirmadas</option>
                  <option value="COMPLETED">Completadas</option>
                  <option value="CANCELLED">Canceladas</option>
                  <option value="NO_SHOW">No presentadas</option>
                </select>

                {/* Filtro por fecha */}
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value as any)}
                  className="select select-bordered"
                >
                  <option value="all">Todas las fechas</option>
                  <option value="today">Hoy</option>
                  <option value="week">Esta semana</option>
                  <option value="month">Este mes</option>
                </select>
              </div>

              {/* Resultados */}
              {searchTerm && (
                <p className="text-sm text-base-content/60">
                  {filteredAppointments.length} resultado{filteredAppointments.length !== 1 ? 's' : ''} encontrado{filteredAppointments.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Lista de Citas */}
            {filteredAppointments.length === 0 ? (
              <EmptyState
                icon="📅"
                title="No hay citas"
                description={
                  searchTerm || filterStatus !== 'ALL' || dateFilter !== 'all'
                    ? 'No se encontraron citas con los filtros aplicados'
                    : 'Aún no tienes citas programadas'
                }
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAppointments.map((appointment) => (
                  <AppointmentCard
                    key={appointment.id}
                    id={appointment.id}
                    patientName={`${appointment.patient?.user.firstName} ${appointment.patient?.user.lastName}`}
                    date={appointment.appointmentDate}
                    time={appointment.appointmentTime.slice(0, 5)}
                    duration={appointment.duration}
                    status={appointment.status}
                    reason={appointment.reason}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                    onReschedule={handleReschedule}
                    onViewDetails={handleViewDetails}
                    onStartConsultation={handleStartConsultation}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}