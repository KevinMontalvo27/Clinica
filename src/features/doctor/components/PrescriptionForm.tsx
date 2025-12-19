import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import { object, string, array } from 'yup';
import { Pill, Plus, Trash2, Clock, FileText, AlertCircle } from 'lucide-react';
import { Button, Alert, Badge } from '../../../components/common';
import { useState } from 'react';

interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

interface PrescriptionFormValues {
  medications: Medication[];
  generalInstructions: string;
  followUpDate?: string;
}

interface PrescriptionFormProps {
  initialValues?: Partial<PrescriptionFormValues>;
  onSubmit: (values: PrescriptionFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

const medicationSchema = object({
  name: string()
    .required('El nombre del medicamento es requerido')
    .min(2, 'Mínimo 2 caracteres'),
  dosage: string()
    .required('La dosis es requerida')
    .min(2, 'Especifica la dosis'),
  frequency: string()
    .required('La frecuencia es requerida'),
  duration: string()
    .required('La duración es requerida'),
  instructions: string()
    .max(200, 'Máximo 200 caracteres'),
});

const prescriptionSchema = object({
  medications: array()
    .of(medicationSchema)
    .min(1, 'Agrega al menos un medicamento'),
  generalInstructions: string()
    .max(500, 'Máximo 500 caracteres'),
  followUpDate: string(),
});

const commonMedications = [
  { name: 'Paracetamol', dosage: '500mg', frequency: 'Cada 8 horas' },
  { name: 'Ibuprofeno', dosage: '400mg', frequency: 'Cada 8 horas' },
  { name: 'Amoxicilina', dosage: '500mg', frequency: 'Cada 8 horas' },
  { name: 'Omeprazol', dosage: '20mg', frequency: 'Cada 24 horas' },
  { name: 'Loratadina', dosage: '10mg', frequency: 'Cada 24 horas' },
];

const frequencies = [
  'Cada 4 horas',
  'Cada 6 horas',
  'Cada 8 horas',
  'Cada 12 horas',
  'Cada 24 horas',
  'En ayunas',
  'Con alimentos',
  'Antes de dormir',
];

const durations = [
  '3 días',
  '5 días',
  '7 días',
  '10 días',
  '14 días',
  '21 días',
  '30 días',
  'Hasta agotar',
];

export default function PrescriptionForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
  className = '',
}: PrescriptionFormProps) {
  const [showCommonMeds, setShowCommonMeds] = useState(false);

  const defaultValues: PrescriptionFormValues = {
    medications: [
      {
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
      },
    ],
    generalInstructions: '',
    followUpDate: '',
    ...initialValues,
  };

  // Calcular fecha mínima (mañana)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className={className}>
      <Alert type="info" className="mb-6">
        <Pill className="w-5 h-5" />
        <div className="text-sm">
          <p className="font-semibold">Receta Médica</p>
          <p>
            Prescribe los medicamentos necesarios. Todos los campos son opcionales si no se
            requiere prescripción.
          </p>
        </div>
      </Alert>

      <Formik
        initialValues={defaultValues}
        validationSchema={prescriptionSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting, values, setFieldValue }) => {
          // Helper para obtener errores de medicamentos de forma segura
          const getMedicationError = (index: number, field: keyof Medication) => {
            const medicationErrors = errors.medications;
            if (!medicationErrors || typeof medicationErrors === 'string') return undefined;
            const medError = medicationErrors[index];
            if (!medError || typeof medError === 'string') return undefined;
            return medError[field];
          };

          const getMedicationTouched = (index: number, field: keyof Medication) => {
            const medicationTouched = touched.medications;
            if (!medicationTouched) return false;
            const medTouched = medicationTouched[index];
            if (!medTouched) return false;
            return medTouched[field];
          };

          return (
          <Form className="space-y-6">
            {/* Lista de Medicamentos */}
            <FieldArray name="medications">
              {({ push, remove }) => (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="label">
                      <span className="label-text font-medium flex items-center gap-2">
                        <Pill className="w-4 h-4 text-primary" />
                        Medicamentos Prescritos
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCommonMeds(!showCommonMeds)}
                      className="label-text-alt link link-primary"
                    >
                      {showCommonMeds ? 'Ocultar' : 'Ver medicamentos comunes'}
                    </button>
                  </div>

                  {/* Medicamentos Comunes */}
                  {showCommonMeds && (
                    <div className="bg-base-200 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold mb-3">Medicamentos Frecuentes</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {commonMedications.map((med, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              const lastIndex = values.medications.length - 1;
                              setFieldValue(`medications.${lastIndex}.name`, med.name);
                              setFieldValue(`medications.${lastIndex}.dosage`, med.dosage);
                              setFieldValue(`medications.${lastIndex}.frequency`, med.frequency);
                              setShowCommonMeds(false);
                            }}
                            className="btn btn-sm btn-outline justify-start text-left"
                          >
                            <span className="flex-1">{med.name}</span>
                            <Badge variant="ghost" size="sm">
                              {med.dosage}
                            </Badge>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medicamentos */}
                  {values.medications.map((medication, index) => (
                    <div
                      key={index}
                      className="border border-base-300 rounded-lg p-4 space-y-4 relative"
                    >
                      {/* Botón Eliminar */}
                      {values.medications.length > 1 && (
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="absolute top-2 right-2 btn btn-sm btn-ghost btn-circle text-error"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}

                      <div className="flex items-center gap-2 mb-3">
                        <Badge variant="primary">Medicamento {index + 1}</Badge>
                      </div>

                      {/* Nombre del medicamento */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Nombre *</span>
                        </label>
                        <Field
                          name={`medications.${index}.name`}
                          placeholder="Ej: Paracetamol, Amoxicilina..."
                          className={`input input-bordered w-full ${
                            getMedicationError(index, 'name') && getMedicationTouched(index, 'name')
                              ? 'input-error'
                              : ''
                          }`}
                        />
                        <ErrorMessage name={`medications.${index}.name`}>
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

                      {/* Dosis */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">Dosis *</span>
                        </label>
                        <Field
                          name={`medications.${index}.dosage`}
                          placeholder="Ej: 500mg, 10ml, 1 tableta..."
                          className={`input input-bordered w-full ${
                            getMedicationError(index, 'dosage') && getMedicationTouched(index, 'dosage')
                              ? 'input-error'
                              : ''
                          }`}
                        />
                        <ErrorMessage name={`medications.${index}.dosage`}>
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

                      {/* Frecuencia y Duración */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Frecuencia *
                            </span>
                          </label>
                          <Field
                            as="select"
                            name={`medications.${index}.frequency`}
                            className={`select select-bordered w-full ${
                              getMedicationError(index, 'frequency') && getMedicationTouched(index, 'frequency')
                                ? 'select-error'
                                : ''
                            }`}
                          >
                            <option value="">Seleccionar...</option>
                            {frequencies.map((freq) => (
                              <option key={freq} value={freq}>
                                {freq}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name={`medications.${index}.frequency`}>
                            {(msg) => (
                              <label className="label">
                                <span className="label-text-alt text-error">{msg}</span>
                              </label>
                            )}
                          </ErrorMessage>
                        </div>

                        <div className="form-control">
                          <label className="label">
                            <span className="label-text font-medium">Duración *</span>
                          </label>
                          <Field
                            as="select"
                            name={`medications.${index}.duration`}
                            className={`select select-bordered w-full ${
                              getMedicationError(index, 'duration') && getMedicationTouched(index, 'duration')
                                ? 'select-error'
                                : ''
                            }`}
                          >
                            <option value="">Seleccionar...</option>
                            {durations.map((dur) => (
                              <option key={dur} value={dur}>
                                {dur}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name={`medications.${index}.duration`}>
                            {(msg) => (
                              <label className="label">
                                <span className="label-text-alt text-error">{msg}</span>
                              </label>
                            )}
                          </ErrorMessage>
                        </div>
                      </div>

                      {/* Instrucciones específicas */}
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text font-medium">
                            Instrucciones Específicas (Opcional)
                          </span>
                        </label>
                        <Field
                          as="textarea"
                          name={`medications.${index}.instructions`}
                          placeholder="Ej: Tomar con alimentos, No tomar con lácteos..."
                          className={`textarea textarea-bordered w-full h-20 resize-none ${
                            getMedicationError(index, 'instructions') && getMedicationTouched(index, 'instructions')
                              ? 'textarea-error'
                              : ''
                          }`}
                        />
                        <ErrorMessage name={`medications.${index}.instructions`}>
                          {(msg) => (
                            <label className="label">
                              <span className="label-text-alt text-error">{msg}</span>
                            </label>
                          )}
                        </ErrorMessage>
                      </div>
                    </div>
                  ))}

                  {/* Botón Agregar Medicamento */}
                  <button
                    type="button"
                    onClick={() =>
                      push({
                        name: '',
                        dosage: '',
                        frequency: '',
                        duration: '',
                        instructions: '',
                      })
                    }
                    className="btn btn-outline btn-block"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Otro Medicamento
                  </button>

                  {typeof errors.medications === 'string' && (
                    <Alert type="error">
                      <AlertCircle className="w-5 h-5" />
                      {errors.medications}
                    </Alert>
                  )}
                </div>
              )}
            </FieldArray>

            {/* Instrucciones Generales */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4 text-accent" />
                  Instrucciones Generales (Opcional)
                </span>
              </label>
              <Field
                as="textarea"
                name="generalInstructions"
                placeholder="Recomendaciones adicionales: dieta, reposo, precauciones..."
                className={`textarea textarea-bordered w-full h-24 resize-none ${
                  errors.generalInstructions && touched.generalInstructions
                    ? 'textarea-error'
                    : ''
                }`}
              />
              <ErrorMessage name="generalInstructions">
                {(msg) => (
                  <label className="label">
                    <span className="label-text-alt text-error">{msg}</span>
                  </label>
                )}
              </ErrorMessage>
            </div>

            {/* Fecha de Seguimiento */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-info" />
                  Fecha de Seguimiento (Opcional)
                </span>
              </label>
              <Field
                type="date"
                name="followUpDate"
                min={minDate}
                className="input input-bordered w-full"
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Si requiere cita de seguimiento, especifica la fecha sugerida
                </span>
              </label>
            </div>

            {/* Resumen */}
            {values.medications.some((m) => m.name) && (
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                <p className="text-sm font-semibold mb-3">Resumen de Prescripción</p>
                <div className="space-y-2">
                  {values.medications
                    .filter((m) => m.name)
                    .map((med, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-sm bg-base-100 rounded p-2"
                      >
                        <Pill className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-medium">{med.name}</p>
                          <p className="text-base-content/70">
                            {med.dosage} - {med.frequency} - {med.duration}
                          </p>
                          {med.instructions && (
                            <p className="text-xs text-base-content/60 italic mt-1">
                              {med.instructions}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
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
                    Finalizando...
                  </>
                ) : (
                  'Finalizar Consulta'
                )}
              </Button>
            </div>
          </Form>
        );
      }}
      </Formik>
    </div>
  );
}