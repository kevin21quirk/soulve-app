import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface LanguageDetectionResult {
  needsTranslation: boolean;
  detectedLanguage: string;
  confidence: number;
  isLoading: boolean;
}

export const useLanguageDetection = (
  text: string, 
  userPreferredLanguage: string = 'en',
  enabled: boolean = true
): LanguageDetectionResult => {
  const { data, isLoading } = useQuery({
    queryKey: ['language-detection', text.substring(0, 100)],
    queryFn: async () => {
      if (!text || text.trim().length < 10) {
        return { language: userPreferredLanguage, confidence: 1.0 };
      }

      const { data, error } = await supabase.functions.invoke('detect-language', {
        body: { text: text.substring(0, 500) } // Only check first 500 chars
      });

      if (error) {
        console.error('Language detection error:', error);
        return { language: 'unknown', confidence: 0 };
      }

      return data;
    },
    enabled: enabled && !!text && text.trim().length >= 10,
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });

  const detectedLanguage = data?.language || 'unknown';
  const needsTranslation = 
    detectedLanguage !== 'unknown' && 
    detectedLanguage !== userPreferredLanguage &&
    (data?.confidence || 0) > 0.7;

  return {
    needsTranslation,
    detectedLanguage,
    confidence: data?.confidence || 0,
    isLoading,
  };
};