import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, number, string, boolean } from 'yup';
import { Clock, Calendar } from 'lucide-react';
import { Button, Alert } from '../../../components/common';

interface ScheduleFormValues {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

interface ScheduleFormProps {
  initialValues?: Partial<ScheduleFormValues>;
  onSubmit: (values: ScheduleFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  className?: string;
}

const scheduleSchema = object({
  dayOfWeek: number()
    .min(0, 'Día inválido')
    .max(6, 'Día inválido')
    .required('Selecciona un día'),
  startTime: string()
    .required('La hora de inicio es requerida')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)'),
  endTime: string()
    .required('La hora de fin es requerida')
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato de hora inválido (HH:MM)')
    .test('is-after', 'La hora de fin debe ser después de la hora de inicio', function(value) {
      const { startTime } = this.parent;
      if (!startTime || !value) return true;
      return value > startTime;
    }),
  isActive: boolean(),
});

const daysOfWeek = [
  { value: 1, label: 'Lunes' },
  { value: 2, label: 'Martes' },
  { value: 3, label: 'Miércoles' },
  { value: 4, label: 'Jueves' },
  { value: 5, label: 'Viernes' },
  { value: 6, label: 'Sábado' },
  { value: 0, label: 'Domingo' },
];

export default function ScheduleForm({
  initialValues,
  onSubmit,
  onCancel,
  isLoading = false,
  className = '',
}: ScheduleFormProps) {
  const defaultValues: ScheduleFormValues = {
    dayOfWeek: 1,
    startTime: '08:00',
    endTime: '17:00',
    isActive: true,
    ...initialValues,
  };

  return (
    <div className={className}>
      <Formik
        initialValues={defaultValues}
        validationSchema={scheduleSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="space-y-6">
            {/* Día de la semana */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Día de la semana
                </span>
              </label>
              <Field name="dayOfWeek">
  {({ field, form }: any) => (
    <select
      {...field}
      id="dayOfWeek"
      className={`select select-bordered w-full ${
        errors.dayOfWeek && touched.dayOfWeek ? 'select-error' : ''
      }`}
      onChange={(e) =>
        form.setFieldValue('dayOfWeek', Number(e.target.value))
      }
    >
      <option value="">Selecciona un día</option>
      {daysOfWeek.map((day) => (
        <option key={day.value} value={day.value}>
          {day.label}
        </option>
      ))}
    </select>
  )}
</Field>
              <ErrorMessage name="dayOfWeek">
                {(msg) => (
                  <label className="label">
                    <span className="label-text-alt text-error">{msg}</span>
                  </label>
                )}
              </ErrorMessage>
            </div>

            {/* Horarios */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Hora de inicio */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Hora de inicio
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

              {/* Hora de fin */}
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Hora de fin
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

            {/* Estado activo */}
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <Field
                  type="checkbox"
                  name="isActive"
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Horario activo</span>
              </label>
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Los horarios inactivos no estarán disponibles para agendar citas
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
                {isSubmitting || isLoading ? 'Guardando...' : 'Guardar Horario'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}