// src/features/doctor/components/ConsultationForm.tsx
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { FileText, Activity, Pill, ClipboardList, AlertCircle } from 'lucide-react';
import { Button, Alert } from '../../../components/common';

interface ConsultationFormValues {
  chiefComplaint: string;
  symptoms: string;
  diagnosis: string;
  treatmentPlan: string;
  prescriptions: string;
  followUpInstructions: string;
  notes: string;
}

interface ConsultationFormProps {
  initialValues?: Partial<ConsultationFormValues>;
  onSubmit: (values: ConsultationFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

const consultationSchema = object({
  chiefComplaint: string()
    .required('El motivo de consulta es requerido')
    .min(10, 'Describe el motivo con más detalle (mínimo 10 caracteres)')
    .max(500, 'Máximo 500 caracteres'),
  symptoms: string()
    .required('Los síntomas son requeridos')
    .min(10, 'Describe los síntomas con más detalle')
    .max(1000, 'Máximo 1000 caracteres'),
  diagnosis: string()
    .required('El diagnóstico es requerido')
    .min(5, 'El diagnóstico debe ser más descriptivo')
    .max(500, 'Máximo 500 caracteres'),
  treatmentPlan: string()
    .required('El plan de tratamiento es requerido')
    .min(10, 'Describe el tratamiento con más detalle')
    .max(1000, 'Máximo 1000 caracteres'),
  prescriptions: string()
    .max(1000, 'Máximo 1000 caracteres'),
  followUpInstructions: string()
    .max(500, 'Máximo 500 caracteres'),
  notes: string()
    .max(1000, 'Máximo 1000 caracteres'),
});

export default function ConsultationForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
  className = '',
}: ConsultationFormProps) {
  const defaultValues: ConsultationFormValues = {
    chiefComplaint: '',
    symptoms: '',
    diagnosis: '',
    treatmentPlan: '',
    prescriptions: '',
    followUpInstructions: '',
    notes: '',
    ...initialValues,
  };

  return (
    <div className={className}>
      <Alert type="info" className="mb-6">
        <AlertCircle className="w-5 h-5" />
        <div className="text-sm">
          <p className="font-semibold">Registro de Consulta Médica</p>
          <p>Completa todos los campos requeridos para crear el expediente de la consulta</p>
        </div>
      </Alert>

      <Formik
        initialValues={defaultValues}
        validationSchema={consultationSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Motivo de Consulta */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" />
                  Motivo de Consulta *
                </span>
              </label>
              <Field
                as="textarea"
                name="chiefComplaint"
                placeholder="Ej: Dolor abdominal agudo, Fiebre persistente..."
                className={`textarea textarea-bordered w-full h-24 resize-none ${
                  errors.chiefComplaint && touched.chiefComplaint ? 'textarea-error' : ''
                }`}
              />
              <ErrorMessage name="chiefComplaint">
                {(msg) => (
                  <label className="label">
                    <span className="label-text-alt text-error flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {msg}
                    </span>
                  </label>
                )}
              </ErrorMessage>
            </div>

            {/* Síntomas */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4 text-error" />
                  Síntomas Presentados *
                </span>
              </label>
              <Field
                as="textarea"
                name="symptoms"
                placeholder="Describe los síntomas que presenta el paciente: inicio, duración, intensidad, factores que mejoran o empeoran..."
                className={`textarea textarea-bordered w-full h-32 resize-none ${
                  errors.symptoms && touched.symptoms ? 'textarea-error' : ''
                }`}
              />
              <ErrorMessage name="symptoms">
                {(msg) => (
                  <label className="label">
                    <span className="label-text-alt text-error flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {msg}
                    </span>
                  </label>
                )}
              </ErrorMessage>
            </div>

            {/* Diagnóstico */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-warning" />
                  Diagnóstico *
                </span>
              </label>
              <Field
                as="textarea"
                name="diagnosis"
                placeholder="Diagnóstico médico con código CIE-10 si aplica..."
                className={`textarea textarea-bordered w-full h-24 resize-none ${
                  errors.diagnosis && touched.diagnosis ? 'textarea-error' : ''
                }`}
              />
              <ErrorMessage name="diagnosis">
                {(msg) => (
                  <label className="label">
                    <span className="label-text-alt text-error flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {msg}
                    </span>
                  </label>
                )}
              </ErrorMessage>
            </div>

            {/* Plan de Tratamiento */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Pill className="w-4 h-4 text-success" />
                  Plan de Tratamiento *
                </span>
              </label>
              <Field
                as="textarea"
                name="treatmentPlan"
                placeholder="Describe el plan de tratamiento: medicamentos, terapias, cambios en el estilo de vida, recomendaciones..."
                className={`textarea textarea-bordered w-full h-32 resize-none ${
                  errors.treatmentPlan && touched.treatmentPlan ? 'textarea-error' : ''
                }`}
              />
              <ErrorMessage name="treatmentPlan">
                {(msg) => (
                  <label className="label">
                    <span className="label-text-alt text-error flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {msg}
                    </span>
                  </label>
                )}
              </ErrorMessage>
            </div>

            {/* Prescripciones */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Pill className="w-4 h-4 text-info" />
                  Prescripciones (Opcional)
                </span>
              </label>
              <Field
                as="textarea"
                name="prescriptions"
                placeholder="Lista de medicamentos prescritos con dosis, frecuencia y duración..."
                className={`textarea textarea-bordered w-full h-28 resize-none ${
                  errors.prescriptions && touched.prescriptions ? 'textarea-error' : ''
                }`}
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Formato sugerido: Medicamento - Dosis - Frecuencia - Duración
                </span>
              </label>
              <ErrorMessage name="prescriptions">
                {(msg) => (
                  <label className="label">
                    <span className="label-text-alt text-error">{msg}</span>
                  </label>
                )}
              </ErrorMessage>
            </div>

            {/* Instrucciones de Seguimiento */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-accent" />
                  Instrucciones de Seguimiento (Opcional)
                </span>
              </label>
              <Field
                as="textarea"
                name="followUpInstructions"
                placeholder="Indicaciones para el paciente: cuándo regresar, signos de alarma, cuidados en casa..."
                className={`textarea textarea-bordered w-full h-24 resize-none ${
                  errors.followUpInstructions && touched.followUpInstructions ? 'textarea-error' : ''
                }`}
              />
              <ErrorMessage name="followUpInstructions">
                {(msg) => (
                  <label className="label">
                    <span className="label-text-alt text-error">{msg}</span>
                  </label>
                )}
              </ErrorMessage>
            </div>

            {/* Notas Adicionales */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-base-content/60" />
                  Notas Adicionales (Opcional)
                </span>
              </label>
              <Field
                as="textarea"
                name="notes"
                placeholder="Observaciones adicionales del médico..."
                className={`textarea textarea-bordered w-full h-24 resize-none ${
                  errors.notes && touched.notes ? 'textarea-error' : ''
                }`}
              />
              <ErrorMessage name="notes">
                {(msg) => (
                  <label className="label">
                    <span className="label-text-alt text-error">{msg}</span>
                  </label>
                )}
              </ErrorMessage>
            </div>

            {/* Botones */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              {onCancel && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  disabled={isSubmitting || isLoading}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting || isLoading ? (
                  <>
                    <span className="loading loading-spinner loading-sm mr-2"></span>
                    Guardando Consulta...
                  </>
                ) : (
                  'Guardar Consulta'
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}