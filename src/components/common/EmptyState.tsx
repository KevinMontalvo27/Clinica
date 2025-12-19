interface EmptyStateProps {
    icon?: string;
    title?: string;
    description?: string;
    action?: () => void;
    actionLabel?: string;
    className?: string;
    children?: React.ReactNode;
}

export default function EmptyState({
    icon = '📭',
    title = 'Sin resultados',
    description = 'No hay datos para mostrar',
    action,
    actionLabel = 'Crear nuevo',
    className = '',
    children,
}: EmptyStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}>
        <div className="text-6xl mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-base-content mb-2">{title}</h3>
        <p className="text-base-content/60 mb-6 max-w-sm">{description}</p>
        {children ? children: action && (
            <button onClick={action} className="btn btn-primary btn-sm">
            {actionLabel}
            </button>
        )}
        </div>
    );
}