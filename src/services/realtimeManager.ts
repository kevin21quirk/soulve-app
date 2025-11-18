import { supabase } from '@/integrations/supabase/client';
import { QueryClient } from '@tanstack/react-query';

/**
 * Centralized Real-time Manager
 * Handles all Supabase real-time subscriptions in one place
 * Updates React Query cache directly instead of invalidating
 */
export class RealtimeManager {
  private static instance: RealtimeManager;
  private channels: Map<string, any> = new Map();
  private queryClient: QueryClient | null = null;
  private userId: string | null = null;

  private constructor() {}

  static getInstance(): RealtimeManager {
    if (!RealtimeManager.instance) {
      RealtimeManager.instance = new RealtimeManager();
    }
    return RealtimeManager.instance;
  }

  initialize(queryClient: QueryClient, userId: string) {
    this.queryClient = queryClient;
    this.userId = userId;
    this.setupSubscriptions();
  }

  cleanup() {
    this.channels.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.channels.clear();
    this.userId = null;
  }

  private setupSubscriptions() {
    if (!this.userId || !this.queryClient) return;

    // Single subscription for posts and campaigns
    this.setupPostsSubscription();
    
    // Single subscription for connections
    this.setupConnectionsSubscription();
    
    // Single subscription for interactions
    this.setupInteractionsSubscription();
    
    // Single subscription for messages
    this.setupMessagesSubscription();
  }

  private setupPostsSubscription() {
    const channel = supabase
      .channel('realtime-posts')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'posts'
        },
        () => {
          // Mark as stale but don't refetch immediately
          this.queryClient?.invalidateQueries({ 
            queryKey: ['posts'],
            refetchType: 'none'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed'],
            refetchType: 'none'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed-infinite'],
            refetchType: 'none'
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
        () => {
          this.queryClient?.invalidateQueries({ 
            queryKey: ['posts'],
            refetchType: 'none'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed'],
            refetchType: 'none'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed-infinite'],
            refetchType: 'none'
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'campaigns'
        },
        () => {
          this.queryClient?.invalidateQueries({ 
            queryKey: ['posts'],
            refetchType: 'none'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed'],
            refetchType: 'none'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed-infinite'],
            refetchType: 'none'
          });
        }
      )
      .subscribe();

    this.channels.set('posts', channel);
  }

  private setupConnectionsSubscription() {
    if (!this.userId) return;

    const channel = supabase
      .channel('realtime-connections')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connections',
          filter: `requester_id=eq.${this.userId},addressee_id=eq.${this.userId}`,
        },
        () => {
          // Mark queries as stale but don't refetch immediately
          this.queryClient?.invalidateQueries({ 
            queryKey: ['real-connections'],
            refetchType: 'none'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['suggested-connections'],
            refetchType: 'none'
          });
        }
      )
      .subscribe();

    this.channels.set('connections', channel);
  }

  private setupInteractionsSubscription() {
    const channel = supabase
      .channel('realtime-interactions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'post_interactions'
        },
        () => {
          // Mark as stale but don't refetch
          this.queryClient?.invalidateQueries({ 
            queryKey: ['posts'],
            refetchType: 'none'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed'],
            refetchType: 'none'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed-infinite'],
            refetchType: 'none'
          });
        }
      )
      .subscribe();

    this.channels.set('interactions', channel);
  }

  private setupMessagesSubscription() {
    if (!this.userId) return;

    const channel = supabase
      .channel('realtime-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${this.userId}`
        },
        async (payload) => {
          console.log('[RealtimeManager] New message received:', payload);
          
          // Update messages cache for this conversation
          const senderId = payload.new.sender_id;
          const messagesQueryKey = ['messages', senderId];
          
          // Get current messages and add the new one
          const currentMessages = (this.queryClient?.getQueryData(messagesQueryKey) as any[]) || [];
          const newMessage = {
            ...payload.new,
            sender_profile: null // Will be fetched if needed
          };
          
          this.queryClient?.setQueryData(messagesQueryKey, [...currentMessages, newMessage]);
          
          // Update conversations list
          this.queryClient?.invalidateQueries({ 
            queryKey: ['conversations'],
            refetchType: 'active'
          });
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${this.userId}`
        },
        (payload) => {
          console.log('[RealtimeManager] Message read status updated:', payload);
          
          // Update read status in messages cache
          if (payload.new.is_read && !payload.old.is_read) {
            const recipientId = payload.new.recipient_id;
            const messagesQueryKey = ['messages', recipientId];
            
            const currentMessages: any[] = (this.queryClient?.getQueryData(messagesQueryKey) as any[]) || [];
            const updatedMessages = currentMessages.map(msg => 
              msg.id === payload.new.id ? { ...msg, is_read: true } : msg
            );
            
            this.queryClient?.setQueryData(messagesQueryKey, updatedMessages);
          }
        }
      )
      .subscribe();

    this.channels.set('messages', channel);
  }

  // Method to force refresh when user explicitly requests it
  forceRefresh(queryKey: string[]) {
    this.queryClient?.invalidateQueries({ 
      queryKey,
      refetchType: 'active' // Only refetch active queries
    });
  }
}

export const realtimeManager = RealtimeManager.getInstance();
