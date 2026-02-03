import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import Button from './Button';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
                    <div className="bg-rose-50 p-4 rounded-full mb-6">
                        <AlertCircle className="h-12 w-12 text-rose-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
                    <p className="text-gray-600 mb-8 max-w-md">
                        We encountered an unexpected error. Please try refreshing the page.
                    </p>
                    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-8 w-full max-w-lg text-left overflow-auto max-h-48">
                        <code className="text-xs text-rose-600 font-mono">
                            {this.state.error?.toString()}
                        </code>
                    </div>
                    <Button
                        variant="primary"
                        onClick={() => window.location.reload()}
                        className="gap-2"
                    >
                        <RefreshCw size={18} />
                        Reload Application
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
