import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PollData {
  question: string;
  options: Array<{ id: string; text: string; votes: number }>;
  allowMultiple: boolean;
  duration: number;
  createdAt?: string;
}

interface EventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  maxAttendees?: number;
  isVirtual: boolean;
  virtualLink?: string;
}

interface GifData {
  id: string;
  title: string;
  url: string;
  preview: string;
}

interface PostAttachments {
  pollData: PollData | null;
  eventData: EventData | null;
  gifData: GifData | null;
  isLoading: boolean;
}

// Validate poll data structure
const isValidPollData = (data: unknown): data is PollData => {
  if (!data || typeof data !== 'object') return false;
  const poll = data as Record<string, unknown>;
  return (
    typeof poll.question === 'string' &&
    Array.isArray(poll.options) &&
    poll.options.every(
      (opt: unknown) =>
        opt && typeof opt === 'object' &&
        typeof (opt as Record<string, unknown>).id === 'string' &&
        typeof (opt as Record<string, unknown>).text === 'string'
    )
  );
};

// Validate event data structure
const isValidEventData = (data: unknown): data is EventData => {
  if (!data || typeof data !== 'object') return false;
  const event = data as Record<string, unknown>;
  return (
    typeof event.title === 'string' &&
    typeof event.date === 'string'
  );
};

// Validate GIF data structure
const isValidGifData = (data: unknown): data is GifData => {
  if (!data || typeof data !== 'object') return false;
  const gif = data as Record<string, unknown>;
  return (
    typeof gif.id === 'string' &&
    typeof gif.url === 'string'
  );
};

export const usePostAttachments = (postId: string): PostAttachments => {
  const [pollData, setPollData] = useState<PollData | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [gifData, setGifData] = useState<GifData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset state when postId changes
    setPollData(null);
    setEventData(null);
    setGifData(null);
    
    const fetchAttachments = async () => {
      // Skip invalid post IDs
      if (!postId || typeof postId !== 'string' || postId.startsWith('campaign_')) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('post_interactions')
          .select('interaction_type, content, created_at')
          .eq('post_id', postId)
          .in('interaction_type', ['poll_data', 'event_data', 'gif_attachment']);

        if (error) {
          console.error('Error fetching post attachments:', error);
          setIsLoading(false);
          return;
        }

        if (data && Array.isArray(data)) {
          data.forEach(item => {
            if (!item?.content) return;
            
            try {
              const parsedContent = JSON.parse(item.content);
              if (!parsedContent) return;
              
              if (item.interaction_type === 'poll_data' && isValidPollData(parsedContent)) {
                setPollData({
                  ...parsedContent,
                  createdAt: item.created_at
                });
              } else if (item.interaction_type === 'event_data' && isValidEventData(parsedContent)) {
                setEventData(parsedContent);
              } else if (item.interaction_type === 'gif_attachment' && isValidGifData(parsedContent)) {
                setGifData(parsedContent);
              }
            } catch (parseError) {
              // Silently fail for malformed JSON - don't crash
              console.warn('Skipping malformed attachment:', item.interaction_type);
            }
          });
        }
      } catch (error) {
        console.error('Error in usePostAttachments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAttachments();
  }, [postId]);

  return { pollData, eventData, gifData, isLoading };
};
