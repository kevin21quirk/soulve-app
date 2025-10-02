import { useCallback, useRef } from 'react';

export const useNotificationSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playNotificationSound = useCallback(async (type: 'default' | 'urgent' = 'default') => {
    try {
      const audioContext = initAudioContext();
      
      // Create oscillator for notification sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Different frequencies for different notification types
      if (type === 'urgent') {
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.3;
        
        // Play two quick beeps for urgent
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
        
        const oscillator2 = audioContext.createOscillator();
        const gainNode2 = audioContext.createGain();
        oscillator2.connect(gainNode2);
        gainNode2.connect(audioContext.destination);
        oscillator2.frequency.value = 900;
        gainNode2.gain.value = 0.3;
        oscillator2.start(audioContext.currentTime + 0.15);
        oscillator2.stop(audioContext.currentTime + 0.25);
      } else {
        oscillator.frequency.value = 600;
        gainNode.gain.value = 0.2;
        
        // Single short beep for default
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      }
    } catch (error) {
      console.error('Error playing notification sound:', error);
    }
  }, [initAudioContext]);

  return { playNotificationSound };
};
