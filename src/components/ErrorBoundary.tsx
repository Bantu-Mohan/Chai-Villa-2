import { Component, type ErrorInfo, type ReactNode } from "react";

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
        error: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: "2rem", color: "#333", textAlign: "center", fontFamily: "sans-serif" }}>
                    <h1>Oops, something went wrong.</h1>
                    <p style={{ color: "red" }}>{this.state.error?.message}</p>
                    <p>Please check your configuration or try refreshing.</p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{ padding: "10px 20px", marginTop: "20px", cursor: "pointer" }}
                    >
                        Reload Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
