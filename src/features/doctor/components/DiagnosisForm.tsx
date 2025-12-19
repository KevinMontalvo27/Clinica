import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { ClipboardList, AlertTriangle, FileText, AlertCircle } from 'lucide-react';
import { Button, Alert, Badge } from '../../../components/common';
import { useState } from 'react';

interface DiagnosisFormValues {
  diagnosis: string;
  diagnosisCode?: string;
  severity: 'LEVE' | 'MODERADA' | 'GRAVE' | 'CRÍTICA';
  treatmentPlan: string;
  observations: string;
}

interface DiagnosisFormProps {
  initialValues?: Partial<DiagnosisFormValues>;
  onSubmit: (values: DiagnosisFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

const diagnosisSchema = object({
  diagnosis: string()
    .required('El diagnóstico es requerido')
    .min(5, 'El diagnóstico debe ser más descriptivo (mínimo 5 caracteres)')
    .max(500, 'Máximo 500 caracteres'),
  diagnosisCode: string()
    .matches(/^[A-Z]\d{2}(\.\d{1,2})?$/, 'Formato inválido. Ejemplo: A00, J11.1')
    .max(10, 'Máximo 10 caracteres'),
  severity: string()
    .required('La severidad es requerida')
    .oneOf(['LEVE', 'MODERADA', 'GRAVE', 'CRÍTICA'], 'Selecciona una opción válida'),
  treatmentPlan: string()
    .required('El plan de tratamiento es requerido')
    .min(10, 'Describe el tratamiento con más detalle (mínimo 10 caracteres)')
    .max(1000, 'Máximo 1000 caracteres'),
  observations: string()
    .max(500, 'Máximo 500 caracteres'),
});

const commonDiagnoses = [
  { name: 'Infección Respiratoria Aguda', code: 'J06.9' },
  { name: 'Gastroenteritis', code: 'K52.9' },
  { name: 'Hipertensión Arterial', code: 'I10' },
  { name: 'Diabetes Mellitus Tipo 2', code: 'E11' },
  { name: 'Cefalea', code: 'R51' },
  { name: 'Faringitis Aguda', code: 'J02.9' },
  { name: 'Dermatitis', code: 'L30.9' },
  { name: 'Dolor Abdominal', code: 'R10.4' },
];

export default function DiagnosisForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
  className = '',
}: DiagnosisFormProps) {
  const [showCommonDiagnoses, setShowCommonDiagnoses] = useState(false);

  const defaultValues: DiagnosisFormValues = {
    diagnosis: '',
    diagnosisCode: '',
    severity: 'LEVE',
    treatmentPlan: '',
    observations: '',
    ...initialValues,
  };

  const severityConfig = {
    LEVE: {
      label: 'Leve',
      color: 'badge-success',
      description: 'Condición menor que no requiere intervención urgente',
      icon: '🟢',
    },
    MODERADA: {
      label: 'Moderada',
      color: 'badge-warning',
      description: 'Requiere atención y seguimiento médico',
      icon: '🟡',
    },
    GRAVE: {
      label: 'Grave',
      color: 'badge-error',
      description: 'Condición seria que requiere tratamiento inmediato',
      icon: '🟠',
    },
    CRÍTICA: {
      label: 'Crítica',
      color: 'badge-error',
      description: 'Emergencia médica que pone en riesgo la vida',
      icon: '🔴',
    },
  };

  return (
    <div className={className}>
      <Alert type="warning" className="mb-6">
        <AlertTriangle className="w-5 h-5" />
        <div className="text-sm">
          <p className="font-semibold">Diagnóstico Médico</p>
          <p>
            Establece el diagnóstico basado en los síntomas y signos vitales del paciente.
            Usa códigos CIE-10 cuando sea posible.
          </p>
        </div>
      </Alert>

      <Formik
        initialValues={defaultValues}
        validationSchema={diagnosisSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue, values }) => (
          <Form className="space-y-6">
            {/* Diagnóstico Principal */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-primary" />
                  Diagnóstico Principal *
                </span>
                <button
                  type="button"
                  onClick={() => setShowCommonDiagnoses(!showCommonDiagnoses)}
                  className="label-text-alt link link-primary"
                >
                  {showCommonDiagnoses ? 'Ocultar' : 'Ver diagnósticos comunes'}
                </button>
              </label>
              <Field
                as="textarea"
                name="diagnosis"
                placeholder="Ej: Infección de vías respiratorias superiores no especificada"
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

            {/* Diagnósticos Comunes */}
            {showCommonDiagnoses && (
              <div className="bg-base-200 rounded-lg p-4">
                <p className="text-sm font-semibold mb-3">Diagnósticos Frecuentes</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {commonDiagnoses.map((dx) => (
                    <button
                      key={dx.code}
                      type="button"
                      onClick={() => {
                        setFieldValue('diagnosis', dx.name);
                        setFieldValue('diagnosisCode', dx.code);
                        setShowCommonDiagnoses(false);
                      }}
                      className="btn btn-sm btn-outline justify-start text-left"
                    >
                      <span className="flex-1">{dx.name}</span>
                      <Badge variant="ghost" size="sm">
                        {dx.code}
                      </Badge>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Código CIE-10 */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-secondary" />
                  Código CIE-10 (Opcional)
                </span>
              </label>
              <Field
                type="text"
                name="diagnosisCode"
                placeholder="Ej: J06.9, K52.9"
                className={`input input-bordered w-full ${
                  errors.diagnosisCode && touched.diagnosisCode ? 'input-error' : ''
                }`}
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Formato: Letra + 2 dígitos (ej: A00) o con punto decimal (ej: J11.1)
                </span>
              </label>
              <ErrorMessage name="diagnosisCode">
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

            {/* Severidad */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  Severidad *
                </span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {Object.entries(severityConfig).map(([key, config]) => (
                  <label
                    key={key}
                    className={`
                      relative cursor-pointer rounded-lg border-2 p-4 transition-all
                      ${
                        values.severity === key
                          ? 'border-primary bg-primary/10'
                          : 'border-base-300 hover:border-base-400'
                      }
                    `}
                  >
                    <Field
                      type="radio"
                      name="severity"
                      value={key}
                      className="hidden"
                    />
                    <div className="text-center">
                      <div className="text-2xl mb-2">{config.icon}</div>
                      <p className="font-semibold text-sm">{config.label}</p>
                    </div>
                    {values.severity === key && (
                      <div className="absolute top-1 right-1">
                        <div className="w-3 h-3 bg-primary rounded-full"></div>
                      </div>
                    )}
                  </label>
                ))}
              </div>
              {values.severity && (
                <label className="label">
                  <span className="label-text-alt text-base-content/70 italic">
                    {severityConfig[values.severity].description}
                  </span>
                </label>
              )}
              <ErrorMessage name="severity">
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
                  <ClipboardList className="w-4 h-4 text-success" />
                  Plan de Tratamiento *
                </span>
              </label>
              <Field
                as="textarea"
                name="treatmentPlan"
                placeholder="Describe el plan de tratamiento: medicamentos, terapias, cambios en el estilo de vida, etc."
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

            {/* Observaciones */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-accent" />
                  Observaciones (Opcional)
                </span>
              </label>
              <Field
                as="textarea"
                name="observations"
                placeholder="Observaciones adicionales sobre el diagnóstico o el tratamiento..."
                className={`textarea textarea-bordered w-full h-24 resize-none ${
                  errors.observations && touched.observations ? 'textarea-error' : ''
                }`}
              />
              <ErrorMessage name="observations">
                {(msg) => (
                  <label className="label">
                    <span className="label-text-alt text-error">{msg}</span>
                  </label>
                )}
              </ErrorMessage>
            </div>

            {/* Resumen */}
            {values.diagnosis && values.severity && (
              <div className="bg-info/10 border border-info/30 rounded-lg p-4">
                <p className="text-sm font-semibold mb-2">Resumen del Diagnóstico</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-[100px]">Diagnóstico:</span>
                    <span className="flex-1">{values.diagnosis}</span>
                  </div>
                  {values.diagnosisCode && (
                    <div className="flex items-start gap-2">
                      <span className="font-medium min-w-[100px]">Código CIE-10:</span>
                      <span>{values.diagnosisCode}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2">
                    <span className="font-medium min-w-[100px]">Severidad:</span>
                    <Badge
                      variant={
                        values.severity === 'LEVE'
                          ? 'success'
                          : values.severity === 'MODERADA'
                          ? 'warning'
                          : 'error'
                      }
                    >
                      {severityConfig[values.severity].label}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

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
                    Guardando...
                  </>
                ) : (
                  'Continuar'
                )}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}