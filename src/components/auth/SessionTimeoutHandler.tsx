import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

export const SessionTimeoutHandler = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    if (!session?.expires_at) return;

    const checkSession = () => {
      const now = Math.floor(Date.now() / 1000);
      const expiresAt = session.expires_at || 0;
      const remaining = expiresAt - now;

      // Show warning 5 minutes before expiry
      if (remaining > 0 && remaining <= 300 && !showWarning) {
        setShowWarning(true);
        setTimeRemaining(remaining);
      } else if (remaining <= 0) {
        handleSessionExpired();
      }
    };

    // Check immediately
    checkSession();

    // Check every 30 seconds
    const interval = setInterval(checkSession, 30000);

    return () => clearInterval(interval);
  }, [session, showWarning]);

  const handleSessionExpired = async () => {
    setShowWarning(false);
    await signOut();
    toast({
      title: 'Session expired',
      description: 'Your session has expired. Please sign in again.',
      variant: 'destructive',
    });
    navigate('/auth');
  };

  const handleExtendSession = async () => {
    try {
      // Refresh the session
      const { error } = await supabase.auth.refreshSession();
      
      if (error) throw error;

      setShowWarning(false);
      toast({
        title: 'Session extended',
        description: 'Your session has been successfully extended.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to extend session',
        description: error.message,
        variant: 'destructive',
      });
      await signOut();
      navigate('/auth');
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Session Expiring Soon</DialogTitle>
          <DialogDescription>
            Your session will expire in {formatTime(timeRemaining)}. Would you like to continue?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleSessionExpired}>
            Sign Out
          </Button>
          <Button onClick={handleExtendSession}>
            Continue Session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
