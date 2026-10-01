import { useAuth } from '@/contexts/AuthContext';
import type { ApiClient } from '@/lib/apiClient';

/**
 * Returns the authenticated API client from AuthContext.
 * Use this in components/hooks that need to call the Neon API.
 * Returns null when the user is not signed in.
 */
export function useApiClient(): ApiClient | null {
  const { api } = useAuth();
  return api;
}
