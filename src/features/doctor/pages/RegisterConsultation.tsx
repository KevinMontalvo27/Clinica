import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, ArrowLeft, ArrowRight, Activity, Pill, ClipboardList, FileText } from 'lucide-react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { Card, Button, Alert, Spinner, Badge } from '../../../components/common';
import VitalSignsForm from '../components/VitalSignsForm';
import DiagnosisForm from '../components/DiagnosisForm';
import PrescriptionForm from '../components/PrescriptionForm';
import ConsultationForm from '../components/ConsultationForm';
import { consultationsService } from '../../../api/services/consultation.service';
import { appointmentsService } from '../../../api/services/appointments.service';
import { useAuthStore } from '../../../store/authStore';
import { doctorsService } from '../../../api/services/doctors.service';

type Step = 1 | 2 | 3 | 4;

interface ConsultationData {
  // Signos vitales
  weight?: number;
  height?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;

  // Diagnóstico
  diagnosis?: string;
  diagnosisCode?: string;
  severity?: string;
  treatmentPlan?: string;
  observations?: string;

  // Prescripción
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>;
  generalInstructions?: string;
  followUpDate?: string;

  // Consulta
  chiefComplaint?: string;
  symptoms?: string;
  prescriptions?: string;
  followUpInstructions?: string;
  notes?: string;
}

