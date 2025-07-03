
import { useState, useCallback } from 'react';

interface LoadingState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

export const useLoadingState = (initialLoading = false) => {
  const [state, setState] = useState<LoadingState>({
    isLoading: initialLoading,
    error: null,
    success: false
  });

  const setLoading = useCallback((loading: boolean) => {
    setState(prev => ({ ...prev, isLoading: loading, error: null, success: false }));
  }, []);

  const setError = useCallback((error: string) => {
    setState({ isLoading: false, error, success: false });
  }, []);

  const setSuccess = useCallback(() => {
    setState({ isLoading: false, error: null, success: true });
  }, []);

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, success: false });
  }, []);

  const executeAsync = useCallback(async <T>(
    asyncFn: () => Promise<T>,
    onSuccess?: (result: T) => void,
    onError?: (error: Error) => void
  ): Promise<T | null> => {
    try {
      setLoading(true);
      const result = await asyncFn();
      setSuccess();
      onSuccess?.(result);
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
      return null;
    }
  }, [setLoading, setError, setSuccess]);

  return {
    ...state,
    setLoading,
    setError,
    setSuccess,
    reset,
    executeAsync
  };
};
