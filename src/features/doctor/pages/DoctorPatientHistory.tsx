import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Calendar, Activity, AlertCircle } from 'lucide-react';
import { Button, Spinner, Alert, EmptyState } from '../../../components/common';
import { 
  MedicalHistoryGenerator, 
  MedicalHistoryList, 
  MedicalHistoryViewer 
} from '../../patient/components';
import { medicalHistoryService } from '../../../api/services/medical-history.service';
import { patientsService, type Patient } from '../../../api/services/patients.service';
import { appointmentsService } from '../../../api/services/appointments.service';
import { downloadMedicalHistoryPdf } from '../../../utils/downloadPdf';
import { useAuth } from '../../../hooks/useAuth';
import type { 
  GenerateMedicalHistoryDto, 
  GeneratedMedicalHistory 
} from '../../../types/medical-history.types';
import { toast } from 'react-hot-toast';

export default function DoctorPatientHistory() {
  const { patientId } = useParams<{ patientId: string }>();
  console.log('patientId from URL:', patientId);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados
  const [patient, setPatient] = useState<Patient | null>(null);
  const [histories, setHistories] = useState<GeneratedMedicalHistory[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<GeneratedMedicalHistory | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  
  // Estados de carga
  const [isLoadingPatient, setIsLoadingPatient] = useState(true);
  const [isLoadingHistories, setIsLoadingHistories] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadingIds, setDownloadingIds] = useState<string[]>([]);
  
  // Validaciones
  const [canGenerate, setCanGenerate] = useState(false);
  const [canGenerateReason, setCanGenerateReason] = useState<string>('');

  // Cargar datos del paciente
  useEffect(() => {
    if (!patientId) {
        console.log('patientId is undefined, redirecting...');
      navigate('/doctor/patients');
      return;
    }

    loadPatientData();
    loadHistories();
    checkCanGenerate();
  }, [patientId, navigate]);

  const loadPatientData = async () => {
    try {
      setIsLoadingPatient(true);
      const data = await patientsService.getById(patientId!);
      setPatient(data);
    } catch (error) {
      console.error('Error cargando paciente:', error);
      
      toast.error('No se pudo cargar la información del paciente');
      navigate('/doctor/patients');
    } finally {
      setIsLoadingPatient(false);
    }
  };

  const loadHistories = async () => {
  try {
    setIsLoadingHistories(true);
    const response = await medicalHistoryService.getHistoriesByPatient(patientId!, {
      sortBy: 'generatedAt',
      order: 'DESC',
    });
    setHistories(response.data); // ❌ Si response.data no es un array, explota
  } catch (error) {
    console.error('Error cargando historiales:', error);
    toast.error('No se pudieron cargar los historiales');
    setHistories([]); // ✅ AGREGA ESTO - asegurar que siempre sea un array
  } finally {
    setIsLoadingHistories(false);
  }
};

  const checkCanGenerate = async () => {
    try {
      // Verificar si el paciente tiene al menos una cita
      const appointments = await appointmentsService.getByPatient(patientId!);
      
      if (!appointments || appointments.length === 0) {
        setCanGenerate(false);
        setCanGenerateReason(
          'El paciente debe tener al menos una cita registrada para generar un historial médico.'
        );
      } else {
        setCanGenerate(true);
        setCanGenerateReason('');
      }
    } catch (error) {
      console.error('Error verificando capacidad de generar:', error);
      setCanGenerate(false);
      setCanGenerateReason('No se pudo verificar la información del paciente.');
    }
  };

  const handleGenerate = async (data: GenerateMedicalHistoryDto) => {
    if (!user?.id) {
      toast.error('No se pudo identificar al usuario');
      return;
    }

    try {
      setIsGenerating(true);
      toast.loading('Generando historial médico... Esto puede tardar hasta 2 minutos.', {
        id: 'generating',
      });

      const newHistory = await medicalHistoryService.generateHistory(
        patientId!,
        data,
        user.id
      );

      toast.success('¡Historial médico generado exitosamente!', { id: 'generating' });
      
      // Actualizar lista
      setHistories((prev) => {
        if (!Array.isArray(prev)) return [newHistory];
        return [newHistory, ...prev]; 
      });
      
      // Scroll al inicio
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error('Error generando historial:', error);
      toast.error(
        error.response?.data?.message || 'No se pudo generar el historial médico',
        { id: 'generating' }
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleView = (historyId: string) => {
    const history = histories.find((h) => h.id === historyId);
    if (history) {
      setSelectedHistory(history);
      setIsViewerOpen(true);
    }
  };

  const handleDownload = async (historyId: string) => {
    try {
      setDownloadingIds((prev) => [...prev, historyId]);
      
      const history = histories.find((h) => h.id === historyId);
      const filename = history
        ? `Historial_${patient?.user.firstName}_${patient?.user.lastName}_${new Date().toISOString().split('T')[0]}.pdf`
        : undefined;

      await downloadMedicalHistoryPdf(historyId, filename);
      toast.success('PDF descargado exitosamente');
    } catch (error) {
      console.error('Error descargando PDF:', error);
      toast.error('No se pudo descargar el PDF');
    } finally {
      setDownloadingIds((prev) => prev.filter((id) => id !== historyId));
    }
  };

  const handleDelete = async (historyId: string) => {
    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar este historial médico? Esta acción no se puede deshacer.'
    );

    if (!confirmed) return;

    try {
      await medicalHistoryService.delete(historyId);
      setHistories((prev) => prev.filter((h) => h.id !== historyId));
      toast.success('Historial eliminado exitosamente');
    } catch (error) {
      console.error('Error eliminando historial:', error);
      toast.error('No se pudo eliminar el historial');
    }
  };

  if (isLoadingPatient) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" text="Cargando información del paciente..." />
      </div>
    );
  }

  if (!patient) {
    return (
      <EmptyState
        icon="❌"
        title="Paciente no encontrado"
        description="No se pudo cargar la información del paciente"
      >
        <Button onClick={() => navigate('/doctor/patients')}>
          Volver a Pacientes
        </Button>
      </EmptyState>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb y navegación */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/doctor/patients')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver a Pacientes
        </Button>
      </div>

      {/* Header con info del paciente */}
      <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content">
        <div className="card-body p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">
                Historial Médico: {patient.user.firstName} {patient.user.lastName}
              </h1>
              <div className="flex flex-wrap gap-4 text-sm opacity-90">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {new Date().getFullYear() - new Date(patient.user.dateOfBirth || new Date()).getFullYear()} años
                  </span>
                </div>
                <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span>
                  {histories?.length || 0} historial{histories?.length !== 1 ? 'es' : ''} generado{histories?.length !== 1 ? 's' : ''}
                </span>
              </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Alerta informativa para doctores */}
      <Alert type="info">
        <AlertCircle className="w-5 h-5" />
        <div className="text-sm">
          <p className="font-semibold">Historial Médico con IA</p>
          <p>
            Puedes generar historiales médicos completos usando inteligencia artificial. 
            El historial se crea a partir de todas las citas y consultas registradas del paciente.
          </p>
        </div>
      </Alert>

      {/* Generador de historial */}
      <MedicalHistoryGenerator
        patientId={patientId!}
        patientName={`${patient.user.firstName} ${patient.user.lastName}`}
        onGenerate={handleGenerate}
        isGenerating={isGenerating}
        canGenerate={canGenerate}
        canGenerateReason={canGenerateReason}
        isDoctor={true}
      />

      {/* Lista de historiales */}
      <div>
        <h2 className="text-xl font-bold mb-4">Historiales Generados</h2>
        <MedicalHistoryList
          histories={histories}
          isLoading={isLoadingHistories}
          onView={handleView}
          onDownload={handleDownload}
          onDelete={handleDelete}
          downloadingIds={downloadingIds}
        />
      </div>

      {/* Visor de historial */}
      <MedicalHistoryViewer
        history={selectedHistory}
        isOpen={isViewerOpen}
        onClose={() => {
          setIsViewerOpen(false);
          setSelectedHistory(null);
        }}
        onDownload={handleDownload}
        isDownloading={selectedHistory ? downloadingIds.includes(selectedHistory.id) : false}
      />
    </div>
  );
}