interface SpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'error';
    text?: string;
    className?: string;
}

export default function Spinner({
    size = 'md',
    color = 'primary',
    text,
    className = '',
}: SpinnerProps) {
    const sizes: Record<string, string> = {
        xs: 'w-6 h-6',
        sm: 'w-8 h-8',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
        xl: 'w-20 h-20',
    };

    const colors: Record<string, string> = {
        primary: 'text-primary',
        secondary: 'text-secondary',
        accent: 'text-accent',
        success: 'text-success',
        warning: 'text-warning',
        error: 'text-error',
    };

    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
        <svg
            className={`animate-spin ${sizes[size]} ${colors[color]}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
        {text && <p className="text-sm text-base-content/60">{text}</p>}
        </div>
    );
}