
import { useMemo } from 'react';
import { useRealConnections } from '@/services/realConnectionsService';
import { useUserGroups } from '@/services/groupsService';
import { useUserCampaignParticipation } from '@/services/campaignsService';

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: string;
  deadline: string;
  type: 'daily' | 'weekly' | 'milestone';
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  badge: string;
  isCurrentUser?: boolean;
}

export const useNetworkGamification = () => {
  const { data: connections = [] } = useRealConnections();
  const { data: userGroups = [] } = useUserGroups();
  const { data: userCampaigns = [] } = useUserCampaignParticipation();

  const { challenges, leaderboard, userStats } = useMemo(() => {
    const acceptedConnections = connections.filter(conn => conn.status === 'accepted');
    
    // Generate dynamic challenges
    const today = new Date();
    const weekEnd = new Date(today.getTime() + (7 - today.getDay()) * 24 * 60 * 60 * 1000);
    
    const challengeList: Challenge[] = [
      {
        id: 'daily-connect',
        title: 'Daily Connector',
        description: 'Make 1 new connection today',
        target: 1,
        current: 0, // Would need to track daily progress
        reward: '+10 Trust Score',
        deadline: 'Today',
        type: 'daily'
      },
      {
        id: 'weekly-helper',
        title: 'Weekly Helper',
        description: 'Join 2 campaigns this week',
        target: 2,
        current: userCampaigns.length,
        reward: 'Helper Badge',
        deadline: weekEnd.toLocaleDateString(),
        type: 'weekly'
      },
      {
        id: 'community-builder',
        title: 'Community Builder',
        description: 'Join 5 groups total',
        target: 5,
        current: userGroups.length,
        reward: 'Builder Badge',
        deadline: 'No deadline',
        type: 'milestone'
      }
    ];

    // Mock leaderboard with realistic data
    const mockLeaderboard: LeaderboardEntry[] = [
      { rank: 1, name: 'Sarah M.', score: 2850, badge: 'Community Champion' },
      { rank: 2, name: 'Alex K.', score: 2720, badge: 'Super Connector' },
      { rank: 3, name: 'Maria L.', score: 2590, badge: 'Helper Hero' },
      { rank: 4, name: 'You', score: acceptedConnections.length * 100 + userGroups.length * 50 + userCampaigns.length * 75, badge: 'Rising Star', isCurrentUser: true },
      { rank: 5, name: 'John D.', score: 2200, badge: 'Networker' },
    ].sort((a, b) => b.score - a.score).map((entry, index) => ({ ...entry, rank: index + 1 }));

    const userScore = acceptedConnections.length * 100 + userGroups.length * 50 + userCampaigns.length * 75;
    
    const stats = {
      totalScore: userScore,
      level: Math.floor(userScore / 500) + 1,
      nextLevelAt: (Math.floor(userScore / 500) + 1) * 500,
      badges: [
        ...(acceptedConnections.length >= 5 ? ['Connector'] : []),
        ...(userGroups.length >= 3 ? ['Group Member'] : []),
        ...(userCampaigns.length >= 2 ? ['Helper'] : [])
      ]
    };

    return {
      challenges: challengeList,
      leaderboard: mockLeaderboard,
      userStats: stats
    };
  }, [connections, userGroups, userCampaigns]);

  return { challenges, leaderboard, userStats };
};
