'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error?: Error; resetError: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

const DefaultErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({
  error,
  resetError
}) => (
  <Card className="w-full max-w-md mx-auto mt-8">
    <CardHeader className="text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
        <AlertTriangle className="h-6 w-6 text-red-600" />
      </div>
      <CardTitle className="text-red-900">Something went wrong</CardTitle>
      <CardDescription>
        An unexpected error occurred. Please try refreshing the page.
      </CardDescription>
    </CardHeader>
    <CardContent className="text-center space-y-4">
      {error && (
        <details className="text-left text-sm text-slate-600 bg-slate-50 p-3 rounded">
          <summary className="cursor-pointer font-medium">Error details</summary>
          <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
        </details>
      )}
      <Button onClick={resetError} className="w-full">
        <RefreshCw className="mr-2 h-4 w-4" />
        Try again
      </Button>
    </CardContent>
  </Card>
);

export default ErrorBoundary;