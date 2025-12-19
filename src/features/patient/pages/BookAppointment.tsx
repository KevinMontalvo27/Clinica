import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Calendar as CalendarIcon,
  User,
  Clock,
  FileText,
  CheckCircle
} from 'lucide-react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Alert } from '../../../components/common';
import { 
  DoctorList, 
  DoctorServices, 
  CalendarView, 
  TimeSlotPicker, 
  AppointmentSummary 
} from '../components';
import { doctorsService, type Doctor } from '../../../api/services/doctors.service';
import { appointmentsService } from '../../../api/services/appointments.service';
import { availabilityService } from '../../../api/services/availability.service';
import { medicalServicesService } from '../../../api/services';
import { useAuth } from '../../../hooks/useAuth';
import * as Yup from 'yup';

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  isActive: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

// Validación para el motivo de consulta
const reasonSchema = Yup.object().shape({
  reasonForVisit: Yup.string()
    .required('El motivo de la consulta es requerido')
    .max(500, 'El motivo no puede exceder 500 caracteres'),
  notes: Yup.string()
    .max(1000, 'Las notas no pueden exceder 1000 caracteres')
    .optional(),
});

type BookingStep = 
  | 'select-doctor' 
  | 'select-service' 
  | 'select-date' 
  | 'select-time' 
  | 'add-reason' 
  | 'confirm' 
  | 'success';

