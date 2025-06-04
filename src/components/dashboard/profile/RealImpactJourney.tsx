
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Award, Users, Clock, TrendingUp } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ImpactActivity {
  id: string;
  activity_type: string;
  description: string;
  points_earned: number;
  created_at: string;
  verified: boolean;
}

interface ImpactMetrics {
  impact_score: number;
  trust_score: number;
  help_provided_count: number;
  help_received_count: number;
  volunteer_hours: number;
  donation_amount: number;
}

const RealImpactJourney = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ImpactActivity[]>([]);
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchImpactData = async () => {
      if (!user) return;

      try {
        // Fetch impact activities
        const { data: activitiesData } = await supabase
          .from('impact_activities')
          .select('*')
          .eq('user_id', user.id)
          .eq('verified', true)
          .order('created_at', { ascending: false })
          .limit(10);

        // Fetch impact metrics
        const { data: metricsData } = await supabase
          .from('impact_metrics')
          .select('*')
          .eq('user_id', user.id)
          .single();

        setActivities(activitiesData || []);
        setMetrics(metricsData);
      } catch (error) {
        console.error('Error fetching impact data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImpactData();
  }, [user]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'help_completed': return Users;
      case 'volunteer': return Clock;
      case 'donation': return Award;
      default: return TrendingUp;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'help_completed': return 'bg-blue-100 text-blue-800';
      case 'volunteer': return 'bg-green-100 text-green-800';
      case 'donation': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatActivityType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Impact Journey</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Impact Overview */}
      <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-6 w-6 text-teal-600" />
            Your Impact Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          {metrics ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-teal-600">
                  {metrics.impact_score}
                </div>
                <div className="text-sm text-gray-600">Impact Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.trust_score}%
                </div>
                <div className="text-sm text-gray-600">Trust Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {metrics.help_provided_count}
                </div>
                <div className="text-sm text-gray-600">People Helped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {metrics.volunteer_hours}h
                </div>
                <div className="text-sm text-gray-600">Volunteer Hours</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600">Start your impact journey by helping others!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Impact Activities</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No activities yet</h3>
              <p className="text-gray-600">
                Start contributing to the community to build your impact journey!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity) => {
                const ActivityIcon = getActivityIcon(activity.activity_type);
                
                return (
                  <Card key={activity.id} className="border-l-4 border-l-teal-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className="p-2 rounded-full bg-teal-100">
                            <ActivityIcon className="h-4 w-4 text-teal-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`text-xs ${getActivityColor(activity.activity_type)}`}>
                                {formatActivityType(activity.activity_type)}
                              </Badge>
                              <span className="text-sm font-semibold text-green-600">
                                +{activity.points_earned} points
                              </span>
                            </div>
                            <p className="text-sm text-gray-900 mb-2">{activity.description}</p>
                            <div className="flex items-center text-xs text-gray-500">
                              <Calendar className="h-3 w-3 mr-1" />
                              <span>{new Date(activity.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default RealImpactJourney;
