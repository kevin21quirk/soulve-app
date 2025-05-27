
import React, { createContext, useContext, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface ErrorContextType {
  reportError: (error: Error, context?: string) => void;
  clearErrors: () => void;
  errors: Array<{ error: Error; context?: string; timestamp: Date }>;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useErrorHandler = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useErrorHandler must be used within an ErrorProvider");
  }
  return context;
};

interface ErrorProviderProps {
  children: React.ReactNode;
}

export const ErrorProvider = ({ children }: ErrorProviderProps) => {
  const [errors, setErrors] = useState<Array<{ error: Error; context?: string; timestamp: Date }>>([]);
  const { toast } = useToast();

  const reportError = useCallback((error: Error, context?: string) => {
    console.error(`Error ${context ? `in ${context}` : ''}:`, error);
    
    setErrors(prev => [...prev, { error, context, timestamp: new Date() }]);
    
    toast({
      title: "Something went wrong",
      description: context ? `Error in ${context}: ${error.message}` : error.message,
      variant: "destructive",
    });
  }, [toast]);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  return (
    <ErrorContext.Provider value={{ reportError, clearErrors, errors }}>
      {children}
    </ErrorContext.Provider>
  );
};
