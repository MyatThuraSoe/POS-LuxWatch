import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallback?: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: Error;
};

const defaultFallback = (
  <div className="container-shell flex min-h-[50vh] items-center justify-center py-10">
    <div className="max-w-md rounded-3xl border border-rose-200 bg-rose-50 p-6 text-center shadow-sm dark:border-rose-900 dark:bg-rose-950/40">
      <h1 className="text-xl font-semibold text-rose-700 dark:text-rose-300">
        Something went wrong
      </h1>
      <p className="mt-2 text-sm text-rose-600 dark:text-rose-200">
        The frontend shell hit an unexpected error. Refresh the page to try again.
      </p>
    </div>
  </div>
);

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback ?? defaultFallback;
    }

    return this.props.children;
  }
}
