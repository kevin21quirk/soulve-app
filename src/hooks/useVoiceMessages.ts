
import { useState, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface VoiceMessage {
  id: string;
  url: string;
  duration: number;
  waveform: number[];
  transcript?: string;
}

export const useVoiceMessages = () => {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState<Record<string, boolean>>({});
  const [currentTime, setCurrentTime] = useState<Record<string, number>>({});
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        const url = URL.createObjectURL(blob);
        
        // Simulate voice message creation
        const voiceMessage: VoiceMessage = {
          id: `voice-${Date.now()}`,
          url,
          duration: chunks.length * 0.1, // Approximate duration
          waveform: Array.from({ length: 50 }, () => Math.random() * 100),
          transcript: "Voice message recorded"
        };

        toast({
          title: "Voice message recorded",
          description: "Your voice message is ready to send"
        });
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast({
        title: "Recording failed",
        description: "Could not access microphone",
        variant: "destructive"
      });
    }
  }, [toast]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const playVoiceMessage = useCallback((voiceMessage: VoiceMessage) => {
    const { id, url } = voiceMessage;
    
    if (!audioRefs.current[id]) {
      audioRefs.current[id] = new Audio(url);
      
      audioRefs.current[id].addEventListener('timeupdate', () => {
        setCurrentTime(prev => ({
          ...prev,
          [id]: audioRefs.current[id].currentTime
        }));
      });

      audioRefs.current[id].addEventListener('ended', () => {
        setIsPlaying(prev => ({ ...prev, [id]: false }));
        setCurrentTime(prev => ({ ...prev, [id]: 0 }));
      });
    }

    const audio = audioRefs.current[id];
    
    if (isPlaying[id]) {
      audio.pause();
      setIsPlaying(prev => ({ ...prev, [id]: false }));
    } else {
      audio.play();
      setIsPlaying(prev => ({ ...prev, [id]: true }));
    }
  }, [isPlaying]);

  const seekVoiceMessage = useCallback((voiceMessageId: string, time: number) => {
    const audio = audioRefs.current[voiceMessageId];
    if (audio) {
      audio.currentTime = time;
      setCurrentTime(prev => ({ ...prev, [voiceMessageId]: time }));
    }
  }, []);

  return {
    isRecording,
    isPlaying,
    currentTime,
    startRecording,
    stopRecording,
    playVoiceMessage,
    seekVoiceMessage
  };
};
