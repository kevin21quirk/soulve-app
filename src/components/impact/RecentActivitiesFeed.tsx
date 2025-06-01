
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Award, Heart, DollarSign, Users, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ImpactAnalyticsService, ImpactActivity } from '@/services/impactAnalyticsService';

const RecentActivitiesFeed = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ImpactActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadRecentActivities();
    }
  }, [user?.id]);

  const loadRecentActivities = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    try {
      const recentActivities = await ImpactAnalyticsService.getRecentActivities(user.id);
      setActivities(recentActivities);
    } catch (error) {
      console.error('Error loading recent activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case 'help_provided': return Heart;
      case 'volunteer': return Clock;
      case 'donation': return DollarSign;
      case 'connection': return Users;
      case 'engagement': return Zap;
      default: return Award;
    }
  };

  const getActivityColor = (activityType: string) => {
    switch (activityType) {
      case 'help_provided': return 'text-red-600 bg-red-50';
      case 'volunteer': return 'text-blue-600 bg-blue-50';
      case 'donation': return 'text-green-600 bg-green-50';
      case 'connection': return 'text-purple-600 bg-purple-50';
      case 'engagement': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const formatActivityType = (activityType: string) => {
    return activityType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-yellow-600" />
          <span>Recent Impact Activities</span>
        </CardTitle>
        <CardDescription>
          Your latest contributions and achievements
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activities Yet</h3>
              <p className="text-gray-600">
                Start helping others or tracking your contributions to see your impact activities here!
              </p>
            </div>
          ) : (
            activities.map((activity) => {
              const Icon = getActivityIcon(activity.activityType);
              const colorClass = getActivityColor(activity.activityType);
              
              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                  <div className={`p-2 rounded-full ${colorClass}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {activity.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {formatActivityType(activity.activityType)}
                          </Badge>
                          {activity.verified && (
                            <Badge variant="outline" className="text-xs text-green-700 border-green-200">
                              Verified
                            </Badge>
                          )}
                        </div>
                        
                        {/* Show metadata if available */}
                        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                          <div className="mt-2 text-xs text-gray-500">
                            {activity.metadata.hours && `${activity.metadata.hours} hours`}
                            {activity.metadata.amount && `$${activity.metadata.amount}`}
                            {activity.metadata.organization && ` • ${activity.metadata.organization}`}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right ml-4">
                        <Badge className="bg-blue-600 text-white text-xs">
                          +{activity.pointsEarned} pts
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivitiesFeed;
