import React from "react";

interface FeatureErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  featureName?: string;
}

interface FeatureErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class FeatureErrorBoundary extends React.Component<
  FeatureErrorBoundaryProps,
  FeatureErrorBoundaryState
> {
  constructor(props: FeatureErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to an error reporting service if needed
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.error(
        `FeatureErrorBoundary caught an error in ${this.props.featureName || "unknown feature"}:`,
        error,
        errorInfo,
      );
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center dark:border-red-800 dark:bg-red-900/20">
            <h2 className="mb-2 text-lg font-semibold text-red-700 dark:text-red-200">
              {this.props.featureName
                ? `${this.props.featureName} Error`
                : "Something went wrong"}
            </h2>
            <p className="text-sm text-red-600 dark:text-red-300">
              {this.state.error?.message ||
                "An unexpected error occurred in this feature."}
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
