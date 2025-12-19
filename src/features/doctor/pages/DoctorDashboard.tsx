import { useState, useEffect } from 'react';
import { Calendar, Users, DollarSign, Activity, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { Card, Spinner, Alert } from '../../../components/common';
import { DoctorStats, TodaySchedule } from '../components';
import { useAuthStore } from '../../../store/authStore';
import { doctorsService } from '../../../api/services/doctors.service';
import { medicalServicesService } from '../../../api/services/medical-services.service';
import { appointmentsService } from '../../../api/services/appointments.service';

export default function DoctorDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    totalPatients: 0,
    monthlyEarnings: 0,
    cancelledAppointments: 0,
    activeServices: 0,
    weeklyAppointments: 0,
  });
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);

      // Obtener doctor
      const doctor = await doctorsService.getByUserId(user.id);

      // Cargar datos en paralelo
      const [services, doctorStats, todayAppointments, upcomingAppointments] = await Promise.all([
        medicalServicesService.getByDoctor(doctor.id, true),
        doctorsService.getStatistics(doctor.id).catch(() => null),
        appointmentsService.getToday(doctor.id).catch(() => []),
        appointmentsService.getUpcoming(undefined, doctor.id).catch(() => []),
      ]);

      // Calcular citas de esta semana
      const today = new Date();
      const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const weeklyAppointments = upcomingAppointments.filter((apt: any) => {
        const aptDate = new Date(apt.appointmentDate);
        return aptDate >= today && aptDate <= weekFromNow;
      });

      // Calcular estadísticas
      setStats({
        todayAppointments: todayAppointments.length,
        totalPatients: doctorStats?.totalPatients || 0,
        monthlyEarnings: doctorStats?.totalEarnings || 0,
        cancelledAppointments: doctorStats?.cancelledAppointments || 0,
        activeServices: services.length,
        weeklyAppointments: weeklyAppointments.length,
      });

      // Transformar citas de hoy para TodaySchedule
      const schedules = todayAppointments.map((apt: any) => ({
        id: apt.id,
        time: apt.appointmentTime.slice(0, 5),
        patientName: `${apt.patient?.user.firstName} ${apt.patient?.user.lastName}`,
        service: apt.service?.name || 'Consulta',
        duration: apt.duration,
        status: apt.status,
        location: 'Consultorio',
      }));

      setTodaySchedule(schedules);
    } catch (err: any) {
      console.error('Error cargando dashboard:', err);
      setError(err.response?.data?.message || 'Error al cargar el dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartConsultation = (id: string) => {
    
    console.log('Iniciar consulta:', id);
  };

  const handleViewDetails = (id: string) => {
    
    console.log('Ver detalles:', id);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <Spinner size="lg" text="Cargando dashboard..." />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-base-content/60 mt-1">
            Bienvenido, Dr. {user?.firstName} {user?.lastName}
          </p>
        </div>

        {error && (
          <Alert type="error" closeable onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Stats Grid */}
        <DoctorStats
          todayAppointments={stats.todayAppointments}
          totalPatients={stats.totalPatients}
          monthlyEarnings={stats.monthlyEarnings}
          cancelledAppointments={stats.cancelledAppointments}
        />

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70 mb-1">Servicios Activos</p>
                <p className="text-3xl font-bold text-accent">{stats.activeServices}</p>
                <p className="text-xs text-base-content/60 mt-2">
                  Disponibles para agendar
                </p>
              </div>
              <Activity className="w-12 h-12 text-accent/50" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-info/10 to-info/5 border-info/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-base-content/70 mb-1">Citas Esta Semana</p>
                <p className="text-3xl font-bold text-info">{stats.weeklyAppointments}</p>
                <p className="text-xs text-base-content/60 mt-2">
                  Próximos 7 días
                </p>
              </div>
              <Calendar className="w-12 h-12 text-info/50" />
            </div>
          </Card>
        </div>

        {/* Agenda de Hoy */}
        <TodaySchedule
          schedules={todaySchedule}
          onStartConsultation={handleStartConsultation}
          onViewDetails={handleViewDetails}
        />

        {/* Quick Actions */}
        <Card title="Acciones Rápidas">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button 
              onClick={() => navigate('/doctor/appointments')}
              className="btn btn-outline gap-2"
            >
              <Calendar className="w-4 h-4" />
              Ver Citas
            </button>
            <button 
              onClick={() => navigate('/doctor/patients')}
              className="btn btn-outline gap-2"
            >
              <Users className="w-4 h-4" />
              Mis Pacientes
            </button>
            <button 
              onClick={() => navigate('/doctor/schedule')}
              className="btn btn-outline gap-2"
            >
              <Clock className="w-4 h-4" />
              Mis Horarios
            </button>
            <button 
              onClick={() => navigate('/doctor/services')}
              className="btn btn-outline gap-2"
            >
              <DollarSign className="w-4 h-4" />
              Mis Servicios
            </button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}