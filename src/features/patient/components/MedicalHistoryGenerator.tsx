import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';
import { Sparkles, Clock, AlertCircle, Info, User } from 'lucide-react';
import { Button, Alert } from '../../../components/common';
import type {
  GenerateMedicalHistoryDto,
  MedicalHistoryType,
  MedicalHistoryFormat,
  MedicalHistoryLanguage,
} from '../../../types/medical-history.types';
import {
  getMedicalHistoryTypeLabel,
  getMedicalHistoryTypeDescription,
  estimateGenerationTime,
  formatEstimatedTime,
} from '../../../utils/medicalHistoryHelpers';

interface MedicalHistoryGeneratorProps {
  patientId: string; // NUEVO: Necesario para doctores
  patientName?: string; // NUEVO: Mostrar nombre del paciente
  onGenerate: (data: GenerateMedicalHistoryDto) => Promise<void>;
  isGenerating?: boolean;
  canGenerate?: boolean;
  canGenerateReason?: string;
  isDoctor?: boolean; // NUEVO: Indicar si es un doctor quien genera
  className?: string;
}

const generatorSchema = object({
  historyType: string().required('Selecciona el tipo de historial'),
  format: string().required('Selecciona el formato'),
  language: string().required('Selecciona el idioma'),
  startDate: string(),
  endDate: string(),
});

const historyTypes: MedicalHistoryType[] = ['complete', 'summary', 'chronological', 'by_systems'];
const formats: MedicalHistoryFormat[] = ['markdown', 'plain_text'];
const languages: MedicalHistoryLanguage[] = ['es', 'en'];

export default function MedicalHistoryGenerator({
  patientId,
  patientName,
  onGenerate,
  isGenerating = false,
  canGenerate = true,
  canGenerateReason,
  isDoctor = false,
  className = '',
}: MedicalHistoryGeneratorProps) {
  const [selectedType, setSelectedType] = useState<MedicalHistoryType>('complete');

  const initialValues: GenerateMedicalHistoryDto = {
    historyType: 'complete',
    format: 'markdown',
    language: 'es',
    startDate: undefined,
    endDate: undefined,
  };

  const estimatedTime = estimateGenerationTime(selectedType);

  return (
    <div className={`card bg-base-100 border-2 border-primary/20 ${className}`}>
      <div className="card-body p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg mb-1">Generar Historial Médico</h3>
            <p className="text-sm text-base-content/70">
              {isDoctor 
                ? 'Crea un historial médico completo del paciente usando inteligencia artificial'
                : 'Crea un historial médico completo usando inteligencia artificial'
              }
            </p>
            {/* NUEVO: Mostrar nombre del paciente si es doctor */}
            {isDoctor && patientName && (
              <div className="flex items-center gap-2 mt-2 text-sm text-info">
                <User className="w-4 h-4" />
                <span className="font-medium">Paciente: {patientName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Advertencia si no puede generar */}
        {!canGenerate && canGenerateReason && (
          <Alert type="warning" icon>
            <AlertCircle className="w-5 h-5" />
            <div className="text-sm">
              <p className="font-semibold">No se puede generar el historial</p>
              <p>{canGenerateReason}</p>
            </div>
          </Alert>
        )}

        {/* NUEVO: Alerta especial para doctores */}
        {isDoctor && canGenerate && (
          <Alert type="info">
            <Info className="w-5 h-5" />
            <div className="text-sm">
              <p className="font-semibold">Generando como profesional médico</p>
              <p>Este historial quedará registrado en el expediente del paciente y podrá ser consultado posteriormente.</p>
            </div>
          </Alert>
        )}

        {/* Información de tiempo estimado */}
        <Alert type="info">
          <Clock className="w-5 h-5" />
          <div className="text-sm">
            <p className="font-semibold">Tiempo de generación estimado</p>
            <p>Este proceso puede tardar aproximadamente {formatEstimatedTime(estimatedTime)}. Por favor, no cierres esta página.</p>
          </div>
        </Alert>

        {/* Formulario */}
        <Formik
          initialValues={initialValues}
          validationSchema={generatorSchema}
          onSubmit={onGenerate}
        >
          {({ values, setFieldValue, isSubmitting }) => {
            // Actualizar tipo seleccionado
            if (values.historyType !== selectedType) {
              setSelectedType(values.historyType as MedicalHistoryType);
            }

            return (
              <Form className="space-y-6">
                {/* Tipo de historial */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium">Tipo de Historial *</span>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {historyTypes.map((type) => {
                      const label = getMedicalHistoryTypeLabel(type);
                      const description = getMedicalHistoryTypeDescription(type);
                      const isSelected = values.historyType === type;

                      return (
                        <label
                          key={type}
                          className={`
                            relative cursor-pointer rounded-lg border-2 p-4 transition-all
                            ${
                              isSelected
                                ? 'border-primary bg-primary/10'
                                : 'border-base-300 hover:border-base-400'
                            }
                          `}
                        >
                          <Field
                            type="radio"
                            name="historyType"
                            value={type}
                            className="hidden"
                          />
                          <div>
                            <p className="font-semibold mb-1">{label}</p>
                            <p className="text-xs text-base-content/70">{description}</p>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2">
                              <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              </div>
                            </div>
                          )}
                        </label>
                      );
                    })}
                  </div>
                  <ErrorMessage name="historyType">
                    {(msg) => (
                      <label className="label">
                        <span className="label-text-alt text-error">{msg}</span>
                      </label>
                    )}
                  </ErrorMessage>
                </div>

                {/* Formato y Idioma */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Formato */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Formato *</span>
                    </label>
                    <Field
                      as="select"
                      name="format"
                      className="select select-bordered w-full"
                    >
                      {formats.map((format) => (
                        <option key={format} value={format}>
                          {format === 'markdown' ? 'Markdown (Recomendado)' : 'Texto Plano'}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="format">
                      {(msg) => (
                        <label className="label">
                          <span className="label-text-alt text-error">{msg}</span>
                        </label>
                      )}
                    </ErrorMessage>
                  </div>

                  {/* Idioma */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Idioma *</span>
                    </label>
                    <Field
                      as="select"
                      name="language"
                      className="select select-bordered w-full"
                    >
                      {languages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang === 'es' ? 'Español' : 'English'}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="language">
                      {(msg) => (
                        <label className="label">
                          <span className="label-text-alt text-error">{msg}</span>
                        </label>
                      )}
                    </ErrorMessage>
                  </div>
                </div>

                {/* Rango de fechas (Opcional) */}
                <div className="collapse collapse-arrow bg-base-200">
                  <input type="checkbox" />
                  <div className="collapse-title font-medium">
                    Opciones Avanzadas (Opcional)
                  </div>
                  <div className="collapse-content space-y-4">
                    <div className="alert alert-info">
                      <Info className="w-5 h-5" />
                      <span className="text-sm">
                        Puedes limitar el historial a un rango de fechas específico. Si no especificas fechas, se incluirá toda la información disponible.
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Fecha de inicio</span>
                        </label>
                        <Field
                          type="date"
                          name="startDate"
                          max={values.endDate || new Date().toISOString().split('T')[0]}
                          className="input input-bordered w-full"
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Fecha de fin</span>
                        </label>
                        <Field
                          type="date"
                          name="endDate"
                          min={values.startDate}
                          max={new Date().toISOString().split('T')[0]}
                          className="input input-bordered w-full"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botón de generar */}
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={isSubmitting || isGenerating || !canGenerate}
                    className="gap-2"
                  >
                    {isSubmitting || isGenerating ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Generando Historial...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generar Historial
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
}