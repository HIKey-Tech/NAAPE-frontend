'use client';

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

interface ApiErrorBoundaryProps {
  error: string | null;
  isLoading: boolean;
  onRetry: () => void;
  children: React.ReactNode;
  loadingMessage?: string;
}

export const ApiErrorBoundary: React.FC<ApiErrorBoundaryProps> = ({
  error,
  isLoading,
  onRetry,
  children,
  loadingMessage = "Loading..."
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-500">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-red-900">Error Loading Data</CardTitle>
          <CardDescription>
            {error}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <Button onClick={onRetry} className="w-full">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};

export default ApiErrorBoundary;