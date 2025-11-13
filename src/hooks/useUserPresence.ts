
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export interface UserPresence {
  userId: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen: string;
  activity?: string;
}

export const useUserPresence = () => {
  const { user } = useAuth();
  const [userPresences, setUserPresences] = useState<Record<string, UserPresence>>({});
  const [currentUserStatus, setCurrentUserStatus] = useState<UserPresence['status']>('online');

  const updateUserStatus = useCallback((status: UserPresence['status'], activity?: string) => {
    if (!user) return;

    setCurrentUserStatus(status);
    
    setUserPresences(prev => ({
      ...prev,
      [user.id]: {
        userId: user.id,
        status,
        lastSeen: new Date().toISOString(),
        activity
      }
    }));
  }, [user]);

  const getUserPresence = useCallback((userId: string): UserPresence | null => {
    return userPresences[userId] || null;
  }, [userPresences]);

  const isUserOnline = useCallback((userId: string): boolean => {
    const presence = getUserPresence(userId);
    return presence?.status === 'online';
  }, [getUserPresence]);

  // Simulate presence updates
  useEffect(() => {
    if (!user) return;

    // Set initial status
    updateUserStatus('online');

    // Simulate other users being online
    const mockPresences: Record<string, UserPresence> = {
      'user-1': {
        userId: 'user-1',
        status: 'online',
        lastSeen: new Date().toISOString(),
        activity: 'Viewing feed'
      },
      'user-2': {
        userId: 'user-2',
        status: 'away',
        lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      'user-3': {
        userId: 'user-3',
        status: 'online',
        lastSeen: new Date().toISOString(),
        activity: 'In messaging'
      }
    };

    setUserPresences(prev => ({ ...prev, ...mockPresences }));

    // Auto-update status based on activity (debounced to prevent rapid updates)
    let debounceTimer: NodeJS.Timeout;
    const handleVisibilityChange = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (document.hidden) {
          updateUserStatus('away');
        } else {
          updateUserStatus('online');
        }
      }, 300); // Wait 300ms before updating to prevent rapid state changes
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(debounceTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      updateUserStatus('offline');
    };
  }, [user, updateUserStatus]);

  return {
    userPresences,
    currentUserStatus,
    updateUserStatus,
    getUserPresence,
    isUserOnline
  };
};
