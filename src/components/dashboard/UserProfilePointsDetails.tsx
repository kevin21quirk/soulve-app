import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, X, Award, Shield, Calendar, Target, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { UserProfileData } from "./UserProfileTypes";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface UserProfilePointsDetailsProps {
  profileData: UserProfileData;
  showPointsDetails: boolean;
  onClose: () => void;
}

interface ImpactActivity {
  id: string;
  activity_type: string;
  points_earned: number;
  description: string;
  created_at: string;
  verified: boolean;
}

interface UserBadge {
  id: string;
  earned_at: string;
  progress: number;
  badge: {
    name: string;
    description: string;
    icon: string;
  };
}

interface ImpactMetrics {
  impact_score: number;
  trust_score: number;
  help_provided_count: number;
  help_received_count: number;
  volunteer_hours: number;
  donation_amount: number;
  average_rating: number;
}

const UserProfilePointsDetails = ({ 
  profileData, 
  showPointsDetails, 
  onClose 
}: UserProfilePointsDetailsProps) => {
  const { toast } = useToast();
  const [activities, setActivities] = useState<ImpactActivity[]>([]);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [metrics, setMetrics] = useState<ImpactMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (showPointsDetails && profileData.id) {
      fetchDetailsData();
    }
  }, [showPointsDetails, profileData.id]);

  const fetchDetailsData = async () => {
    try {
      setLoading(true);

      // Fetch recent impact activities
      const { data: activitiesData } = await supabase
        .from('impact_activities')
        .select('*')
        .eq('user_id', profileData.id)
        .eq('verified', true)
        .order('created_at', { ascending: false })
        .limit(10);

      // Fetch earned badges
      const { data: badgesData } = await supabase
        .from('user_badges')
        .select(`
          id,
          earned_at,
          progress,
          badge:badges (
            name,
            description,
            icon
          )
        `)
        .eq('user_id', profileData.id)
        .order('earned_at', { ascending: false });

      // Fetch impact metrics
      const { data: metricsData } = await supabase
        .from('impact_metrics')
        .select('*')
        .eq('user_id', profileData.id)
        .single();

      setActivities(activitiesData || []);
      setBadges(badgesData || []);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error fetching points details:', error);
      toast({
        title: "Error",
        description: "Failed to load detailed statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrustLevel = (score: number) => {
    if (score >= 90) return { name: "Impact Champion", next: 100 };
    if (score >= 75) return { name: "Community Leader", next: 90 };
    if (score >= 60) return { name: "Trusted Helper", next: 75 };
    if (score >= 40) return { name: "Verified Helper", next: 60 };
    return { name: "New Member", next: 40 };
  };

  const trustLevel = getTrustLevel(profileData.trustScore);
  const progressToNext = trustLevel.next > profileData.trustScore 
    ? ((profileData.trustScore - (trustLevel.next - 15)) / 15) * 100 
    : 100;

  const totalPoints = activities.reduce((sum, activity) => sum + activity.points_earned, 0);

  return (
    <Dialog open={showPointsDetails} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-soulve-blue" />
            Trust Score & Impact Breakdown
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="badges">Badges</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              {/* Trust Score Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Trust Score Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-soulve-teal">{profileData.trustScore}</div>
                      <div className="text-sm text-muted-foreground">Trust Score</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-soulve-blue">{metrics?.help_provided_count || 0}</div>
                      <div className="text-sm text-muted-foreground">People Helped</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-soulve-purple">{totalPoints}</div>
                      <div className="text-sm text-muted-foreground">Total Points</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold bg-gradient-to-r from-[hsl(var(--soulve-teal))] to-[hsl(var(--soulve-blue))] bg-clip-text text-transparent">{metrics?.volunteer_hours || 0}h</div>
                      <div className="text-sm text-muted-foreground">Volunteer Time</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-semibold text-soulve-blue">{trustLevel.name}</span>
                      <span className="text-muted-foreground">{trustLevel.next - profileData.trustScore} pts to next level</span>
                    </div>
                    <Progress value={progressToNext} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-[hsl(var(--soulve-teal))] [&>div]:to-[hsl(var(--soulve-blue))]" />
                  </div>
                </CardContent>
              </Card>

              {/* Impact Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">How Your Trust Score is Calculated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-soulve-teal" />
                        <span>Verifications</span>
                      </div>
                      <span className="font-medium text-soulve-teal">+{profileData.verificationBadges.length * 10} pts</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-soulve-blue" />
                        <span>Help Completed ({metrics?.help_provided_count || 0} times)</span>
                      </div>
                      <span className="font-medium text-soulve-blue">+{(metrics?.help_provided_count || 0) * 25} pts</span>
                    </div>
                    {metrics?.average_rating && metrics.average_rating > 0 && (
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Target className="h-4 w-4 text-soulve-purple" />
                          <span>Average Rating ({metrics.average_rating.toFixed(1)} ⭐)</span>
                        </div>
                        <span className="font-medium text-soulve-purple">+{Math.round(metrics.average_rating * 10)} pts</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-soulve-blue" />
                        <span>Community Engagement</span>
                      </div>
                      <span className="font-medium text-soulve-teal">+{Math.min(100, profileData.postCount * 5)} pts</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Impact Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {activities.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No activities yet</p>
                    ) : (
                      activities.map((activity) => (
                        <div key={activity.id} className="flex items-start justify-between p-3 bg-gradient-to-r from-[hsl(var(--soulve-teal))]/5 to-[hsl(var(--soulve-blue))]/5 rounded-lg border border-[hsl(var(--soulve-blue))]/10">
                          <div className="flex-1">
                            <div className="font-medium text-sm">{activity.description}</div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {format(new Date(activity.created_at), 'MMM d, yyyy')} • {activity.activity_type.replace('_', ' ')}
                            </div>
                          </div>
                          <Badge className="ml-2 bg-gradient-to-r from-[hsl(var(--soulve-teal))] to-[hsl(var(--soulve-blue))] text-white border-none">
                            +{activity.points_earned} pts
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Earned Badges & Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {badges.length === 0 ? (
                      <div className="col-span-full text-center text-muted-foreground py-8">
                        No badges earned yet. Keep contributing to earn your first badge!
                      </div>
                    ) : (
                      badges.map((badge) => (
                        <div key={badge.id} className="flex flex-col items-center p-4 bg-gradient-to-br from-[hsl(var(--soulve-teal))]/10 to-[hsl(var(--soulve-blue))]/10 rounded-lg border border-[hsl(var(--soulve-blue))]/20">
                          <div className="text-4xl mb-2">{badge.badge.icon}</div>
                          <div className="font-semibold text-sm text-center">{badge.badge.name}</div>
                          <div className="text-xs text-muted-foreground text-center mt-1">{badge.badge.description}</div>
                          <div className="text-xs text-muted-foreground mt-2">
                            Earned {format(new Date(badge.earned_at), 'MMM yyyy')}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserProfilePointsDetails;
