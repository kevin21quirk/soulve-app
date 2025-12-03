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
    // Cleanup existing subscriptions first to prevent duplicates
    this.cleanup();
    
    this.queryClient = queryClient;
    this.userId = userId;
    
    try {
      this.setupSubscriptions();
    } catch (error) {
      console.error('[RealtimeManager] Error setting up subscriptions:', error);
    }
  }

  cleanup() {
    try {
      this.channels.forEach((channel) => {
        try {
          supabase.removeChannel(channel);
        } catch (e) {
          console.warn('[RealtimeManager] Error removing channel:', e);
        }
      });
      this.channels.clear();
      this.userId = null;
    } catch (error) {
      console.error('[RealtimeManager] Error during cleanup:', error);
    }
  }

  private setupSubscriptions() {
    if (!this.userId || !this.queryClient) return;

    // Wrap each subscription in try-catch to prevent one failure from breaking all
    try {
      this.setupPostsSubscription();
    } catch (error) {
      console.error('[RealtimeManager] Error setting up posts subscription:', error);
    }
    
    try {
      this.setupConnectionsSubscription();
    } catch (error) {
      console.error('[RealtimeManager] Error setting up connections subscription:', error);
    }
    
    try {
      this.setupInteractionsSubscription();
    } catch (error) {
      console.error('[RealtimeManager] Error setting up interactions subscription:', error);
    }
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
        (payload) => {
          // Mark as stale and refetch active queries
          this.queryClient?.invalidateQueries({ 
            queryKey: ['posts'],
            refetchType: 'active'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed'],
            refetchType: 'active'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed-infinite'],
            refetchType: 'active'
          });
          
          // Invalidate user-specific queries for the post author
          if (payload.new?.author_id) {
            this.queryClient?.invalidateQueries({ 
              queryKey: ['user-posts', payload.new.author_id],
              refetchType: 'active'
            });
            this.queryClient?.invalidateQueries({ 
              queryKey: ['user-profile', payload.new.author_id],
              refetchType: 'active'
            });
          }
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
          // Use 'all' for feed queries so deletions sync across all users
          this.queryClient?.invalidateQueries({ 
            queryKey: ['posts'],
            refetchType: 'all'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed'],
            refetchType: 'all'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed-infinite'],
            refetchType: 'all'
          });
          
          // User-specific queries can stay 'active'
          if (payload.new?.author_id) {
            this.queryClient?.invalidateQueries({ 
              queryKey: ['user-posts', payload.new.author_id],
              refetchType: 'active'
            });
            this.queryClient?.invalidateQueries({ 
              queryKey: ['user-profile', payload.new.author_id],
              refetchType: 'active'
            });
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'posts'
        },
        (payload) => {
          // Force refetch on all clients when post is deleted
          this.queryClient?.invalidateQueries({ 
            queryKey: ['posts'],
            refetchType: 'all'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed'],
            refetchType: 'all'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed-infinite'],
            refetchType: 'all'
          });
          
          // Invalidate user-specific queries for the post author
          if (payload.old?.author_id) {
            this.queryClient?.invalidateQueries({ 
              queryKey: ['user-posts', payload.old.author_id],
              refetchType: 'active'
            });
            this.queryClient?.invalidateQueries({ 
              queryKey: ['user-profile', payload.old.author_id],
              refetchType: 'active'
            });
          }
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
            refetchType: 'active'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed'],
            refetchType: 'active'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed-infinite'],
            refetchType: 'active'
          });
        }
      )
      .subscribe();

    this.channels.set('posts', channel);
  }

  private setupConnectionsSubscription() {
    if (!this.userId) return;

    // Fix: Use proper OR filter syntax for Supabase realtime
    // Create two separate subscriptions for requester and addressee
    const requesterChannel = supabase
      .channel('realtime-connections-requester')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connections',
          filter: `requester_id=eq.${this.userId}`,
        },
        () => {
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

    const addresseeChannel = supabase
      .channel('realtime-connections-addressee')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connections',
          filter: `addressee_id=eq.${this.userId}`,
        },
        () => {
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

    this.channels.set('connections-requester', requesterChannel);
    this.channels.set('connections-addressee', addresseeChannel);
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
          // Mark as stale and refetch active queries
          this.queryClient?.invalidateQueries({ 
            queryKey: ['posts'],
            refetchType: 'active'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed'],
            refetchType: 'active'
          });
          this.queryClient?.invalidateQueries({ 
            queryKey: ['social-feed-infinite'],
            refetchType: 'active'
          });
        }
      )
      .subscribe();

    this.channels.set('interactions', channel);
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
