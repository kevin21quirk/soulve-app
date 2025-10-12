import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface UseContentTranslationReturn {
  isTranslated: boolean;
  translatedText: string;
  isLoading: boolean;
  translate: (originalText: string, targetLanguage: string, sourceLanguage?: string) => Promise<void>;
  toggleTranslation: () => void;
  reset: () => void;
}

export const useContentTranslation = (
  contentId: string,
  contentType: 'post' | 'comment'
): UseContentTranslationReturn => {
  const [isTranslated, setIsTranslated] = useState(false);
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const translate = async (
    originalText: string, 
    targetLanguage: string,
    sourceLanguage?: string
  ) => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('translate-content', {
        body: { 
          contentId,
          contentType,
          text: originalText,
          targetLanguage,
          sourceLanguage 
        }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      setTranslatedText(data.translatedText);
      setIsTranslated(true);

    } catch (error: any) {
      console.error('Translation error:', error);
      
      let errorMessage = 'Failed to translate content';
      if (error.message?.includes('Rate limit')) {
        errorMessage = 'Translation rate limit reached. Please try again later.';
      } else if (error.message?.includes('credits')) {
        errorMessage = 'Translation service unavailable. Please try again later.';
      }

      toast({
        title: 'Translation failed',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleTranslation = () => {
    setIsTranslated(!isTranslated);
  };

  const reset = () => {
    setIsTranslated(false);
    setTranslatedText('');
  };

  return {
    isTranslated,
    translatedText,
    isLoading,
    translate,
    toggleTranslation,
    reset,
  };
};