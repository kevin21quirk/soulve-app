import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Award, 
  Heart, 
  Users, 
  TrendingUp, 
  Clock,
  Star,
  Trophy
} from "lucide-react";
import MyHelpRequests from "../MyHelpRequests";
import { useUserImpactStats, useUserAchievements } from "@/hooks/useHelpCenterData";
import { format } from "date-fns";

const MyImpactTab = () => {
  const { data: impactStats, isLoading: loadingStats } = useUserImpactStats();
  const { data: achievements, isLoading: loadingAchievements } = useUserAchievements();

  const getIconForAchievement = (iconName: string) => {
    switch (iconName?.toLowerCase()) {
      case 'heart': return Heart;
      case 'clock': return Clock;
      case 'award': return Award;
      case 'star': return Star;
      case 'trophy': return Trophy;
      default: return Award;
    }
  };

  const getTrustScoreLabel = (score: number) => {
    if (score >= 80) return { label: 'Excellent', color: 'bg-green-100 text-green-800' };
    if (score >= 60) return { label: 'Good', color: 'bg-blue-100 text-blue-800' };
    if (score >= 40) return { label: 'Building', color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'New', color: 'bg-gray-100 text-gray-800' };
  };

  const trustInfo = getTrustScoreLabel(impactStats?.trustScore || 0);

  return (
    <div className="space-y-6">
      {/* Impact Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            {loadingStats ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{impactStats?.helpProvided || 0}</p>
                  <p className="text-sm text-muted-foreground">Times you've helped</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {loadingStats ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{impactStats?.peopleHelped || 0}</p>
                  <p className="text-sm text-muted-foreground">People helped</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {loadingStats ? (
              <Skeleton className="h-16 w-full" />
            ) : (
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{impactStats?.trustScore || 0}%</p>
                  <p className="text-sm text-muted-foreground">Trust Score</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Tabs */}
      <Tabs defaultValue="requests" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="stats">Detailed Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="requests" className="mt-6" forceMount>
          <div className="hidden data-[state=active]:block" data-state="active">
            <MyHelpRequests />
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Your Achievements</h3>
            {loadingAchievements ? (
              [1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))
            ) : achievements && achievements.length > 0 ? (
              achievements.map((achievement) => {
                const IconComponent = getIconForAchievement(achievement.icon);
                return (
                  <Card key={achievement.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                          <IconComponent className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-foreground">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        <Badge variant="outline">
                          {format(new Date(achievement.date), 'd MMM yyyy')}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No achievements yet</p>
                <p className="text-sm">Help others to earn your first badge!</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Activity Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingStats ? (
                  <Skeleton className="h-32 w-full" />
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Hours Volunteered</span>
                      <Badge variant="secondary">{impactStats?.hoursVolunteered || 0}h</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Total Points</span>
                      <Badge variant="secondary">{impactStats?.totalPoints || 0} pts</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Help Actions</span>
                      <Badge variant="secondary">{impactStats?.helpProvided || 0}</Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Standing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {loadingStats ? (
                  <Skeleton className="h-32 w-full" />
                ) : (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Trust Score</span>
                      <Badge className={trustInfo.color}>
                        {impactStats?.trustScore || 0}% - {trustInfo.label}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Achievements</span>
                      <Badge variant="secondary">{achievements?.length || 0} earned</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Impact Level</span>
                      <Badge variant="secondary">
                        {(impactStats?.totalPoints || 0) >= 100 ? 'Community Helper' : 'Getting Started'}
                      </Badge>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyImpactTab;
