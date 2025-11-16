// src/features/doctor/pages/DoctorProfile.tsx
import { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string, number as yupNumber } from 'yup';
import { User, Mail, Phone, Briefcase, GraduationCap, Award, DollarSign, FileText, Camera, Save } from 'lucide-react';
import DashboardLayout from '../../../components/layouts/DashboardLayout';
import { Card, Button, Alert, Spinner, Avatar } from '../../../components/common';
import { useAuthStore } from '../../../store/authStore';
import { doctorsService } from '../../../api/services/doctors.service';
import type { Doctor } from '../../../api/services/doctors.service';

const profileSchema = object({
  firstName: string()
    .required('El nombre es requerido')
    .min(2, 'Mínimo 2 caracteres'),
  lastName: string()
    .required('El apellido es requerido')
    .min(2, 'Mínimo 2 caracteres'),
  phone: string()
    .matches(/^\+?[0-9\s-]+$/, 'Teléfono inválido'),
  licenseNumber: string()
    .required('La cédula profesional es requerida'),
  yearsExperience: yupNumber()
    .min(0, 'Debe ser mayor o igual a 0')
    .max(70, 'Debe ser menor a 70'),
  education: string()
    .max(500, 'Máximo 500 caracteres'),
  certifications: string()
    .max(500, 'Máximo 500 caracteres'),
  consultationPrice: yupNumber()
    .min(0, 'Debe ser mayor o igual a 0'),
  biography: string()
    .max(1000, 'Máximo 1000 caracteres'),
});

