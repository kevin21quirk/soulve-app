
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

export const useRealTimeUpdates = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Setting up real-time subscriptions');

    // Listen for new posts
    const postsChannel = supabase
      .channel('posts-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          console.log('New post created:', payload);
          // Invalidate posts query to refetch with new post
          queryClient.invalidateQueries({ queryKey: ['posts'] });
          
          toast({
            title: "New post available!",
            description: "Someone just shared something new.",
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          console.log('Post updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
      )
      .subscribe();

    // Listen for new interactions (likes, comments)
    const interactionsChannel = supabase
      .channel('interactions-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_interactions'
        },
        (payload) => {
          console.log('New interaction:', payload);
          // Invalidate posts query to update interaction counts and comments
          queryClient.invalidateQueries({ queryKey: ['posts'] });
          
          // Show toast for new comments (but not for likes to avoid spam)
          if (payload.new?.interaction_type === 'comment') {
            toast({
              title: "New comment!",
              description: "Someone just commented on a post.",
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'post_interactions'
        },
        (payload) => {
          console.log('Interaction removed:', payload);
          queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'post_interactions'
        },
        (payload) => {
          console.log('Interaction updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['posts'] });
        }
      )
      .subscribe();

    // Cleanup subscriptions on unmount
    return () => {
      console.log('Cleaning up real-time subscriptions');
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(interactionsChannel);
    };
  }, [queryClient, toast]);
};
