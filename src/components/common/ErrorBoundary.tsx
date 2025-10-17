import { Component } from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error capturado:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-base-200">
            <div className="card bg-base-100 shadow-xl w-96">
                <div className="card-body">
                <h2 className="card-title text-error">Algo salió mal</h2>
                <p className="text-sm text-base-content/70">
                    {this.state.error?.message || 'Ocurrió un error inesperado'}
                </p>
                <div className="card-actions justify-end mt-4">
                    <button
                    className="btn btn-primary"
                    onClick={() => window.location.reload()}
                    >
                    Recargar página
                    </button>
                </div>
                </div>
            </div>
            </div>
        );
        }

        return this.props.children;
    }
}