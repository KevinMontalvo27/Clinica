interface BadgeProps {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error' | 'info' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function Badge({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
}: BadgeProps) {
    const variants: Record<string, string> = {
        primary: 'badge-primary',
        secondary: 'badge-secondary',
        accent: 'badge-accent',
        success: 'badge-success',
        warning: 'badge-warning',
        error: 'badge-error',
        info: 'badge-info',
        ghost: 'badge-ghost',
    };

    const sizes: Record<string, string> = {
        sm: 'badge-sm',
        md: 'badge-md',
        lg: 'badge-lg',
    };

    return (
        <div className={`badge ${variants[variant]} ${sizes[size]} ${className}`}>
        {children}
        </div>
    );
}