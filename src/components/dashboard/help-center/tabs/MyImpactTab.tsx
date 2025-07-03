
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Award, 
  Heart, 
  Users, 
  TrendingUp, 
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock
} from "lucide-react";
import MyHelpRequests from "../MyHelpRequests";

const MyImpactTab = () => {
  // Mock data for demonstration
  const impactStats = {
    helpProvided: 12,
    hoursVolunteered: 48,
    peopleHelped: 23,
    trustScore: 85,
    responseTime: "2 hours",
    completionRate: 94
  };

  const recentAchievements = [
    { id: 1, title: "Community Helper", description: "Helped 10 people in your community", icon: Heart, date: "2 days ago" },
    { id: 2, title: "Quick Responder", description: "Responded to requests within 1 hour", icon: Clock, date: "1 week ago" },
    { id: 3, title: "Trusted Member", description: "Achieved 85+ trust score", icon: Award, date: "2 weeks ago" }
  ];

  return (
    <div className="space-y-6">
      {/* Impact Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Heart className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{impactStats.helpProvided}</p>
                <p className="text-sm text-gray-600">Times you've helped</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{impactStats.peopleHelped}</p>
                <p className="text-sm text-gray-600">People helped</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{impactStats.trustScore}</p>
                <p className="text-sm text-gray-600">Trust Score</p>
              </div>
            </div>
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

        <TabsContent value="requests" className="mt-6">
          <MyHelpRequests />
        </TabsContent>

        <TabsContent value="achievements" className="mt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Achievements</h3>
            {recentAchievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-yellow-100 rounded-lg">
                      <achievement.icon className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    <Badge variant="outline">{achievement.date}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Response Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Average Response Time</span>
                  <Badge variant="secondary">{impactStats.responseTime}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completion Rate</span>
                  <Badge variant="secondary">{impactStats.completionRate}%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hours Volunteered</span>
                  <Badge variant="secondary">{impactStats.hoursVolunteered}h</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Community Impact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trust Score</span>
                  <Badge className="bg-green-100 text-green-800">{impactStats.trustScore}/100</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Community Rank</span>
                  <Badge variant="secondary">Top 15%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Member Since</span>
                  <Badge variant="secondary">3 months</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MyImpactTab;
