
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EnhancedLoadingStateProps {
  type?: 'spinner' | 'skeleton' | 'pulse' | 'dots';
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  error?: string | null;
  onRetry?: () => void;
  children?: React.ReactNode;
  className?: string;
}

const EnhancedLoadingState = ({
  type = 'spinner',
  size = 'md',
  message,
  error,
  onRetry,
  children,
  className = ''
}: EnhancedLoadingStateProps) => {
  if (error) {
    return (
      <Card className={`text-center p-8 ${className}`}>
        <CardContent>
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          {onRetry && (
            <Button onClick={onRetry} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  const LoadingComponent = () => {
    switch (type) {
      case 'skeleton':
        return (
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
          </div>
        );
      
      case 'pulse':
        return (
          <div className="flex items-center justify-center">
            <div className={`bg-blue-500 rounded-full animate-pulse ${sizeClasses[size]}`}></div>
          </div>
        );
      
      case 'dots':
        return (
          <div className="flex space-x-1 justify-center items-center">
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"></div>
          </div>
        );
      
      default:
        return (
          <div className="flex items-center justify-center">
            <Loader2 className={`animate-spin text-blue-500 ${sizeClasses[size]}`} />
          </div>
        );
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 p-8 ${className}`}>
      <LoadingComponent />
      {message && (
        <p className="text-gray-600 text-center">{message}</p>
      )}
      {children}
    </div>
  );
};

export default EnhancedLoadingState;
