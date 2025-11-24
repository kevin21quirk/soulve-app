import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export const useTypingIndicator = (partnerId: string | null) => {
  const queryClient = useQueryClient();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const isTypingRef = useRef(false);

  // Notify that I'm typing
  const notifyTyping = async () => {
    if (!partnerId) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Upsert presence with typing indicator
    await supabase
      .from('user_presence')
      .upsert({
        user_id: user.id,
        typing_to_user_id: partnerId,
        typing_started_at: new Date().toISOString(),
        is_online: true,
        last_seen: new Date().toISOString(),
      });

    isTypingRef.current = true;

    // Clear typing after 3 seconds of inactivity
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(async () => {
      await stopTyping();
    }, 3000);
  };

  const stopTyping = async () => {
    if (!isTypingRef.current) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('user_presence')
      .update({
        typing_to_user_id: null,
        typing_started_at: null,
      })
      .eq('user_id', user.id);

    isTypingRef.current = false;
  };

  // Listen for partner's typing status
  useEffect(() => {
    if (!partnerId) return;

    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    };

    const setupSubscription = async () => {
      const user = await getUser();
      if (!user) return;

      const channel = supabase
        .channel('typing-indicator')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'user_presence',
            filter: `user_id=eq.${partnerId}`,
          },
          (payload) => {
            const presence = payload.new as any;
            
            // Update conversation state with typing indicator
            queryClient.setQueryData(['typing', partnerId], {
              isTyping: presence.typing_to_user_id === user.id,
              startedAt: presence.typing_started_at,
            });
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    const cleanup = setupSubscription();
    
    return () => {
      cleanup.then(fn => fn?.());
      stopTyping();
    };
  }, [partnerId, queryClient]);

  return { notifyTyping, stopTyping };
};
