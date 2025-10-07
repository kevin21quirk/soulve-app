
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  sender_role: 'requester' | 'helper';
  content: string;
  created_at: string;
}

interface SessionStatus {
  isPaused: boolean;
  pausedReason?: string;
  pausedAt?: string;
}

export const useSafeSpaceSession = (sessionId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>({ isPaused: false });

  useEffect(() => {
    fetchMessages();
    fetchSessionStatus();
    subscribeToMessages();
    subscribeToSessionStatus();
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
      if (data) {
        // Type cast the sender_role to ensure it matches our interface
        const typedMessages: Message[] = data.map(msg => ({
          id: msg.id,
          sender_role: msg.sender_role as 'requester' | 'helper',
          content: msg.content,
          created_at: msg.created_at
        }));
        setMessages(typedMessages);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchSessionStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('safe_space_sessions')
        .select('session_paused, paused_reason, paused_at')
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      if (data) {
        setSessionStatus({
          isPaused: data.session_paused || false,
          pausedReason: data.paused_reason,
          pausedAt: data.paused_at
        });
      }
    } catch (error) {
      console.error('Error fetching session status:', error);
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
          const newMessage: Message = {
            id: payload.new.id,
            sender_role: payload.new.sender_role as 'requester' | 'helper',
            content: payload.new.content,
            created_at: payload.new.created_at
          };
          setMessages(prev => [...prev, newMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const subscribeToSessionStatus = () => {
    const channel = supabase
      .channel(`safe-space-session-status-${sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'safe_space_sessions',
          filter: `id=eq.${sessionId}`
        },
        (payload) => {
          setSessionStatus({
            isPaused: payload.new.session_paused || false,
            pausedReason: payload.new.paused_reason,
            pausedAt: payload.new.paused_at
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async (content: string) => {
    try {
      // Check if session is paused before allowing message send
      if (sessionStatus.isPaused) {
        throw new Error('This session has been paused by the safeguarding team. Please contact support for assistance.');
      }

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

      const { data: newMessage, error } = await supabase
        .from('safe_space_messages')
        .insert({
          session_id: sessionId,
          sender_role: senderRole,
          content: content.trim(),
          message_type: 'text'
        })
        .select()
        .single();

      if (error) throw error;

      // Monitor message for keywords (async, don't wait)
      if (newMessage) {
        supabase.functions.invoke('monitor-safe-space-message', {
          body: { 
            messageId: newMessage.id,
            sessionId,
            content: content.trim()
          }
        }).catch(err => console.error('Failed to monitor message:', err));
      }
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
    sessionStatus,
    sendMessage,
    endSession,
    rateSession
  };
};
