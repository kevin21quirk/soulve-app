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

export const usePostAttachments = (postId: string): PostAttachments => {
  const [pollData, setPollData] = useState<PollData | null>(null);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [gifData, setGifData] = useState<GifData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAttachments = async () => {
      if (!postId || postId.startsWith('campaign_')) {
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

        if (data) {
          data.forEach(item => {
            try {
              const parsedContent = item.content ? JSON.parse(item.content) : null;
              
              if (item.interaction_type === 'poll_data' && parsedContent) {
                setPollData({
                  ...parsedContent,
                  createdAt: item.created_at
                });
              } else if (item.interaction_type === 'event_data' && parsedContent) {
                setEventData(parsedContent);
              } else if (item.interaction_type === 'gif_attachment' && parsedContent) {
                setGifData(parsedContent);
              }
            } catch (parseError) {
              console.error('Error parsing attachment content:', parseError);
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
