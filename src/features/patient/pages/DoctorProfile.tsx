import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Stethoscope, 
  Award, 
  Calendar, 
  Clock, 
  DollarSign, 
  Mail, 
  Phone,
  ArrowLeft,
  Star
} from 'lucide-react';
import { Alert } from '../../../components/common';
import { DoctorServices } from '../components';
import { doctorsService, type Doctor } from '../../../api/services/doctors.service';
import { medicalServicesService } from '../../../api/services';
import PatientNavbar from '../../../components/layouts/PatientNavBar';

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  isActive: boolean;
}

export default function PatientDoctorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadDoctorProfile(id);
    }
  }, [id]);

  const loadDoctorProfile = async (doctorId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      // Cargar información del doctor y sus servicios
      const [doctorData, servicesData] = await Promise.all([
        doctorsService.getById(doctorId),
        medicalServicesService.getByDoctor(doctorId),
      ]);

      setDoctor(doctorData);
      setServices(servicesData);
    } catch (err: any) {
      console.error('Error loading doctor profile:', err);
      setError(err.message || 'Error al cargar el perfil del doctor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookAppointment = () => {
    if (!id) return;
    
    const url = selectedServiceId 
      ? `/patient/book-appointment?doctorId=${id}&serviceId=${selectedServiceId}`
      : `/patient/book-appointment?doctorId=${id}`;
    
    navigate(url);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-lg text-base-content/70">Cargando perfil del doctor...</p>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="space-y-6">
        <button onClick={handleGoBack} className="btn btn-ghost gap-2">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </button>
        <Alert type="error" title="Error">
          {error || 'No se pudo cargar el perfil del doctor'}
        </Alert>
      </div>
    );
  }

  const doctorName = `Dr. ${doctor.user.firstName} ${doctor.user.lastName}`;
  const initials = `${doctor.user.firstName[0]}${doctor.user.lastName[0]}`.toUpperCase();
  const consultationPrice = doctor.consultationPrice || doctor.specialty.basePrice;

  return (
    
    <div className="space-y-6">
      {/* Botón volver */}
      <button onClick={handleGoBack} className="btn btn-ghost gap-2">
        <ArrowLeft className="w-4 h-4" />
        Volver a resultados
      </button>

      {/* Header del perfil */}
      <div className="bg-base-100 rounded-lg shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>

        {/* Información principal */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row gap-6 -mt-20 md:-mt-16">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {doctor.profileImageUrl ? (
                <img
                  src={doctor.profileImageUrl}
                  alt={doctorName}
                  className="w-32 h-32 rounded-full border-4 border-base-100 shadow-lg object-cover"
                />
              ) : (
                <div className="w-32 h-32 rounded-full border-4 border-base-100 shadow-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl font-bold text-primary">{initials}</span>
                </div>
              )}
            </div>

            {/* Información del doctor */}
            <div className="flex-1 mt-16 md:mt-8">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-base-content mb-2">
                    {doctorName}
                  </h1>
                  
                  <div className="flex flex-wrap gap-4 text-base-content/70 mb-4">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-5 h-5 text-primary" />
                      <span className="font-medium">{doctor.specialty.name}</span>
                    </div>
                    
                    {doctor.yearsExperience && doctor.yearsExperience > 0 && (
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-warning" />
                        <span>{doctor.yearsExperience} años de experiencia</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className={`badge ${doctor.isAvailable ? 'badge-success' : 'badge-error'} gap-2`}>
                      <div className="w-2 h-2 rounded-full bg-current"></div>
                      {doctor.isAvailable ? 'Disponible' : 'No disponible'}
                    </div>
                  </div>

                  {/* Información de contacto */}
                  <div className="space-y-2 text-sm">
                    {doctor.user.email && (
                      <div className="flex items-center gap-2 text-base-content/70">
                        <Mail className="w-4 h-4" />
                        <span>{doctor.user.email}</span>
                      </div>
                    )}
                    {doctor.user.phone && (
                      <div className="flex items-center gap-2 text-base-content/70">
                        <Phone className="w-4 h-4" />
                        <span>{doctor.user.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Precio de consulta */}
                <div className="bg-success/10 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-success" />
                    <span className="text-sm text-base-content/70">Consulta desde</span>
                  </div>
                  <p className="text-3xl font-bold text-success">${consultationPrice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biografía */}
      {doctor.biography && (
        <div className="bg-base-100 rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Sobre el doctor
          </h2>
          <p className="text-base-content/80 whitespace-pre-line leading-relaxed">
            {doctor.biography}
          </p>
        </div>
      )}

      {/* Grid con información adicional */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cédula profesional */}
        <div className="bg-base-100 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-info" />
            </div>
            <div>
              <p className="text-sm text-base-content/60">Cédula Profesional</p>
              <p className="font-bold">{doctor.licenseNumber}</p>
            </div>
          </div>
        </div>

        {/* Especialidad */}
        <div className="bg-base-100 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-base-content/60">Especialidad</p>
              <p className="font-bold">{doctor.specialty.name}</p>
            </div>
          </div>
        </div>

        {/* Experiencia */}
        {doctor.yearsExperience && doctor.yearsExperience > 0 && (
          <div className="bg-base-100 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-base-content/60">Experiencia</p>
                <p className="font-bold">{doctor.yearsExperience} años</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Servicios disponibles */}
      {services.length > 0 && (
        <DoctorServices
          services={services}
          selectedServiceId={selectedServiceId}
          onSelectService={setSelectedServiceId}
        />
      )}

      {/* Botón de agendar cita */}
      <div className="bg-base-100 rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center flex-shrink-0">
              <Calendar className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="font-bold mb-1">¿Listo para agendar una cita?</h3>
              <p className="text-sm text-base-content/70">
                {selectedServiceId 
                  ? 'Has seleccionado un servicio. Haz clic para continuar.'
                  : 'Selecciona un servicio arriba o agenda una consulta general.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleBookAppointment}
            disabled={!doctor.isAvailable}
            className="btn btn-primary gap-2 w-full md:w-auto"
          >
            <Calendar className="w-5 h-5" />
            Agendar Cita
          </button>
        </div>
      </div>

      {/* Información adicional */}
      <div className="bg-info/5 border-2 border-info/20 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-info/10 flex items-center justify-center flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-info"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold mb-2">Información importante</h3>
            <ul className="text-sm text-base-content/70 space-y-1">
              <li>• Por favor llega 10 minutos antes de tu cita</li>
              <li>• Trae tu identificación oficial y tarjeta de seguro (si aplica)</li>
              <li>• Si necesitas cancelar, hazlo con al menos 24 horas de anticipación</li>
              <li>• Los precios pueden variar según el tipo de consulta</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}