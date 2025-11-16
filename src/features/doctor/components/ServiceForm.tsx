import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string, number as yupNumber } from 'yup';
import { Stethoscope, DollarSign, Clock, FileText } from 'lucide-react';
import { Button } from '../../../components/common';

interface ServiceFormValues {
  name: string;
  description?: string;
  price: number;
  duration: number;
  isActive: boolean;
}

interface ServiceFormProps {
  initialValues?: Partial<ServiceFormValues>;
  onSubmit: (values: ServiceFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

const serviceSchema = object({
  name: string()
    .required('El nombre del servicio es requerido')
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: string()
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  price: yupNumber()
    .required('El precio es requerido')
    .min(0, 'El precio debe ser mayor o igual a 0')
    .max(999999, 'El precio no puede exceder $999,999'),
  duration: yupNumber()
    .required('La duración es requerida')
    .min(5, 'La duración mínima es 5 minutos')
    .max(480, 'La duración máxima es 480 minutos (8 horas)')
    .test('is-multiple-of-5', 'La duración debe ser múltiplo de 5', (value) => {
      return value ? value % 5 === 0 : true;
    }),
});

const commonDurations = [15, 30, 45, 60, 90, 120];

export default function ServiceForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
  className = '',
}: ServiceFormProps) {
  const defaultValues: ServiceFormValues = {
    name: '',
    description: '',
    price: 500,
    duration: 30,
    isActive: true,
    ...initialValues,
  };

  return (
    <div className={className}>
      <Formik
        initialValues={defaultValues}
        validationSchema={serviceSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Nombre del servicio */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Stethoscope className="w-4 h-4" />
                  Nombre del servicio
                </span>
              </label>
              <Field
                type="text"
                name="name"
                placeholder="Ej: Consulta General, Electrocardiograma..."
                className={`input input-bordered w-full ${
                  errors.name && touched.name ? 'input-error' : ''
                }`}
              />
              <ErrorMessage name="name">
                {(msg) => (
                  <label className="label">
                    <span className="label-text-alt text-error">{msg}</span>
                  </label>
                )}
              </ErrorMessage>
            </div>

            {/* Descripción */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Descripción (opcional)
                </span>
              </label>
              <Field
                as="textarea"
                name="description"
                placeholder="Describe brevemente el servicio médico..."
                className={`textarea textarea-bordered w-full h-24 resize-none ${
                  errors.description && touched.description ? 'textarea-error' : ''
                }`}
              />
              <ErrorMessage name="description">
                {(msg) => (
                  <label className="label">
                    <span className="label-text-alt text-error">{msg}</span>
                  </label>
                )}
              </ErrorMessage>
            </div>

            {/* Precio y Duración */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Precio */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Precio (MXN)
                  </span>
                </label>
                <Field
                  type="number"
                  name="price"
                  min="0"
                  step="50"
                  className={`input input-bordered w-full ${
                    errors.price && touched.price ? 'input-error' : ''
                  }`}
                />
                <ErrorMessage name="price">
                  {(msg) => (
                    <label className="label">
                      <span className="label-text-alt text-error">{msg}</span>
                    </label>
                  )}
                </ErrorMessage>
              </div>

              {/* Duración */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Duración (minutos)
                  </span>
                </label>
                <div className="flex gap-2">
                  <Field
                    type="number"
                    name="duration"
                    min="5"
                    step="5"
                    className={`input input-bordered flex-1 ${
                      errors.duration && touched.duration ? 'input-error' : ''
                    }`}
                  />
                  <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-outline">
                      Rápido
                    </label>
                    <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
                      {commonDurations.map((duration) => (
                        <li key={duration}>
                          <button
                            type="button"
                            onClick={() => setFieldValue('duration', duration)}
                          >
                            {duration} min
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <ErrorMessage name="duration">
                  {(msg) => (
                    <label className="label">
                      <span className="label-text-alt text-error">{msg}</span>
                    </label>
                  )}
                </ErrorMessage>
              </div>
            </div>

            {/* Estado activo */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <Field
                  type="checkbox"
                  name="isActive"
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Servicio activo</span>
              </label>
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Los servicios inactivos no estarán disponibles para agendar
                </span>
              </label>
            </div>

            {/* Botones */}
            <div className="flex gap-3 justify-end">
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
                {isSubmitting || isLoading ? 'Guardando...' : 'Guardar Servicio'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}