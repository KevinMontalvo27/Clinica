interface CardProps {
    children: React.ReactNode;
    title?: string;
    subtitle?: string;
    footer?: React.ReactNode;
    actions?: React.ReactNode;
    className?: string;
    bordered?: boolean;
    shadow?: string;
}

export default function Card({
    children,
    title,
    subtitle,
    footer,
    className = '',
    actions,
    bordered = true,
    shadow = 'shadow-md',
}: CardProps) {
    const borderClass = bordered ? 'border border-base-300' : '';

    return (
        <div className={`card bg-base-100 ${shadow} ${borderClass} ${className}`}>
            {(title || subtitle) && (
                <div className="card-body">
                    {title && <h2 className="card-title text-lg font-bold">{title}</h2>}
                    {subtitle && <p className="text-sm text-base-content/60">{subtitle}</p>}
                </div>
            )}
        
            <div className={title || subtitle ? 'px-6 pb-6' : 'card-body'}>
                {children}
            </div>

            {actions && (
                <div className="card-actions justify-end p-6 pt-0 gap-2">
                    {actions}
                </div>
            )}

            {footer && (
                <>
                <div className="divider my-0"></div>
                <div className="card-body pt-4">
                    {footer}
                </div>
                </>
            )}
        </div>
    );
}