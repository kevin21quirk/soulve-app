import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Clock, TrendingDown } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

interface DecayLog {
  id: string;
  points_before: number;
  points_after: number;
  decay_percentage: number;
  last_activity_date: string | null;
  applied_at: string;
  reason: string;
}

const PointsDecayVisibility = () => {
  const { user } = useAuth();
  const [decayLogs, setDecayLogs] = useState<DecayLog[]>([]);
  const [daysSinceActivity, setDaysSinceActivity] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDecayInfo = async () => {
      if (!user?.id) return;

      try {
        // Fetch decay logs
        const { data: logs } = await supabase
          .from('point_decay_log')
          .select('*')
          .eq('user_id', user.id)
          .order('applied_at', { ascending: false })
          .limit(5);

        setDecayLogs(logs || []);

        // Calculate days since last activity
        const { data: metrics } = await supabase
          .from('impact_metrics')
          .select('last_activity_date')
          .eq('user_id', user.id)
          .single();

        if (metrics?.last_activity_date) {
          const daysDiff = Math.floor(
            (new Date().getTime() - new Date(metrics.last_activity_date).getTime()) / (24 * 60 * 60 * 1000)
          );
          setDaysSinceActivity(daysDiff);
        }
      } catch (error) {
        console.error('Error fetching decay info:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDecayInfo();
  }, [user?.id]);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const showInactivityWarning = daysSinceActivity && daysSinceActivity >= 25;
  const daysUntilDecay = daysSinceActivity ? Math.max(0, 30 - daysSinceActivity) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Clock className="h-5 w-5" />
          <span>Points Activity Status</span>
        </CardTitle>
        <CardDescription>
          Track your non-campaign points decay due to inactivity
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Inactivity Warning */}
        {showInactivityWarning && daysUntilDecay !== null && (
          <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-semibold text-yellow-900">Inactivity Notice</h4>
              <p className="text-sm text-yellow-800 mt-1">
                {daysUntilDecay === 0
                  ? "Your non-campaign points are eligible for decay. Stay active to prevent point loss!"
                  : `Your non-campaign points will decay in ${daysUntilDecay} days if you remain inactive.`}
              </p>
              <p className="text-xs text-yellow-700 mt-2">
                💡 Campaign-related points (donations, fundraising) never decay!
              </p>
            </div>
          </div>
        )}

        {/* Activity Status */}
        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
          <div>
            <p className="text-sm font-medium">Last Activity</p>
            <p className="text-xs text-muted-foreground">
              {daysSinceActivity !== null
                ? `${daysSinceActivity} days ago`
                : 'No recent activity'}
            </p>
          </div>
          <Badge variant={showInactivityWarning ? "destructive" : "secondary"}>
            {showInactivityWarning ? "At Risk" : "Active"}
          </Badge>
        </div>

        {/* Decay History */}
        {decayLogs.length > 0 && (
          <div className="space-y-3 pt-4 border-t">
            <h4 className="font-semibold text-sm flex items-center space-x-2">
              <TrendingDown className="h-4 w-4" />
              <span>Decay History</span>
            </h4>
            {decayLogs.map(log => (
              <div key={log.id} className="flex items-start justify-between p-3 bg-red-50 border border-red-100 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-red-900">
                      -{log.points_before - log.points_after} points lost
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {log.decay_percentage}% decay
                    </Badge>
                  </div>
                  <p className="text-xs text-red-700 mt-1">
                    {log.points_before} pts → {log.points_after} pts
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(log.applied_at), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Box */}
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-900">
            <strong>How Points Decay Works:</strong> Non-campaign points decay by 5% every 30 days of inactivity, 
            up to a maximum of 50% total decay. Donation and campaign-related points never decay. 
            Stay active to keep your full point balance!
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PointsDecayVisibility;
