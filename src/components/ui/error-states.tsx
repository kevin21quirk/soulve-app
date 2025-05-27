
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  type?: "network" | "server" | "validation" | "general";
}

export const ErrorState = ({ 
  title, 
  message, 
  onRetry, 
  type = "general" 
}: ErrorStateProps) => {
  const getErrorConfig = () => {
    switch (type) {
      case "network":
        return {
          icon: WifiOff,
          defaultTitle: "Connection Problem",
          defaultMessage: "Please check your internet connection and try again.",
          color: "text-orange-600"
        };
      case "server":
        return {
          icon: AlertTriangle,
          defaultTitle: "Server Error",
          defaultMessage: "Something went wrong on our end. Please try again later.",
          color: "text-red-600"
        };
      case "validation":
        return {
          icon: AlertTriangle,
          defaultTitle: "Invalid Data",
          defaultMessage: "The data received is not in the expected format.",
          color: "text-yellow-600"
        };
      default:
        return {
          icon: AlertTriangle,
          defaultTitle: "Something went wrong",
          defaultMessage: "An unexpected error occurred. Please try again.",
          color: "text-gray-600"
        };
    }
  };

  const config = getErrorConfig();
  const Icon = config.icon;

  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-8 text-center">
        <Icon className={`h-12 w-12 ${config.color} mb-4`} />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title || config.defaultTitle}
        </h3>
        <p className="text-gray-600 mb-4 max-w-md">
          {message || config.defaultMessage}
        </p>
        {onRetry && (
          <Button onClick={onRetry} variant="outline" className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export const InlineError = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div className="flex items-center space-x-2 text-red-600 text-sm py-2">
    <AlertTriangle className="h-4 w-4" />
    <span>{message}</span>
    {onRetry && (
      <Button variant="ghost" size="sm" onClick={onRetry} className="h-6 px-2">
        <RefreshCw className="h-3 w-3" />
      </Button>
    )}
  </div>
);

export const NetworkStatus = () => {
  const isOnline = navigator.onLine;
  
  if (isOnline) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50">
      <div className="flex items-center justify-center space-x-2">
        <WifiOff className="h-4 w-4" />
        <span>You're offline. Some features may not work.</span>
      </div>
    </div>
  );
};
