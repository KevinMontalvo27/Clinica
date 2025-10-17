import Spinner from "./Spinner";

interface LoadingOverlayProps {
    isLoading: boolean;
    children: React.ReactNode;
    spinnerSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    message?: string;
}

export default function LoadingOverlay({
    isLoading,
    children,
    spinnerSize = 'md',
    message = 'Cargando...',
}: LoadingOverlayProps) {
    if (!isLoading) return <>{children}</>;

    return (
        <div className="relative">
        {children}
        <div className="absolute inset-0 bg-base-100/50 backdrop-blur-sm rounded-lg flex items-center justify-center z-50">
            <Spinner size={spinnerSize} text={message} />
        </div>
        </div>
    );
}