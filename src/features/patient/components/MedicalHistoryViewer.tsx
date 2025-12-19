import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { X, Download, Printer, Copy, Check } from 'lucide-react';
import { Button, Badge, Modal } from '../../../components/common';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { GeneratedMedicalHistory } from '../../../types/medical-history.types';
import {
  getMedicalHistoryTypeLabel,
  getMedicalHistoryFormatLabel,
  getMedicalHistoryLanguageLabel,
} from '../../../utils/medicalHistoryHelpers';

interface MedicalHistoryViewerProps {
  history: GeneratedMedicalHistory | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (historyId: string) => void;
  isDownloading?: boolean;
  className?: string;
}

export default function MedicalHistoryViewer({
  history,
  isOpen,
  onClose,
  onDownload,
  isDownloading = false,
  className = '',
}: MedicalHistoryViewerProps) {
  const [copied, setCopied] = useState(false);

  if (!history) return null;

  const generatedDate = format(new Date(history.generatedAt), "d 'de' MMMM, yyyy 'a las' HH:mm", {
    locale: es,
  });

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(history.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copiando contenido:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="xl"
      closeButton={false}
      className={className}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-base-300">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold mb-2">
              {getMedicalHistoryTypeLabel(history.historyType)}
            </h2>
            <div className="flex flex-wrap gap-2 mb-2">
              <Badge variant="info" size="sm">
                {getMedicalHistoryFormatLabel(history.format)}
              </Badge>
              <Badge variant="success" size="sm">
                {getMedicalHistoryLanguageLabel(history.language)}
              </Badge>
            </div>
            <p className="text-sm text-base-content/70">
              Generado el {generatedDate}
            </p>
          </div>

          <button
            onClick={onClose}
            className="btn btn-ghost btn-circle btn-sm"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de acciones */}
        <div className="flex flex-wrap gap-2">
          {onDownload && (
            <Button
              size="sm"
              variant="primary"
              onClick={() => onDownload(history.id)}
              disabled={isDownloading}
              className="gap-2"
            >
              {isDownloading ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Generando PDF...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  Descargar PDF
                </>
              )}
            </Button>
          )}

          <Button
            size="sm"
            variant="outline"
            onClick={handleCopyContent}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-success" />
                Copiado
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copiar
              </>
            )}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={handlePrint}
            className="gap-2"
          >
            <Printer className="w-4 h-4" />
            Imprimir
          </Button>
        </div>

        {/* Contenido del historial */}
        <div className="bg-base-100 rounded-lg border border-base-300 max-h-[60vh] overflow-y-auto">
          <div className="p-6 prose prose-sm max-w-none">
            {history.format === 'markdown' ? (
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  // Estilos personalizados para markdown
                  h1: ({ node, ...props }) => (
                    <h1 className="text-2xl font-bold text-primary mb-4 pb-2 border-b-2 border-primary" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-xl font-bold text-secondary mt-6 mb-3" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-lg font-semibold text-accent mt-4 mb-2" {...props} />
                  ),
                  p: ({ node, ...props }) => (
                    <p className="mb-3 text-base-content/90 leading-relaxed" {...props} />
                  ),
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside mb-4 space-y-1" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="text-base-content/90" {...props} />
                  ),
                  table: ({ node, ...props }) => (
                    <div className="overflow-x-auto my-4">
                      <table className="table table-zebra w-full" {...props} />
                    </div>
                  ),
                  blockquote: ({ node, ...props }) => (
                    <blockquote className="border-l-4 border-primary pl-4 italic my-4 text-base-content/80" {...props} />
                  ),
                  code: ({ node, inline, ...props }: any) => (
                    inline ? (
                      <code className="bg-base-300 px-1 py-0.5 rounded text-sm" {...props} />
                    ) : (
                      <code className="block bg-base-300 p-4 rounded my-4 text-sm overflow-x-auto" {...props} />
                    )
                  ),
                }}
              >
                {history.content}
              </ReactMarkdown>
            ) : (
              <pre className="whitespace-pre-wrap font-sans text-sm text-base-content/90 leading-relaxed">
                {history.content}
              </pre>
            )}
          </div>
        </div>

        {/* Footer con metadata adicional */}
        {(history.startDate || history.endDate) && (
          <div className="bg-base-200 rounded-lg p-4">
            <p className="text-sm text-base-content/70">
              <strong>Período incluido:</strong>{' '}
              {history.startDate && format(new Date(history.startDate), 'd MMM yyyy', { locale: es })}
              {history.startDate && history.endDate && ' - '}
              {history.endDate && format(new Date(history.endDate), 'd MMM yyyy', { locale: es })}
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
}