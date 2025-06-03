
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  sender_role: 'requester' | 'helper';
  content: string;
  created_at: string;
}

export const useSafeSpaceSession = (sessionId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    fetchMessages();
    subscribeToMessages();
    setIsConnected(true);

    return () => {
      setIsConnected(false);
    };
  }, [sessionId]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('safe_space_messages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const subscribeToMessages = () => {
    const channel = supabase
      .channel(`safe-space-session-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'safe_space_messages',
          filter: `session_id=eq.${sessionId}`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (content: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Determine sender role based on session
      const { data: session } = await supabase
        .from('safe_space_sessions')
        .select('requester_id, helper_id')
        .eq('id', sessionId)
        .single();

      if (!session) throw new Error('Session not found');

      const senderRole = session.requester_id === user.id ? 'requester' : 'helper';

      const { error } = await supabase
        .from('safe_space_messages')
        .insert({
          session_id: sessionId,
          sender_role: senderRole,
          content: content.trim(),
          message_type: 'text'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  const endSession = async (rating?: number) => {
    try {
      const endTime = new Date().toISOString();
      const { data: session } = await supabase
        .from('safe_space_sessions')
        .select('started_at')
        .eq('id', sessionId)
        .single();

      let durationMinutes = 0;
      if (session?.started_at) {
        const startTime = new Date(session.started_at);
        const endTimeDate = new Date(endTime);
        durationMinutes = Math.floor((endTimeDate.getTime() - startTime.getTime()) / 60000);
      }

      const { error } = await supabase
        .from('safe_space_sessions')
        .update({
          status: 'ended',
          ended_at: endTime,
          duration_minutes: durationMinutes,
          feedback_rating: rating
        })
        .eq('id', sessionId);

      if (error) throw error;

      // Navigate away from session
      window.location.reload();
    } catch (error) {
      console.error('Error ending session:', error);
      throw error;
    }
  };

  const rateSession = async (rating: number) => {
    try {
      const { error } = await supabase
        .from('safe_space_sessions')
        .update({ feedback_rating: rating })
        .eq('id', sessionId);

      if (error) throw error;
    } catch (error) {
      console.error('Error rating session:', error);
      throw error;
    }
  };

  return {
    messages,
    isConnected,
    sendMessage,
    endSession,
    rateSession
  };
};
