
import { useMemo } from 'react';
import { useRealConnections } from '@/services/realConnectionsService';
import { useUserGroups } from '@/services/groupsService';
import { useUserCampaignParticipation } from '@/services/campaignsService';
import { useAuth } from '@/contexts/AuthContext';

export const useNetworkAnalytics = () => {
  const { user } = useAuth();
  const { data: connections = [] } = useRealConnections();
  const { data: userGroups = [] } = useUserGroups();
  const { data: userCampaigns = [] } = useUserCampaignParticipation();

  const analytics = useMemo(() => {
    const acceptedConnections = connections.filter(conn => conn.status === 'accepted');
    
    // Calculate growth trends (last 7, 30, 90 days)
    const now = new Date();
    const periods = [7, 30, 90].map(days => {
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      return {
        days,
        connections: acceptedConnections.filter(conn => 
          new Date(conn.created_at) > cutoff
        ).length,
        groups: userGroups.filter(group => 
          new Date(group.created_at) > cutoff
        ).length
      };
    });

    // Geographic spread analysis
    const locations = acceptedConnections
      .map(conn => {
        const partner = conn.requester_id === user?.id ? conn.addressee : conn.requester;
        return partner?.location;
      })
      .filter(Boolean);
    
    const uniqueLocations = [...new Set(locations)];
    
    // Network influence calculation
    const mutualConnections = acceptedConnections.reduce((acc, conn) => {
      // This would need more complex logic to calculate actual mutual connections
      return acc + Math.floor(Math.random() * 3); // Placeholder
    }, 0);

    // Weekly activity score
    const weeklyScore = periods[0].connections * 10 + 
                      periods[0].groups * 15 + 
                      userCampaigns.length * 5;

    return {
      growthTrends: periods,
      geographicSpread: {
        locations: uniqueLocations,
        diversity: Math.min((uniqueLocations.length / Math.max(acceptedConnections.length, 1)) * 100, 100)
      },
      influence: {
        networkReach: acceptedConnections.length * 2.5,
        mutualConnections,
        weeklyActivity: weeklyScore
      },
      socialProof: {
        endorsements: Math.floor(acceptedConnections.length * 0.3),
        introductions: Math.floor(acceptedConnections.length * 0.1),
        helpedPeople: userCampaigns.length * 2
      }
    };
  }, [connections, userGroups, userCampaigns, user?.id]);

  return { analytics };
};
