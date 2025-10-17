interface ModalProps {
    isOpen: boolean;
    title?: string;
    children: React.ReactNode;
    onClose: () => void;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    closeButton?: boolean;
}

export default function Modal({
    isOpen,
    title,
    children,
    onClose,
    footer,
    size = 'md',
    className = '',
    closeButton = true,
}: ModalProps) {
    if (!isOpen) return null;

    const sizes: Record<string, string> = {
        sm: 'modal-box w-11/12 max-w-sm',
        md: 'modal-box w-11/12 max-w-md',
        lg: 'modal-box w-11/12 max-w-lg',
        xl: 'modal-box w-11/12 max-w-xl',
    };

    return (
        <div className="modal modal-open">
        <div className={`${sizes[size]} ${className}`}>
            {closeButton && (
            <button
                onClick={onClose}
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
                ✕
            </button>
            )}

            {title && <h3 className="font-bold text-lg">{title}</h3>}

            <div className="py-4">
            {children}
            </div>

            {footer && (
            <div className="modal-action">
                {footer}
            </div>
            )}

            {!footer && (
            <div className="modal-action">
                <button onClick={onClose} className="btn btn-sm">
                Cerrar
                </button>
            </div>
            )}
        </div>
        <form method="dialog" className="modal-backdrop" onClick={onClose}>
            <button>cerrar</button>
        </form>
        </div>
    );
}