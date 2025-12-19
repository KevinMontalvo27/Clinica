import { useState } from 'react';
import { Download, Check, AlertCircle } from 'lucide-react';
import { Button, Alert } from '../../../components/common';
import { downloadMedicalHistoryPdf } from '../../../utils/downloadPdf';

interface PdfDownloadButtonProps {
  historyId: string;
  filename?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  showSuccessMessage?: boolean;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

export default function PdfDownloadButton({
  historyId,
  filename,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  showSuccessMessage = true,
  onSuccess,
  onError,
  className = '',
}: PdfDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      setError(null);
      setDownloadComplete(false);

      await downloadMedicalHistoryPdf(historyId, filename);

      setDownloadComplete(true);
      onSuccess?.();

      // Reset success message after 3 seconds
      setTimeout(() => {
        setDownloadComplete(false);
      }, 3000);
    } catch (err: any) {
      console.error('Error descargando PDF:', err);
      const errorMessage = err.message || 'Error al descargar el PDF';
      setError(errorMessage);
      onError?.(err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={className}>
      <Button
        variant={variant}
        size={size}
        onClick={handleDownload}
        disabled={isDownloading || downloadComplete}
        fullWidth={fullWidth}
        className="gap-2"
      >
        {isDownloading ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            Generando PDF...
          </>
        ) : downloadComplete && showSuccessMessage ? (
          <>
            <Check className="w-4 h-4 text-success" />
            ¡Descargado!
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Descargar PDF
          </>
        )}
      </Button>

      {error && (
        <Alert type="error" className="mt-2" closeable onClose={() => setError(null)}>
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </Alert>
      )}
    </div>
  );
}