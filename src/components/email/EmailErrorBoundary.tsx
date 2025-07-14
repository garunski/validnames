"use client";

import { Card } from "@/components/Card";
import { Button } from "@/primitives/button";
import { Component, ReactNode } from "react";

interface EmailErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface EmailErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class EmailErrorBoundary extends Component<
  EmailErrorBoundaryProps,
  EmailErrorBoundaryState
> {
  constructor(props: EmailErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): EmailErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("Email component error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="border-red-200 bg-red-50 p-4">
          <h3 className="mb-2 text-sm font-medium text-red-800">
            Email Service Error
          </h3>
          <p className="mb-3 text-sm text-red-700">
            Something went wrong with the email service. Please try again.
          </p>
          <Button onClick={this.handleRetry} outline>
            Try Again
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}
