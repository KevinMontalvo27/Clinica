interface ConfirmDialogProps {
    isOpen: boolean;
    title?: string;
    message?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    isDangerous?: boolean;
    isLoading?: boolean;
}

export default function ConfirmDialog({
    isOpen,
    title = 'Confirmar',
    message = '¿Está seguro?',
    confirmText = 'Confirmar',
    cancelText = 'Cancelar',
    onConfirm,
    onCancel,
    isDangerous = false,
    isLoading = false,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    const confirmButtonClass = isDangerous ? 'btn btn-error' : 'btn btn-primary';

    return (
        <div className="modal modal-open">
        <div className="modal-box">
            <h3 className="font-bold text-lg">{title}</h3>
            <p className="py-4 text-base-content/70">{message}</p>
            <div className="modal-action">
            <button
                onClick={onCancel}
                className="btn btn-ghost"
                disabled={isLoading}
            >
                {cancelText}
            </button>
            <button
                onClick={onConfirm}
                className={confirmButtonClass}
                disabled={isLoading}
            >
                {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
                ) : (
                confirmText
                )}
            </button>
            </div>
        </div>
        <form method="dialog" className="modal-backdrop" onClick={onCancel}>
            <button>cerrar</button>
        </form>
        </div>
    );
}