export default function DoctorProfile() {
  const { user } = useAuthStore();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'professional' | 'billing'>('personal');

  useEffect(() => {
    loadDoctorProfile();
  }, [user]);

  const loadDoctorProfile = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await doctorsService.getByUserId(user.id);
      setDoctor(data);
    } catch (err: any) {
      console.error('Error cargando perfil:', err);
      setError(err.response?.data?.message || 'Error al cargar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    if (!doctor) return;

    try {
      setIsSaving(true);
      setError(null);
      
      await doctorsService.update(doctor.id, {
        yearsExperience: values.yearsExperience,
        education: values.education,
        certifications: values.certifications,
        consultationPrice: values.consultationPrice,
        biography: values.biography,
      });

      setSuccess('Perfil actualizado correctamente');
      await loadDoctorProfile();
    } catch (err: any) {
      console.error('Error actualizando perfil:', err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-12">
          <Spinner size="lg" text="Cargando perfil..." />
        </div>
      </DashboardLayout>
    );
  }

  if (!doctor) {
    return (
      <DashboardLayout>
        <Alert type="error">No se pudo cargar el perfil del doctor</Alert>
      </DashboardLayout>
    );
  }

  const initialValues = {
    firstName: doctor.user.firstName,
    lastName: doctor.user.lastName,
    email: doctor.user.email,
    phone: doctor.user.phone || '',
    licenseNumber: doctor.licenseNumber,
    yearsExperience: doctor.yearsExperience || 0,
    education: doctor.education || '',
    certifications: doctor.certifications || '',
    consultationPrice: doctor.consultationPrice || 0,
    biography: doctor.biography || '',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Mi Perfil</h1>
          <p className="text-base-content/60 mt-1">
            Administra tu información profesional
          </p>
        </div>

        {error && (
          <Alert type="error" closeable onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert type="success" closeable onClose={() => setSuccess(null)}>
            {success}
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Foto y Info Básica */}
          <div className="lg:col-span-1">
            <Card>
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div className="relative">
                    <Avatar
                      src={doctor.profileImageUrl}
                      alt={`${doctor.user.firstName} ${doctor.user.lastName}`}
                      size="xl"
                      placeholder={`${doctor.user.firstName[0]}${doctor.user.lastName[0]}`}
                    />
                    <button className="absolute bottom-0 right-0 btn btn-circle btn-sm btn-primary">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="font-bold text-lg mt-4 text-center">
                    Dr. {doctor.user.firstName} {doctor.user.lastName}
                  </h3>
                  <p className="text-sm text-base-content/60 text-center">
                    {doctor.specialty.name}
                  </p>
                  <div className="badge badge-success mt-2">
                    {doctor.isAvailable ? 'Disponible' : 'No disponible'}
                  </div>
                </div>

                {/* Info rápida */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-base-content/70">
                    <Award className="w-4 h-4" />
                    <span>{doctor.yearsExperience || 0} años de experiencia</span>
                  </div>
                  <div className="flex items-center gap-2 text-base-content/70">
                    <Briefcase className="w-4 h-4" />
                    <span>Cédula: {doctor.licenseNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-base-content/70">
                    <DollarSign className="w-4 h-4" />
                    <span>
                      Consulta: ${doctor.consultationPrice || doctor.specialty.basePrice}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content - Formulario */}
          <div className="lg:col-span-3">
            <Card>
              {/* Tabs */}
              <div className="tabs tabs-boxed mb-6">
                <button
                  className={`tab ${activeTab === 'personal' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('personal')}
                >
                  <User className="w-4 h-4 mr-2" />
                  Personal
                </button>
                <button
                  className={`tab ${activeTab === 'professional' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('professional')}
                >
                  <Briefcase className="w-4 h-4 mr-2" />
                  Profesional
                </button>
                <button
                  className={`tab ${activeTab === 'billing' ? 'tab-active' : ''}`}
                  onClick={() => setActiveTab('billing')}
                >
                  <DollarSign className="w-4 h-4 mr-2" />
                  Facturación
                </button>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={profileSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ errors, touched }) => (
                  <Form className="space-y-6">
                    {/* Tab: Personal */}
                    {activeTab === 'personal' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-medium">Nombre</span>
                            </label>
                            <Field
                              name="firstName"
                              className="input input-bordered"
                              disabled
                            />
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-medium">Apellido</span>
                            </label>
                            <Field
                              name="lastName"
                              className="input input-bordered"
                              disabled
                            />
                          </div>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Email
                            </span>
                          </label>
                          <Field
                            name="email"
                            type="email"
                            className="input input-bordered"
                            disabled
                          />
                          <label className="label">
                            <span className="label-text-alt">
                              Para cambiar tu email, contacta al administrador
                            </span>
                          </label>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                              <Phone className="w-4 h-4" />
                              Teléfono
                            </span>
                          </label>
                          <Field
                            name="phone"
                            className="input input-bordered"
                            disabled
                          />
                        </div>
                      </div>
                    )}

                    {/* Tab: Professional */}
                    {activeTab === 'professional' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-medium">Cédula Profesional</span>
                            </label>
                            <Field
                              name="licenseNumber"
                              className="input input-bordered"
                              disabled
                            />
                          </div>

                          <div className="form-control">
                            <label className="label">
                              <span className="label-text font-medium flex items-center gap-2">
                                <Award className="w-4 h-4" />
                                Años de Experiencia
                              </span>
                            </label>
                            <Field
                              name="yearsExperience"
                              type="number"
                              className={`input input-bordered ${
                                errors.yearsExperience && touched.yearsExperience ? 'input-error' : ''
                              }`}
                            />
                            <ErrorMessage name="yearsExperience">
                              {(msg) => (
                                <label className="label">
                                  <span className="label-text-alt text-error">{msg}</span>
                                </label>
                              )}
                            </ErrorMessage>
                          </div>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                              <GraduationCap className="w-4 h-4" />
                              Educación
                            </span>
                          </label>
                          <Field
                            as="textarea"
                            name="education"
                            placeholder="Ej: Universidad Nacional, Especialidad en..."
                            className={`textarea textarea-bordered h-24 resize-none ${
                              errors.education && touched.education ? 'textarea-error' : ''
                            }`}
                          />
                          <ErrorMessage name="education">
                            {(msg) => (
                              <label className="label">
                                <span className="label-text-alt text-error">{msg}</span>
                              </label>
                            )}
                          </ErrorMessage>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                              <Award className="w-4 h-4" />
                              Certificaciones
                            </span>
                          </label>
                          <Field
                            as="textarea"
                            name="certifications"
                            placeholder="Lista tus certificaciones y reconocimientos..."
                            className={`textarea textarea-bordered h-24 resize-none ${
                              errors.certifications && touched.certifications ? 'textarea-error' : ''
                            }`}
                          />
                          <ErrorMessage name="certifications">
                            {(msg) => (
                              <label className="label">
                                <span className="label-text-alt text-error">{msg}</span>
                              </label>
                            )}
                          </ErrorMessage>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                              <FileText className="w-4 h-4" />
                              Biografía
                            </span>
                          </label>
                          <Field
                            as="textarea"
                            name="biography"
                            placeholder="Cuéntanos sobre ti y tu práctica médica..."
                            className={`textarea textarea-bordered h-32 resize-none ${
                              errors.biography && touched.biography ? 'textarea-error' : ''
                            }`}
                          />
                          <ErrorMessage name="biography">
                            {(msg) => (
                              <label className="label">
                                <span className="label-text-alt text-error">{msg}</span>
                              </label>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>
                    )}

                    {/* Tab: Billing */}
                    {activeTab === 'billing' && (
                      <div className="space-y-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                              <DollarSign className="w-4 h-4" />
                              Precio de Consulta (MXN)
                            </span>
                          </label>
                          <Field
                            name="consultationPrice"
                            type="number"
                            step="50"
                            className={`input input-bordered ${
                              errors.consultationPrice && touched.consultationPrice ? 'input-error' : ''
                            }`}
                          />
                          <label className="label">
                            <span className="label-text-alt">
                              Precio base de tu especialidad: ${doctor.specialty.basePrice}
                            </span>
                          </label>
                          <ErrorMessage name="consultationPrice">
                            {(msg) => (
                              <label className="label">
                                <span className="label-text-alt text-error">{msg}</span>
                              </label>
                            )}
                          </ErrorMessage>
                        </div>

                        <div className="alert alert-info">
                          <span className="text-sm">
                            💡 Este precio se aplicará como predeterminado para nuevos servicios.
                            Puedes personalizarlo en cada servicio individual.
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Botones */}
                    <div className="flex gap-3 justify-end pt-4 border-t">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => window.location.reload()}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <span className="loading loading-spinner loading-sm mr-2"></span>
                            Guardando...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Guardar Cambios
                          </>
                        )}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}