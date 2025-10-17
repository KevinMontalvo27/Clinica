import { useState } from 'react';

interface AlertProps {
    children: React.ReactNode;
    type?: 'info' | 'success' | 'warning' | 'error';
    title?: string;
    closeable?: boolean;
    onClose?: () => void;
    className?: string;
    icon?: boolean;
}

export default function Alert({
    children,
    type = 'info',
    title,
    closeable = false,
    onClose,
    className = '',
    icon = true,
}: AlertProps) {
    const types: Record<string, string> = {
        info: 'alert-info',
        success: 'alert-success',
        warning: 'alert-warning',
        error: 'alert-error',
    };

    const icons: Record<string, string> = {
        info: '❗',
        success: '✓',
        warning: '⚠',
        error: '✕',
    };

    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    const handleClose = () => {
        setIsVisible(false);
        onClose?.();
    };

    return (
        <div role="alert" className={`alert ${types[type]} ${className}`}>
        <div className="flex items-start gap-3 flex-1">
            {icon && <span className="text-lg">{icons[type]}</span>}
            <div>
            {title && <h3 className="font-bold">{title}</h3>}
            <div className="text-sm">{children}</div>
            </div>
        </div>
        {closeable && (
            <button
            onClick={handleClose}
            className="btn btn-sm btn-ghost"
            >
            ✕
            </button>
        )}
        </div>
    );
}