
import { useState, useEffect, useCallback } from 'react';

interface OfflineData {
  [key: string]: any;
}

export const useOfflineStorage = (key: string) => {
  const [data, setData] = useState<OfflineData | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const saveOfflineData = useCallback((newData: OfflineData) => {
    try {
      localStorage.setItem(`offline_${key}`, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error('Failed to save offline data:', error);
    }
  }, [key]);

  const loadOfflineData = useCallback(() => {
    try {
      const stored = localStorage.getItem(`offline_${key}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        setData(parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Failed to load offline data:', error);
    }
    return null;
  }, [key]);

  const clearOfflineData = useCallback(() => {
    try {
      localStorage.removeItem(`offline_${key}`);
      setData(null);
    } catch (error) {
      console.error('Failed to clear offline data:', error);
    }
  }, [key]);

  const syncWithServer = useCallback(async (syncFunction: (data: OfflineData) => Promise<void>) => {
    if (data && isOnline) {
      try {
        await syncFunction(data);
        clearOfflineData();
      } catch (error) {
        console.error('Sync failed:', error);
      }
    }
  }, [data, isOnline, clearOfflineData]);

  useEffect(() => {
    loadOfflineData();
  }, [loadOfflineData]);

  return {
    data,
    isOnline,
    saveOfflineData,
    loadOfflineData,
    clearOfflineData,
    syncWithServer,
  };
};
