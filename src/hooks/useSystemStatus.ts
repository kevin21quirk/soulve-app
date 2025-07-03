
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SystemStatus {
  database: 'healthy' | 'degraded' | 'down';
  auth: 'healthy' | 'degraded' | 'down';
  storage: 'healthy' | 'degraded' | 'down';
  contentModeration: 'healthy' | 'degraded' | 'down';
  emailService: 'healthy' | 'degraded' | 'down';
  overallStatus: 'healthy' | 'degraded' | 'down';
  lastChecked: Date;
}

export const useSystemStatus = () => {
  const { user } = useAuth();
  const [status, setStatus] = useState<SystemStatus>({
    database: 'healthy',
    auth: 'healthy',
    storage: 'healthy',
    contentModeration: 'healthy',
    emailService: 'healthy',
    overallStatus: 'healthy',
    lastChecked: new Date()
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkDatabaseHealth = async (): Promise<'healthy' | 'degraded' | 'down'> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
      
      return error ? 'degraded' : 'healthy';
    } catch {
      return 'down';
    }
  };

  const checkAuthHealth = async (): Promise<'healthy' | 'degraded' | 'down'> => {
    try {
      const { data, error } = await supabase.auth.getSession();
      return error ? 'degraded' : 'healthy';
    } catch {
      return 'down';
    }
  };

  const checkStorageHealth = async (): Promise<'healthy' | 'degraded' | 'down'> => {
    try {
      const { data, error } = await supabase.storage
        .from('avatars')
        .list('', { limit: 1 });
      
      return error ? 'degraded' : 'healthy';
    } catch {
      return 'down';
    }
  };

  const checkContentModerationHealth = async (): Promise<'healthy' | 'degraded' | 'down'> => {
    try {
      // Test basic content moderation functionality
      const testContent = "This is a test message for system health check";
      const { ContentModerationService } = await import('@/services/contentModerationService');
      
      const result = await ContentModerationService.filterContent(testContent);
      return result ? 'healthy' : 'degraded';
    } catch {
      return 'degraded';
    }
  };

  const checkEmailServiceHealth = async (): Promise<'healthy' | 'degraded' | 'down'> => {
    try {
      // Test edge function availability (not actual email sending)
      const { data, error } = await supabase.functions.invoke('send-waitlist-email', {
        body: { test: true }
      });
      
      // Edge function exists and responds (even with error for test data)
      return 'healthy';
    } catch (error: any) {
      // If function doesn't exist or major error
      return error.message?.includes('Function not found') ? 'down' : 'degraded';
    }
  };

  const checkSystemStatus = async () => {
    setIsChecking(true);
    
    try {
      const [database, auth, storage, contentModeration, emailService] = await Promise.all([
        checkDatabaseHealth(),
        checkAuthHealth(),
        checkStorageHealth(),
        checkContentModerationHealth(),
        checkEmailServiceHealth()
      ]);

      // Determine overall status
      const services = [database, auth, storage, contentModeration, emailService];
      const downCount = services.filter(s => s === 'down').length;
      const degradedCount = services.filter(s => s === 'degraded').length;
      
      let overallStatus: 'healthy' | 'degraded' | 'down';
      if (downCount > 1 || database === 'down' || auth === 'down') {
        overallStatus = 'down';
      } else if (downCount > 0 || degradedCount > 2) {
        overallStatus = 'degraded';
      } else {
        overallStatus = 'healthy';
      }

      setStatus({
        database,
        auth,
        storage,
        contentModeration,
        emailService,
        overallStatus,
        lastChecked: new Date()
      });
    } catch (error) {
      console.error('System status check failed:', error);
      setStatus({
        database: 'down',
        auth: 'down',
        storage: 'down',
        contentModeration: 'down',
        emailService: 'down',
        overallStatus: 'down',
        lastChecked: new Date()
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    // Initial check
    checkSystemStatus();
    
    // Check every 5 minutes
    const interval = setInterval(checkSystemStatus, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    status,
    isChecking,
    checkSystemStatus
  };
};