export default function BookAppointment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Estados del wizard
  const [currentStep, setCurrentStep] = useState<BookingStep>('select-doctor');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Datos de la cita
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [notes, setNotes] = useState('');
  const [appointmentId, setAppointmentId] = useState<string | null>(null);

  // Datos para los pasos
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Cargar doctor preseleccionado si viene en URL
  useEffect(() => {
    const doctorId = searchParams.get('doctorId');
    const serviceId = searchParams.get('serviceId');

    if (doctorId) {
      loadPreselectedDoctor(doctorId, serviceId);
    } else {
      loadAvailableDoctors();
    }
  }, [searchParams]);

  const loadPreselectedDoctor = async (doctorId: string, serviceId: string | null) => {
    try {
      setIsLoading(true);
      const doctorData = await doctorsService.getById(doctorId);
      setSelectedDoctor(doctorData);

      const servicesData = await medicalServicesService.getByDoctor(doctorId);
      setServices(servicesData);

      if (serviceId) {
        const service = servicesData.find((s: Service) => s.id === serviceId);
        if (service) {
          setSelectedService(service);
          setCurrentStep('select-date');
        } else {
          setCurrentStep('select-service');
        }
      } else {
        setCurrentStep('select-service');
      }
    } catch (err: any) {
      console.error('Error loading preselected doctor:', err);
      setError(err.message || 'Error al cargar el doctor');
      setCurrentStep('select-doctor');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAvailableDoctors = async () => {
    try {
      setIsLoading(true);
      const doctorsData = await doctorsService.getAvailable();
      setDoctors(doctorsData);
    } catch (err: any) {
      console.error('Error loading doctors:', err);
      setError(err.message || 'Error al cargar los doctores');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDoctorSelect = async (doctorId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const doctorData = await doctorsService.getById(doctorId);
      setSelectedDoctor(doctorData);

      const servicesData = await medicalServicesService.getByDoctor(doctorId);
      setServices(servicesData);

      setCurrentStep('select-service');
    } catch (err: any) {
      console.error('Error loading doctor services:', err);
      setError(err.message || 'Error al cargar los servicios del doctor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceSelect = async (serviceId: string) => {
    const service = services.find((s: Service) => s.id === serviceId);
    if (service) {
      setSelectedService(service);
      
      // Cargar fechas disponibles para este doctor
      if (selectedDoctor) {
        try {
          setIsLoading(true);
          // Asumiendo que hay un endpoint para obtener fechas disponibles
          // Por ahora, generamos fechas de ejemplo
          const dates = generateAvailableDates();
          setAvailableDates(dates);
          setCurrentStep('select-date');
        } catch (err: any) {
          console.error('Error loading available dates:', err);
          setError(err.message || 'Error al cargar fechas disponibles');
        } finally {
          setIsLoading(false);
        }
      }
    }
  };

  const handleDateSelect = async (date: Date) => {
  setSelectedDate(date);
  
  // Cargar horarios disponibles para esta fecha y doctor
  if (selectedDoctor) {
    try {
      setIsLoadingSlots(true);
      setError(null);

      const dateString = date.toISOString().split('T')[0];
      const duration = selectedService?.duration || 30;
      
      const response = await availabilityService.getAvailableSlots(
        selectedDoctor.id,
        dateString,
        duration
      );

      // Extraer los slots del objeto de respuesta
      const slotsArray = Array.isArray(response) ? response : (response.slots || []);
      
      setTimeSlots(slotsArray);
      setCurrentStep('select-time');
    } catch (err: any) {
      console.error('Error loading time slots:', err);
      setError(err.message || 'Error al cargar horarios disponibles');
      setTimeSlots([]);
    } finally {
      setIsLoadingSlots(false);
    }
  }
};

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setCurrentStep('add-reason');
  };

  const handleReasonSubmit = (values: any) => {
    setReasonForVisit(values.reasonForVisit);
    setNotes(values.notes || '');
    setCurrentStep('confirm');
  };

  const handleConfirmAppointment = async () => {
  if (!selectedDoctor || !selectedService || !selectedDate || !selectedTime || !user) {
    setError('Falta información para crear la cita');
    return;
  }

  try {
    setIsLoading(true);
    setError(null);

    // Obtener el patientId desde el usuario
    const patient = await import('../../../api/services/patients.service')
      .then(module => module.patientsService.getByUserId(user.id));

    // Asegurar formato HH:MM (sin segundos)
    const timeFormatted = selectedTime.length === 5 
      ? selectedTime 
      : selectedTime.substring(0, 5);

    const appointmentData = {
      patientId: patient.id,
      doctorId: selectedDoctor.id,
      serviceId: selectedService.id,
      appointmentDate: selectedDate.toISOString().split('T')[0],
      appointmentTime: timeFormatted, // HH:MM format
      duration: selectedService.duration,
      reasonForVisit: reasonForVisit, // Cambiar de 'reason' a 'reasonForVisit'
      ...(notes && { notes }), // Solo incluir si tiene valor
    };

    console.log('Appointment data:', appointmentData); // Para debug

    const appointment = await appointmentsService.create(appointmentData);
    setAppointmentId(appointment.id);
    setCurrentStep('success');
  } catch (err: any) {
    console.error('Error creating appointment:', err);
    console.error('Error response:', err.response?.data);
    
    // Mostrar mensaje de error específico
    const errorMessage = err.response?.data?.message 
      || err.response?.data?.error
      || (Array.isArray(err.response?.data?.message) 
          ? err.response.data.message.join(', ')
          : err.message)
      || 'Error al crear la cita';
    
    setError(errorMessage);
  } finally {
    setIsLoading(false);
  }
};

  const handleGoBack = () => {
    const steps: BookingStep[] = [
      'select-doctor',
      'select-service',
      'select-date',
      'select-time',
      'add-reason',
      'confirm'
    ];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    } else {
      navigate(-1);
    }
  };

  const generateAvailableDates = (): Date[] => {
    // Generar fechas disponibles para los próximos 30 días (ejemplo)
    const dates: Date[] = [];
    const today = new Date();
    
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Excluir domingos (ejemplo)
      if (date.getDay() !== 0) {
        dates.push(date);
      }
    }
    
    return dates;
  };

  // Renderizar el paso actual
  const renderStep = () => {
    switch (currentStep) {
      case 'select-doctor':
        return (
          <div className="space-y-6">
            <div className="bg-base-100 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-2">Selecciona un Doctor</h2>
              <p className="text-base-content/70">
                Elige al especialista con quien deseas agendar tu cita
              </p>
            </div>

            <DoctorList
              doctors={doctors}
              isLoading={isLoading}
              onViewProfile={(id) => navigate(`/patient/doctors/${id}`)}
              onBookAppointment={handleDoctorSelect}
            />
          </div>
        );

      case 'select-service':
        return (
          <div className="space-y-6">
            <div className="bg-base-100 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-2">Selecciona un Servicio</h2>
              <p className="text-base-content/70">
                ¿Qué tipo de consulta necesitas con{' '}
                {selectedDoctor && `Dr. ${selectedDoctor.user.firstName} ${selectedDoctor.user.lastName}`}?
              </p>
            </div>

            <DoctorServices
              services={services}
              selectedServiceId={selectedService?.id}
              onSelectService={handleServiceSelect}
            />

            {services.filter((s: Service) => s.isActive).length === 0 && (
              <Alert type="info">
                Este doctor no tiene servicios disponibles en este momento.
              </Alert>
            )}
          </div>
        );

      case 'select-date':
        return (
          <div className="space-y-6">
            <div className="bg-base-100 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-2">Selecciona una Fecha</h2>
              <p className="text-base-content/70">
                Elige el día en que deseas tu consulta
              </p>
            </div>

            <CalendarView
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
              availableDates={availableDates}
            />
          </div>
        );

      case 'select-time':
        return (
          <div className="space-y-6">
            <div className="bg-base-100 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-2">Selecciona un Horario</h2>
              <p className="text-base-content/70">
                Elige la hora más conveniente para tu cita
              </p>
            </div>

            <TimeSlotPicker
              slots={timeSlots}
              selectedTime={selectedTime}
              onTimeSelect={handleTimeSelect}
              isLoading={isLoadingSlots}
            />
          </div>
        );

      case 'add-reason':
        return (
          <div className="space-y-6">
            <div className="bg-base-100 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-2">Motivo de la Consulta</h2>
              <p className="text-base-content/70">
                Ayúdanos a entender mejor tu necesidad médica
              </p>
            </div>

            <div className="bg-base-100 rounded-lg shadow-sm p-6">
              <Formik
                initialValues={{ reasonForVisit: '', notes: '' }}
                validationSchema={reasonSchema}
                onSubmit={handleReasonSubmit}
              >
                {({ isValid, dirty }) => (
                  <Form className="space-y-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Motivo de la consulta <span className="text-error">*</span>
                        </span>
                      </label>
                      <Field
                        as="textarea"
                        name="reasonForVisit"
                        placeholder="Describe brevemente el motivo de tu visita..."
                        className="textarea textarea-bordered h-32"
                      />
                      <ErrorMessage
                        name="reasonForVisit"
                        component="div"
                        className="text-error text-sm mt-1"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">
                          Notas adicionales (opcional)
                        </span>
                      </label>
                      <Field
                        as="textarea"
                        name="notes"
                        placeholder="Información adicional que consideres relevante..."
                        className="textarea textarea-bordered h-24"
                      />
                      <ErrorMessage
                        name="notes"
                        component="div"
                        className="text-error text-sm mt-1"
                      />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={handleGoBack}
                        className="btn btn-ghost gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Atrás
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary gap-2"
                        disabled={!isValid || !dirty}
                      >
                        Continuar
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        );

      case 'confirm':
        return (
          <div className="space-y-6">
            <div className="bg-base-100 rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold mb-2">Confirmar Cita</h2>
              <p className="text-base-content/70">
                Revisa los detalles de tu cita antes de confirmar
              </p>
            </div>

            <AppointmentSummary
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              duration={selectedService?.duration || 30}
              doctor={selectedDoctor || undefined}
              service={selectedService || undefined}
              reasonForVisit={reasonForVisit}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={handleGoBack}
                className="btn btn-ghost gap-2"
                disabled={isLoading}
              >
                <ArrowLeft className="w-4 h-4" />
                Atrás
              </button>
              <button
                onClick={handleConfirmAppointment}
                className="btn btn-primary gap-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Confirmar Cita
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 'success':
        return (
          <div className="max-w-2xl mx-auto">
            <div className="bg-base-100 rounded-lg shadow-lg p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-success" />
              </div>
              
              <h2 className="text-3xl font-bold mb-3">¡Cita Agendada!</h2>
              <p className="text-lg text-base-content/70 mb-6">
                Tu cita ha sido confirmada exitosamente
              </p>

              <div className="bg-base-200 rounded-lg p-6 mb-6">
                <AppointmentSummary
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  duration={selectedService?.duration || 30}
                  doctor={selectedDoctor || undefined}
                  service={selectedService || undefined}
                  reasonForVisit={reasonForVisit}
                />
              </div>

              <div className="alert alert-info mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="stroke-current shrink-0 w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">
                  Recibirás un correo de confirmación con los detalles de tu cita.
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate('/patient/appointments')}
                  className="btn btn-primary"
                >
                  Ver Mis Citas
                </button>
                <button
                  onClick={() => navigate('/patient/dashboard')}
                  className="btn btn-outline"
                >
                  Ir al Dashboard
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  // Indicador de progreso
  const steps = [
    { key: 'select-doctor', label: 'Doctor', icon: User },
    { key: 'select-service', label: 'Servicio', icon: FileText },
    { key: 'select-date', label: 'Fecha', icon: CalendarIcon },
    { key: 'select-time', label: 'Hora', icon: Clock },
    { key: 'add-reason', label: 'Motivo', icon: FileText },
    { key: 'confirm', label: 'Confirmar', icon: Check },
  ];

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);

  return (
    <div className="space-y-6">
      {/* Header con progreso */}
      {currentStep !== 'success' && (
        <>
          <div className="bg-base-100 rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Agendar Nueva Cita</h1>
              <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm gap-2">
                <ArrowLeft className="w-4 h-4" />
                Cancelar
              </button>
            </div>

            {/* Progress bar */}
            <div className="flex items-center justify-between">
              {steps.map((step, index) => {
                const StepIcon = step.icon;
                const isActive = index === currentStepIndex;
                const isCompleted = index < currentStepIndex;

                return (
                  <div key={step.key} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center mb-2
                          ${isCompleted ? 'bg-success text-success-content' : ''}
                          ${isActive ? 'bg-primary text-primary-content' : ''}
                          ${!isActive && !isCompleted ? 'bg-base-300 text-base-content/50' : ''}
                        `}
                      >
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <StepIcon className="w-5 h-5" />
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium hidden sm:block ${
                          isActive ? 'text-primary' : 'text-base-content/60'
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`h-1 flex-1 mx-2 ${
                          isCompleted ? 'bg-success' : 'bg-base-300'
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* Error Alert */}
      {error && (
        <Alert type="error" title="Error" closeable onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Contenido del paso actual */}
      {renderStep()}
    </div>
  );
}