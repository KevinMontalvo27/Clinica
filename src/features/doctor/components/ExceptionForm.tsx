import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string, date as yupDate } from 'yup';
import { Calendar, Clock, MessageSquare, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/common';

interface ExceptionFormValues {
  exceptionDate: string;
  startTime?: string;
  endTime?: string;
  reason?: string;
  isFullDay: boolean;
}

interface ExceptionFormProps {
  initialValues?: Partial<ExceptionFormValues>;
  onSubmit: (values: ExceptionFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

const exceptionSchema = object({
  exceptionDate: string()
    .required('La fecha es requerida'),
  startTime: string().when('isFullDay', {
    is: false,
    then: (schema) => schema.required('La hora de inicio es requerida'),
    otherwise: (schema) => schema.notRequired(),
  }),
  endTime: string()
    .when('isFullDay', {
      is: false,
      then: (schema) => schema.required('La hora de fin es requerida'),
      otherwise: (schema) => schema.notRequired(),
    })
    .test('is-after', 'La hora de fin debe ser después de la hora de inicio', function(value) {
      const { startTime, isFullDay } = this.parent;
      if (isFullDay || !startTime || !value) return true;
      return value > startTime;
    }),
  reason: string(),
  isFullDay: string(),
});

export default function ExceptionForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
  className = '',
}: ExceptionFormProps) {
  const defaultValues: ExceptionFormValues = {
    exceptionDate: new Date().toISOString().split('T')[0],
    startTime: '08:00',
    endTime: '17:00',
    reason: '',
    isFullDay: false,
    ...initialValues,
  };

  return (
    <div className={className}>
      <div className="alert alert-info mb-6">
        <AlertCircle className="w-5 h-5" />
        <div className="text-sm">
          <p className="font-semibold">Bloqueo de horario</p>
          <p>Define períodos donde no estarás disponible para citas</p>
        </div>
      </div>

      <Formik
        initialValues={defaultValues}
        validationSchema={exceptionSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting, values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Fecha */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Fecha
                </span>
              </label>
              <Field
                type="date"
                name="exceptionDate"
                min={new Date().toISOString().split('T')[0]}
                className={`input input-bordered w-full ${
                  errors.exceptionDate && touched.exceptionDate ? 'input-error' : ''
                }`}
              />
              <ErrorMessage name="exceptionDate">
                {(msg) => (
                  <label className="label">
                    <span className="label-text-alt text-error">{msg}</span>
                  </label>
                )}
              </ErrorMessage>
            </div>

            {/* Día completo */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <Field
                  type="checkbox"
                  name="isFullDay"
                  className="checkbox checkbox-primary"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFieldValue('isFullDay', e.target.checked);
                    if (e.target.checked) {
                      setFieldValue('startTime', '');
                      setFieldValue('endTime', '');
                    }
                  }}
                />
                <span className="label-text">Bloquear día completo</span>
              </label>
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Si no, especifica el rango de horas
                </span>
              </label>
            </div>

            {/* Horarios (solo si no es día completo) */}
            {!values.isFullDay && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Desde
                    </span>
                  </label>
                  <Field
                    type="time"
                    name="startTime"
                    className={`input input-bordered w-full ${
                      errors.startTime && touched.startTime ? 'input-error' : ''
                    }`}
                  />
                  <ErrorMessage name="startTime">
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
                      <Clock className="w-4 h-4" />
                      Hasta
                    </span>
                  </label>
                  <Field
                    type="time"
                    name="endTime"
                    className={`input input-bordered w-full ${
                      errors.endTime && touched.endTime ? 'input-error' : ''
                    }`}
                  />
                  <ErrorMessage name="endTime">
                    {(msg) => (
                      <label className="label">
                        <span className="label-text-alt text-error">{msg}</span>
                      </label>
                    )}
                  </ErrorMessage>
                </div>
              </div>
            )}

            {/* Motivo */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Motivo (opcional)
                </span>
              </label>
              <Field
                as="textarea"
                name="reason"
                placeholder="Ej: Vacaciones, Conferencia médica, Personal..."
                className="textarea textarea-bordered w-full h-24 resize-none"
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Este motivo es para tu referencia personal
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
                {isSubmitting || isLoading ? 'Guardando...' : 'Guardar Excepción'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}