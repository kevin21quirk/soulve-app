import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface NotificationCounts {
  messages: number;
  feedback: number;
  connections: number;
  social: number;
  donations: number;
  esg: number;
  safeguardingAlerts: number;
  demoRequests: number;
  total: number;
}

/**
 * Hook to track unread notification counts across different types
 * Returns counts for messages, feedback, and total
 */
export const useNotificationCounts = () => {
  const { user } = useAuth();
  const [counts, setCounts] = useState<NotificationCounts>({
    messages: 0,
    feedback: 0,
    connections: 0,
    social: 0,
    donations: 0,
    esg: 0,
    safeguardingAlerts: 0,
    demoRequests: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setCounts({ messages: 0, feedback: 0, connections: 0, social: 0, donations: 0, esg: 0, safeguardingAlerts: 0, demoRequests: 0, total: 0 });
      setLoading(false);
      return;
    }

    loadCounts();

    // Set up real-time subscriptions
    const messagesChannel = supabase
      .channel('notification-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Message change detected:', payload);
          loadCounts();
        }
      )
      .subscribe();

    const feedbackChannel = supabase
      .channel('notification-feedback')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'platform_feedback',
        },
        () => {
          loadCounts();
        }
      )
      .subscribe();

    // Connection requests real-time
    const connectionsChannel = supabase
      .channel('notification-connections')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'connections',
          filter: `addressee_id=eq.${user.id}`,
        },
        () => {
          loadCounts();
        }
      )
      .subscribe();

    // Social interactions (comments, reactions) real-time
    const postInteractionsChannel = supabase
      .channel('notification-social')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_interactions',
        },
        () => {
          loadCounts();
        }
      )
      .subscribe();

    const postReactionsChannel = supabase
      .channel('notification-reactions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'post_reactions',
        },
        () => {
          loadCounts();
        }
      )
      .subscribe();

    // Donations real-time
    const userActivitiesChannel = supabase
      .channel('notification-donations')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'user_activities',
        },
        () => {
          loadCounts();
        }
      )
      .subscribe();

    // ESG data contributions real-time (for business users)
    const esgContributionsChannel = supabase
      .channel('notification-esg')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stakeholder_data_contributions',
        },
        () => {
          loadCounts();
        }
      )
      .subscribe();

    // Demo requests real-time (for admins)
    const demoRequestsChannel = supabase
      .channel('notification-demo-requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'demo_requests',
        },
        () => {
          loadCounts();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(feedbackChannel);
      supabase.removeChannel(connectionsChannel);
      supabase.removeChannel(postInteractionsChannel);
      supabase.removeChannel(postReactionsChannel);
      supabase.removeChannel(userActivitiesChannel);
      supabase.removeChannel(esgContributionsChannel);
      supabase.removeChannel(demoRequestsChannel);
    };
  }, [user?.id]);

  const loadCounts = async () => {
    if (!user?.id) return;

    try {
      // Get unread messages count
      const { count: messagesCount, error: messagesError } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      if (messagesError) {
        console.error('Error loading message counts:', messagesError);
      }

      // Get pending connection requests count
      const { count: connectionsCount, error: connectionsError } = await supabase
        .from('connections')
        .select('*', { count: 'exact', head: true })
        .eq('addressee_id', user.id)
        .eq('status', 'pending');

      if (connectionsError) {
        console.error('Error loading connection counts:', connectionsError);
      }

      // Get unread social notifications (comments & reactions on user's posts)
      const { data: userPosts } = await supabase
        .from('posts')
        .select('id')
        .eq('author_id', user.id);

      const userPostIds = userPosts?.map(p => p.id) || [];

      let socialCount = 0;
      if (userPostIds.length > 0) {
        // Count unread comments
        const { count: commentsCount } = await supabase
          .from('post_interactions')
          .select('*', { count: 'exact', head: true })
          .in('post_id', userPostIds)
          .neq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24h

        // Count unread reactions
        const { count: reactionsCount } = await supabase
          .from('post_reactions')
          .select('*', { count: 'exact', head: true })
          .in('post_id', userPostIds)
          .neq('user_id', user.id)
          .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Last 24h

        socialCount = (commentsCount || 0) + (reactionsCount || 0);
      }

      // Get unread donation notifications
      const { count: donationsCount, error: donationsError } = await supabase
        .from('user_activities')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('activity_type', 'donation')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Last 7 days

      if (donationsError) {
        console.error('Error loading donation counts:', donationsError);
      }

      // Get unread ESG contributions (for organization members)
      let esgCount = 0;
      const { data: userOrgs } = await supabase
        .from('organization_members')
        .select('organization_id')
        .eq('user_id', user.id)
        .eq('is_active', true);

      const userOrgIds = userOrgs?.map(o => o.organization_id) || [];

      if (userOrgIds.length > 0) {
        const { count: esgContributionsCount } = await supabase
          .from('stakeholder_data_contributions')
          .select('*', { count: 'exact', head: true })
          .in('contributor_org_id', userOrgIds)
          .eq('contribution_status', 'submitted')
          .gte('submitted_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // Last 7 days

        esgCount = esgContributionsCount || 0;
      }

      // Get unread feedback count (for admins only)
      let feedbackCount = 0;
      let safeguardingAlertsCount = 0;
      let demoRequestsCount = 0;
      
      const { data: isAdminData, error: adminError } = await supabase.rpc('is_admin', {
        user_uuid: user.id,
      });

      if (adminError) {
        console.error('Error checking admin status:', adminError);
      }

      if (isAdminData) {
        const { count, error: feedbackError } = await supabase
          .from('platform_feedback')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'new');

        if (feedbackError) {
          console.error('Error loading feedback counts:', feedbackError);
        } else {
          feedbackCount = count || 0;
        }

        // Get active safeguarding alerts count (for safeguarding staff)
        const { count: alertsCount, error: alertsError } = await supabase
          .from('safe_space_emergency_alerts')
          .select('*', { count: 'exact', head: true })
          .in('status', ['pending', 'acknowledged', 'reviewing']);

        if (alertsError) {
          console.error('Error loading safeguarding alerts:', alertsError);
        } else {
          safeguardingAlertsCount = alertsCount || 0;
        }

        // Get pending demo requests count
        const { count: demoCount, error: demoError } = await supabase
          .from('demo_requests')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending');

        if (demoError) {
          console.error('Error loading demo requests:', demoError);
        } else {
          demoRequestsCount = demoCount || 0;
        }
      }

      const newCounts = {
        messages: messagesCount || 0,
        feedback: feedbackCount,
        connections: connectionsCount || 0,
        social: socialCount,
        donations: donationsCount || 0,
        esg: esgCount,
        safeguardingAlerts: safeguardingAlertsCount,
        demoRequests: demoRequestsCount,
        total: (messagesCount || 0) + feedbackCount + (connectionsCount || 0) + socialCount + (donationsCount || 0) + esgCount + safeguardingAlertsCount + demoRequestsCount,
      };

      console.log('Setting notification counts:', newCounts);
      setCounts(newCounts);
    } catch (error) {
      console.error('Error loading notification counts:', error);
    } finally {
      setLoading(false);
    }
  };

  const markMessagesAsRead = async () => {
    if (!user?.id) return;

    try {
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('recipient_id', user.id)
        .eq('is_read', false);

      loadCounts();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  return {
    counts,
    loading,
    refreshCounts: loadCounts,
    markMessagesAsRead,
  };
};
