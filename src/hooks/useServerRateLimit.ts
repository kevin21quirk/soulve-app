import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ServerRateLimitConfig {
  limitType: string;
  maxRequests: number;
  windowSeconds: number;
}

interface ServerRateLimitState {
  isLimited: boolean;
  canProceed: (operation: string) => Promise<boolean>;
}

export const useServerRateLimit = (config: ServerRateLimitConfig): ServerRateLimitState => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLimited, setIsLimited] = useState(false);

  const canProceed = useCallback(async (operation: string): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to continue.",
        variant: "destructive"
      });
      return false;
    }

    try {
      // Check rate limit using server-side function
      const { data, error } = await supabase.rpc('check_rate_limit', {
        target_user_id: user.id,
        limit_type: config.limitType,
        max_requests: config.maxRequests,
        window_seconds: config.windowSeconds
      });

      if (error) {
        console.error('Rate limit check error:', error);
        // Allow operation on error to avoid blocking users
        return true;
      }

      const allowed = data as boolean;
      setIsLimited(!allowed);

      if (!allowed) {
        toast({
          title: "Rate limit exceeded",
          description: `Too many ${operation} attempts. Please wait before trying again.`,
          variant: "destructive"
        });
      }

      return allowed;
    } catch (error) {
      console.error('Server rate limit error:', error);
      // Allow operation on error to avoid blocking users
      return true;
    }
  }, [user, config, toast]);

  return {
    isLimited,
    canProceed
  };
};

// Specific rate limit hooks for common operations
export const usePostCreationServerRateLimit = () => {
  return useServerRateLimit({
    limitType: 'post_creation',
    maxRequests: 10,
    windowSeconds: 300 // 5 minutes
  });
};

export const useReportServerRateLimit = () => {
  return useServerRateLimit({
    limitType: 'reporting',
    maxRequests: 5,
    windowSeconds: 3600 // 1 hour
  });
};

export const useCommentServerRateLimit = () => {
  return useServerRateLimit({
    limitType: 'commenting',
    maxRequests: 30,
    windowSeconds: 300 // 5 minutes
  });
};

export const useMessageServerRateLimit = () => {
  return useServerRateLimit({
    limitType: 'messaging',
    maxRequests: 50,
    windowSeconds: 300 // 5 minutes
  });
};