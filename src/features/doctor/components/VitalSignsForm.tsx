import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, number as yupNumber } from 'yup';
import { Activity, Heart, Thermometer, Weight, Ruler, AlertCircle } from 'lucide-react';
import { Button, Alert } from '../../../components/common';

interface VitalSignsFormValues {
  weight?: number;
  height?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  temperature?: number;
}

interface VitalSignsFormProps {
  initialValues?: Partial<VitalSignsFormValues>;
  onSubmit: (values: VitalSignsFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

const vitalSignsSchema = object({
  weight: yupNumber()
    .min(0.5, 'El peso mínimo es 0.5 kg')
    .max(500, 'El peso máximo es 500 kg')
    .test('decimal-places', 'Máximo 2 decimales', (value) => {
      if (!value) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  height: yupNumber()
    .min(20, 'La altura mínima es 20 cm')
    .max(300, 'La altura máxima es 300 cm')
    .test('decimal-places', 'Máximo 2 decimales', (value) => {
      if (!value) return true;
      return /^\d+(\.\d{1,2})?$/.test(value.toString());
    }),
  bloodPressureSystolic: yupNumber()
    .min(50, 'La presión sistólica mínima es 50 mmHg')
    .max(300, 'La presión sistólica máxima es 300 mmHg')
    .integer('Debe ser un número entero'),
  bloodPressureDiastolic: yupNumber()
    .min(30, 'La presión diastólica mínima es 30 mmHg')
    .max(200, 'La presión diastólica máxima es 200 mmHg')
    .integer('Debe ser un número entero')
    .test(
      'diastolic-lower',
      'La presión diastólica debe ser menor que la sistólica',
      function(value) {
        const { bloodPressureSystolic } = this.parent;
        if (!value || !bloodPressureSystolic) return true;
        return value < bloodPressureSystolic;
      }
    ),
  heartRate: yupNumber()
    .min(20, 'La frecuencia cardíaca mínima es 20 bpm')
    .max(300, 'La frecuencia cardíaca máxima es 300 bpm')
    .integer('Debe ser un número entero'),
  temperature: yupNumber()
    .min(30, 'La temperatura mínima es 30°C')
    .max(45, 'La temperatura máxima es 45°C')
    .test('decimal-places', 'Máximo 1 decimal', (value) => {
      if (!value) return true;
      return /^\d+(\.\d{1})?$/.test(value.toString());
    }),
});

export default function VitalSignsForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
  className = '',
}: VitalSignsFormProps) {
  const defaultValues: VitalSignsFormValues = {
    weight: undefined,
    height: undefined,
    bloodPressureSystolic: undefined,
    bloodPressureDiastolic: undefined,
    heartRate: undefined,
    temperature: undefined,
    ...initialValues,
  };

  const calculateBMI = (weight?: number, height?: number): string | null => {
    if (!weight || !height) return null;
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    return bmi.toFixed(2);
  };

  const getBMICategory = (bmi: number): { label: string; color: string } => {
    if (bmi < 18.5) return { label: 'Bajo peso', color: 'text-info' };
    if (bmi < 25) return { label: 'Normal', color: 'text-success' };
    if (bmi < 30) return { label: 'Sobrepeso', color: 'text-warning' };
    return { label: 'Obesidad', color: 'text-error' };
  };

  const getBloodPressureStatus = (
    systolic?: number,
    diastolic?: number
  ): { label: string; color: string } | null => {
    if (!systolic || !diastolic) return null;
    
    if (systolic < 120 && diastolic < 80) {
      return { label: 'Normal', color: 'text-success' };
    }
    if (systolic < 130 && diastolic < 80) {
      return { label: 'Elevada', color: 'text-info' };
    }
    if (systolic < 140 || diastolic < 90) {
      return { label: 'Hipertensión Grado 1', color: 'text-warning' };
    }
    return { label: 'Hipertensión Grado 2', color: 'text-error' };
  };

  return (
    <div className={className}>
      <Alert type="info" className="mb-6">
        <Activity className="w-5 h-5" />
        <div className="text-sm">
          <p className="font-semibold">Signos Vitales</p>
          <p>Todos los campos son opcionales. Registra las mediciones realizadas durante la consulta.</p>
        </div>
      </Alert>

      <Formik
        initialValues={defaultValues}
        validationSchema={vitalSignsSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting, values }) => {
          const bmi = calculateBMI(values.weight, values.height);
          const bmiCategory = bmi ? getBMICategory(parseFloat(bmi)) : null;
          const bpStatus = getBloodPressureStatus(
            values.bloodPressureSystolic,
            values.bloodPressureDiastolic
          );

          return (
            <Form className="space-y-6">
              {/* Peso y Altura */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Peso */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Weight className="w-4 h-4 text-primary" />
                      Peso (kg)
                    </span>
                  </label>
                  <Field
                    type="number"
                    name="weight"
                    placeholder="70.5"
                    step="0.1"
                    className={`input input-bordered w-full ${
                      errors.weight && touched.weight ? 'input-error' : ''
                    }`}
                  />
                  <ErrorMessage name="weight">
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

                {/* Altura */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Ruler className="w-4 h-4 text-secondary" />
                      Altura (cm)
                    </span>
                  </label>
                  <Field
                    type="number"
                    name="height"
                    placeholder="175"
                    step="0.1"
                    className={`input input-bordered w-full ${
                      errors.height && touched.height ? 'input-error' : ''
                    }`}
                  />
                  <ErrorMessage name="height">
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
              </div>

              {/* IMC Calculado */}
              {bmi && bmiCategory && (
                <div className="bg-base-200 rounded-lg p-4">
                  <p className="text-sm text-base-content/70 mb-1">Índice de Masa Corporal (IMC)</p>
                  <div className="flex items-center gap-3">
                    <p className="text-2xl font-bold text-primary">{bmi}</p>
                    <span className={`badge badge-lg ${bmiCategory.color}`}>
                      {bmiCategory.label}
                    </span>
                  </div>
                </div>
              )}

              {/* Presión Arterial */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Activity className="w-4 h-4 text-error" />
                      Presión Sistólica (mmHg)
                    </span>
                  </label>
                  <Field
                    type="number"
                    name="bloodPressureSystolic"
                    placeholder="120"
                    className={`input input-bordered w-full ${
                      errors.bloodPressureSystolic && touched.bloodPressureSystolic
                        ? 'input-error'
                        : ''
                    }`}
                  />
                  <ErrorMessage name="bloodPressureSystolic">
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

                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Activity className="w-4 h-4 text-error" />
                      Presión Diastólica (mmHg)
                    </span>
                  </label>
                  <Field
                    type="number"
                    name="bloodPressureDiastolic"
                    placeholder="80"
                    className={`input input-bordered w-full ${
                      errors.bloodPressureDiastolic && touched.bloodPressureDiastolic
                        ? 'input-error'
                        : ''
                    }`}
                  />
                  <ErrorMessage name="bloodPressureDiastolic">
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
              </div>

              {/* Estado de Presión Arterial */}
              {bpStatus && (
                <div className="bg-base-200 rounded-lg p-4">
                  <p className="text-sm text-base-content/70 mb-1">Estado de Presión Arterial</p>
                  <div className="flex items-center gap-3">
                    <p className="text-xl font-bold">
                      {values.bloodPressureSystolic}/{values.bloodPressureDiastolic}
                    </p>
                    <span className={`badge badge-lg ${bpStatus.color}`}>
                      {bpStatus.label}
                    </span>
                  </div>
                </div>
              )}

              {/* Frecuencia Cardíaca */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <Heart className="w-4 h-4 text-error" />
                    Frecuencia Cardíaca (bpm)
                  </span>
                </label>
                <Field
                  type="number"
                  name="heartRate"
                  placeholder="72"
                  className={`input input-bordered w-full ${
                    errors.heartRate && touched.heartRate ? 'input-error' : ''
                  }`}
                />
                <ErrorMessage name="heartRate">
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

              {/* Temperatura */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <Thermometer className="w-4 h-4 text-warning" />
                    Temperatura (°C)
                  </span>
                </label>
                <Field
                  type="number"
                  name="temperature"
                  placeholder="36.5"
                  step="0.1"
                  className={`input input-bordered w-full ${
                    errors.temperature && touched.temperature ? 'input-error' : ''
                  }`}
                />
                <ErrorMessage name="temperature">
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
          );
        }}
      </Formik>
    </div>
  );
}