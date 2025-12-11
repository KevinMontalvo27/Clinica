// src/features/patient/pages/PatientDashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Calendar, Stethoscope, FileText, User, Info, CheckCircle, HelpCircle, Phone } from 'lucide-react';
import PatientDashboardLayout from '../../../components/layouts/PatientDashboardLayout';
import { Spinner, Alert } from '../../../components/common';
import {
  PatientStats,
  UpcomingAppointments,
  QuickActions,
} from '../components';
import { appointmentsService } from '../../../api/services/appointments.service';
import { patientsService } from '../../../api/services/patients.service';
import { useAuthStore } from '../../../store/authStore';

interface DashboardData {
  stats: {
    totalAppointments: number;
    completedAppointments: number;
    upcomingAppointments: number;
    totalConsultations: number;
  };
  upcomingAppointments: any[];
}

export default function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [patientId, setPatientId] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData>({
    stats: {
      totalAppointments: 0,
      completedAppointments: 0,
      upcomingAppointments: 0,
      totalConsultations: 0,
    },
    upcomingAppointments: [],
  });

  useEffect(() => {
    loadPatientData();
  }, [user]);

  const loadPatientData = async () => {
    if (!user?.id) {
      setError('No se pudo obtener la información del usuario');
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Obtener el patient usando el userId
      const patient = await patientsService.getByUserId(user.id);
      setPatientId(patient.id);

      // Cargar las estadísticas y citas con el patientId
      await loadDashboardData(patient.id);
    } catch (err: any) {
      console.error('Error loading patient data:', err);
      setError(err.message || 'Error al cargar la información del paciente');
      setIsLoading(false);
    }
  };

  const loadDashboardData = async (currentPatientId: string) => {
    try {
      // Cargar estadísticas del paciente y próximas citas
      const [statistics, upcomingAppointments] = await Promise.all([
        patientsService.getStatistics(currentPatientId),
        appointmentsService.getUpcoming(currentPatientId),
      ]);

      setDashboardData({
        stats: {
          totalAppointments: statistics.totalAppointments || 0,
          completedAppointments: statistics.completedAppointments || 0,
          upcomingAppointments: statistics.upcomingAppointments || 0,
          totalConsultations: statistics.totalConsultations || 0,
        },
        upcomingAppointments: upcomingAppointments || [],
      });
    } catch (err: any) {
      console.error('Error loading dashboard:', err);
      setError(err.message || 'Error al cargar el dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = () => {
    navigate('/patient/book-appointment');
  };

  const handleSearchDoctors = () => {
    navigate('/patient/search-doctors');
  };

  const handleViewMedicalHistory = () => {
    navigate('/patient/medical-history');
  };

  const handleViewProfile = () => {
    navigate('/patient/profile');
  };

  const handleViewAllAppointments = () => {
    navigate('/patient/appointments');
  };

  const handleViewAppointmentDetails = (appointmentId: string) => {
    navigate(`/patient/appointments/${appointmentId}`);
  };

  if (isLoading) {
    return (
      <PatientDashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Spinner size="lg" text="Cargando dashboard..." />
        </div>
      </PatientDashboardLayout>
    );
  }

  return (
    <PatientDashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg shadow-sm p-6 border border-primary/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-base-content mb-2">
                Bienvenido, {user?.firstName || 'Paciente'}
              </h1>
              <p className="text-base-content/70">
                Gestiona tus citas médicas y revisa tu historial de salud
              </p>
            </div>
            <button
              onClick={handleBookAppointment}
              className="btn btn-primary gap-2"
            >
              <Plus className="w-5 h-5" />
              Agendar Cita
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert
            type="error"
            title="Error"
            closeable
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {/* Estadísticas */}
        <PatientStats
          totalAppointments={dashboardData.stats.totalAppointments}
          completedAppointments={dashboardData.stats.completedAppointments}
          upcomingAppointments={dashboardData.stats.upcomingAppointments}
          totalConsultations={dashboardData.stats.totalConsultations}
        />

        {/* Grid de contenido principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda - Próximas citas (2/3) */}
          <div className="lg:col-span-2">
            <UpcomingAppointments
              appointments={dashboardData.upcomingAppointments}
              onViewAll={handleViewAllAppointments}
              onViewDetails={handleViewAppointmentDetails}
            />
          </div>

          {/* Columna derecha - Acciones rápidas (1/3) */}
          <div className="lg:col-span-1">
            <QuickActions
              onBookAppointment={handleBookAppointment}
              onSearchDoctors={handleSearchDoctors}
              onViewMedicalHistory={handleViewMedicalHistory}
              onViewProfile={handleViewProfile}
            />
          </div>
        </div>

        {/* Sección adicional - Recordatorios o Tips */}
        <div className="bg-base-100 rounded-lg shadow-sm p-6 border border-base-300">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-info" />
            Recordatorios de Salud
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="alert alert-info">
              <Calendar className="w-6 h-6" />
              <div>
                <h3 className="font-bold">Chequeo Anual</h3>
                <div className="text-xs">No olvides realizar tu chequeo médico anual</div>
              </div>
            </div>

            <div className="alert alert-success">
              <CheckCircle className="w-6 h-6" />
              <div>
                <h3 className="font-bold">Mantén tu perfil actualizado</h3>
                <div className="text-xs">Información de contacto y seguro médico</div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de ayuda */}
        <div className="bg-primary/5 border-2 border-primary/20 rounded-lg p-6">
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <HelpCircle className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-2">¿Necesitas ayuda?</h3>
              <p className="text-base-content/70 mb-4">
                Si tienes alguna duda sobre cómo usar la plataforma o necesitas asistencia, 
                estamos aquí para ayudarte.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="btn btn-sm btn-outline gap-2">
                  <FileText className="w-4 h-4" />
                  Ver Guía de Uso
                </button>
                <button className="btn btn-sm btn-outline gap-2">
                  <Phone className="w-4 h-4" />
                  Contactar Soporte
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PatientDashboardLayout>
  );
}