export default function RegisterConsultation() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const patientId = searchParams.get('patientId');

  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [doctorId, setDoctorId] = useState<string | null>(null);
  const [consultationData, setConsultationData] = useState<ConsultationData>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [patientInfo, setPatientInfo] = useState<any>(null);

  useEffect(() => {
    loadInitialData();
  }, [user, appointmentId]);

  const loadInitialData = async () => {
    if (!user?.id) return;
    if (!appointmentId && !patientId) {
      setError('Se requiere un ID de cita o paciente');
      return;
    }

    try {
      setIsLoading(true);
      const doctor = await doctorsService.getByUserId(user.id);
      setDoctorId(doctor.id);

      if (appointmentId) {
        const appointment = await appointmentsService.getById(appointmentId);
        setPatientInfo({
          id: appointment.patient?.id,
          name: `${appointment.patient?.user.firstName} ${appointment.patient?.user.lastName}`,
          email: appointment.patient?.user.email,
          phone: appointment.patient?.user.phone,
        });
      }
    } catch (err: any) {
      console.error('Error cargando datos:', err);
      setError(err.response?.data?.message || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStepSubmit = async (stepData: any) => {
    setConsultationData({ ...consultationData, ...stepData });

    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as Step);
    } else {
      await handleFinalSubmit({ ...consultationData, ...stepData });
    }
  };

  const handleFinalSubmit = async (finalData: ConsultationData) => {
    if (!doctorId || !patientInfo?.id) {
      setError('Faltan datos requeridos para guardar la consulta');
      return;
    }

    try {
      setIsSaving(true);
      setError(null);

      // Formatear prescripciones como string
      let prescriptionsText = '';
      if (finalData.medications && finalData.medications.length > 0) {
        prescriptionsText = finalData.medications
          .map((med) => {
            let text = `${med.name} - ${med.dosage} - ${med.frequency} - ${med.duration}`;
            if (med.instructions) {
              text += `\nInstrucciones: ${med.instructions}`;
            }
            return text;
          })
          .join('\n\n');

        if (finalData.generalInstructions) {
          prescriptionsText += `\n\nINSTRUCCIONES GENERALES:\n${finalData.generalInstructions}`;
        }
      }

      // Crear consulta
      await consultationsService.create({
        appointmentId: appointmentId || undefined,
        patientId: patientInfo.id,
        doctorId: doctorId,
        weight: finalData.weight,
        height: finalData.height,
        bloodPressureSystolic: finalData.bloodPressureSystolic,
        bloodPressureDiastolic: finalData.bloodPressureDiastolic,
        heartRate: finalData.heartRate,
        temperature: finalData.temperature,
        chiefComplaint: finalData.chiefComplaint,
        symptoms: finalData.symptoms,
        diagnosis: `${finalData.diagnosis}${finalData.diagnosisCode ? ` (${finalData.diagnosisCode})` : ''}`,
        treatmentPlan: finalData.treatmentPlan,
        prescriptions: prescriptionsText || undefined,
        followUpInstructions: finalData.followUpInstructions,
        notes: finalData.notes,
      });

      // Si tiene appointmentId, marcar cita como completada
      if (appointmentId) {
        await appointmentsService.complete(appointmentId);
      }

      // Navegar al dashboard con mensaje de éxito
      navigate('/doctor/dashboard', {
        state: { message: 'Consulta registrada exitosamente' },
      });
    } catch (err: any) {
      console.error('Error guardando consulta:', err);
      setError(err.response?.data?.message || 'Error al guardar la consulta');
      setIsSaving(false);
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as Step);
    }
  };

  const steps = [
    {
      number: 1,
      title: 'Signos Vitales',
      icon: Activity,
      description: 'Registra las mediciones',
    },
    {
      number: 2,
      title: 'Diagnóstico',
      icon: ClipboardList,
      description: 'Establece el diagnóstico',
    },
    {
      number: 3,
      title: 'Prescripción',
      icon: Pill,
      description: 'Prescribe medicamentos',
    },
    {
      number: 4,
      title: 'Resumen',
      icon: FileText,
      description: 'Completa los detalles',
    },
  ];

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <Spinner size="lg" text="Cargando información..." />
        </div>
      </DashboardLayout>
    );
  }

  if (!appointmentId && !patientId) {
    return (
      <DashboardLayout>
        <Alert type="error">
          Se requiere un ID de cita o paciente para registrar una consulta.
        </Alert>
        <Button onClick={() => navigate('/doctor/appointments')} className="mt-4">
          Ver Citas
        </Button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
            <h1 className="text-3xl font-bold">Registrar Consulta</h1>
            {patientInfo && (
              <p className="text-base-content/60 mt-1">
                Paciente: {patientInfo.name}
              </p>
            )}
          </div>
          <Badge variant="info" size="lg">
            Paso {currentStep} de 4
          </Badge>
        </div>

        {error && (
          <Alert type="error" closeable onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Stepper */}
        <Card>
          <div className="relative">
            {/* Progress Bar */}
            <div className="absolute top-5 left-0 right-0 h-1 bg-base-300">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>
            </div>

            {/* Steps */}
            <div className="relative grid grid-cols-4 gap-2">
              {steps.map((step) => {
                const Icon = step.icon;
                const isActive = currentStep === step.number;
                const isCompleted = currentStep > step.number;

                return (
                  <div key={step.number} className="flex flex-col items-center">
                    <button
                      onClick={() => {
                        if (step.number < currentStep) {
                          setCurrentStep(step.number as Step);
                        }
                      }}
                      disabled={step.number > currentStep}
                      className={`
                        relative z-10 w-10 h-10 rounded-full flex items-center justify-center
                        transition-all duration-200 mb-2
                        ${
                          isActive
                            ? 'bg-primary text-primary-content ring-4 ring-primary/30 scale-110'
                            : isCompleted
                            ? 'bg-success text-success-content hover:scale-105 cursor-pointer'
                            : 'bg-base-300 text-base-content/50'
                        }
                      `}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Icon className="w-5 h-5" />
                      )}
                    </button>
                    <p
                      className={`text-xs font-medium text-center ${
                        isActive
                          ? 'text-primary'
                          : isCompleted
                          ? 'text-success'
                          : 'text-base-content/50'
                      }`}
                    >
                      {step.title}
                    </p>
                    <p className="text-xs text-base-content/40 text-center hidden md:block">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Form Steps */}
        <Card>
          {currentStep === 1 && (
            <VitalSignsForm
              initialValues={{
                weight: consultationData.weight,
                height: consultationData.height,
                bloodPressureSystolic: consultationData.bloodPressureSystolic,
                bloodPressureDiastolic: consultationData.bloodPressureDiastolic,
                heartRate: consultationData.heartRate,
                temperature: consultationData.temperature,
              }}
              onSubmit={handleStepSubmit}
              onCancel={() => navigate(-1)}
              isLoading={isSaving}
            />
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPreviousStep}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Paso Anterior
              </Button>
              <DiagnosisForm
                initialValues={{
                  diagnosis: consultationData.diagnosis,
                  diagnosisCode: consultationData.diagnosisCode,
                  severity: consultationData.severity as any,
                  treatmentPlan: consultationData.treatmentPlan,
                  observations: consultationData.observations,
                }}
                onSubmit={handleStepSubmit}
                onCancel={goToPreviousStep}
                isLoading={isSaving}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPreviousStep}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Paso Anterior
              </Button>
              <PrescriptionForm
                initialValues={{
                  medications: consultationData.medications || [
                    {
                      name: '',
                      dosage: '',
                      frequency: '',
                      duration: '',
                      instructions: '',
                    },
                  ],
                  generalInstructions: consultationData.generalInstructions,
                  followUpDate: consultationData.followUpDate,
                }}
                onSubmit={handleStepSubmit}
                onCancel={goToPreviousStep}
                isLoading={isSaving}
              />
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPreviousStep}
                className="mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Paso Anterior
              </Button>
              <ConsultationForm
                initialValues={{
                  chiefComplaint: consultationData.chiefComplaint,
                  symptoms: consultationData.symptoms,
                  diagnosis: consultationData.diagnosis,
                  treatmentPlan: consultationData.treatmentPlan,
                  prescriptions: consultationData.prescriptions,
                  followUpInstructions: consultationData.followUpInstructions,
                  notes: consultationData.notes,
                }}
                onSubmit={handleStepSubmit}
                onCancel={goToPreviousStep}
                isLoading={isSaving}
              />
            </div>
          )}
        </Card>

        {/* Summary Card (visible on all steps) */}
        {currentStep > 1 && (
          <Card title="Resumen de la Consulta" className="bg-base-200">
            <div className="space-y-3 text-sm">
              {/* Signos Vitales */}
              {(consultationData.weight || consultationData.height) && (
                <div>
                  <p className="font-semibold text-primary mb-1">Signos Vitales</p>
                  <div className="flex flex-wrap gap-3">
                    {consultationData.weight && (
                      <Badge variant="ghost">Peso: {consultationData.weight} kg</Badge>
                    )}
                    {consultationData.height && (
                      <Badge variant="ghost">Altura: {consultationData.height} cm</Badge>
                    )}
                    {consultationData.bloodPressureSystolic && (
                      <Badge variant="ghost">
                        PA: {consultationData.bloodPressureSystolic}/
                        {consultationData.bloodPressureDiastolic} mmHg
                      </Badge>
                    )}
                    {consultationData.heartRate && (
                      <Badge variant="ghost">FC: {consultationData.heartRate} bpm</Badge>
                    )}
                    {consultationData.temperature && (
                      <Badge variant="ghost">Temp: {consultationData.temperature}°C</Badge>
                    )}
                  </div>
                </div>
              )}

              {/* Diagnóstico */}
              {currentStep > 2 && consultationData.diagnosis && (
                <div>
                  <p className="font-semibold text-warning mb-1">Diagnóstico</p>
                  <p className="text-base-content/70">
                    {consultationData.diagnosis}
                    {consultationData.diagnosisCode && ` (${consultationData.diagnosisCode})`}
                  </p>
                  {consultationData.severity && (
                    <Badge variant="warning" className="mt-1">
                      {consultationData.severity}
                    </Badge>
                  )}
                </div>
              )}

              {/* Prescripción */}
              {currentStep > 3 &&
                consultationData.medications &&
                consultationData.medications.filter((m) => m.name).length > 0 && (
                  <div>
                    <p className="font-semibold text-info mb-1">Prescripción</p>
                    <div className="space-y-1">
                      {consultationData.medications
                        .filter((m) => m.name)
                        .map((med, idx) => (
                          <p key={idx} className="text-base-content/70">
                            • {med.name} - {med.dosage} - {med.frequency}
                          </p>
                        ))}
                    </div>
                  </div>
                )}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}