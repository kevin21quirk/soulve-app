
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useTypingIndicator = (userId: string | undefined, partnerId: string | null) => {
  const { toast } = useToast();
  const [isTyping, setIsTyping] = useState(false);
  const [partnerTyping, setPartnerTyping] = useState(false);

  const updateTypingStatus = useCallback(async (typing: boolean) => {
    if (!userId || !partnerId) return;

    try {
      await supabase
        .from('typing_indicators')
        .upsert({
          user_id: userId,
          conversation_partner_id: partnerId,
          is_typing: typing,
          updated_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  }, [userId, partnerId]);

  const startTyping = useCallback(() => {
    setIsTyping(true);
    updateTypingStatus(true);
  }, [updateTypingStatus]);

  const stopTyping = useCallback(() => {
    setIsTyping(false);
    updateTypingStatus(false);
  }, [updateTypingStatus]);

  // Listen for partner's typing status
  useEffect(() => {
    if (!userId || !partnerId) return;

    const channel = supabase
      .channel(`typing-${partnerId}-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_indicators',
          filter: `user_id=eq.${partnerId}:and:conversation_partner_id=eq.${userId}`
        },
        (payload) => {
          if (payload.new) {
            setPartnerTyping(payload.new.is_typing);
            // Auto-clear typing indicator after 3 seconds
            if (payload.new.is_typing) {
              setTimeout(() => setPartnerTyping(false), 3000);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, partnerId]);

  // Auto-stop typing after 3 seconds of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isTyping) {
      timeout = setTimeout(() => {
        stopTyping();
      }, 3000);
    }
    return () => clearTimeout(timeout);
  }, [isTyping, stopTyping]);

  return {
    isTyping,
    partnerTyping,
    startTyping,
    stopTyping
  };
};
