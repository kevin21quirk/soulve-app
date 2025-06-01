
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Users, 
  Heart, 
  Clock,
  Trophy,
  Target,
  TrendingUp
} from "lucide-react";

const ImpactTab = () => {
  const impactStats = {
    helpProvided: 47,
    volunteering: 24,
    donations: 8,
    connections: 156,
    impactScore: 850,
    trustScore: 94
  };

  const recentActivity = [
    {
      id: '1',
      type: 'help',
      title: 'Helped elderly neighbor with groceries',
      points: 15,
      date: '2 hours ago'
    },
    {
      id: '2',
      type: 'volunteer',
      title: 'Food bank volunteer shift',
      points: 25,
      date: '1 day ago'
    },
    {
      id: '3',
      type: 'donation',
      title: 'Donated to local shelter',
      points: 20,
      date: '3 days ago'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Impact</h2>
        <Badge variant="secondary" className="flex items-center space-x-1">
          <Trophy className="h-4 w-4" />
          <span>Level 5 Helper</span>
        </Badge>
      </div>

      {/* Impact Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <BarChart3 className="h-5 w-5 text-teal-600" />
              <span>Impact Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-teal-600 mb-2">
              {impactStats.impactScore}
            </div>
            <Progress value={85} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              850 pts to next level
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Trust Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-500 mb-2">
              {impactStats.trustScore}%
            </div>
            <Progress value={impactStats.trustScore} className="h-2" />
            <p className="text-sm text-gray-600 mt-2">
              Excellent trust rating
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Users className="h-5 w-5 text-blue-500" />
              <span>Connections</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-500 mb-2">
              {impactStats.connections}
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <TrendingUp className="h-3 w-3" />
              <span>+12 this month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Activity Breakdown</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Help Provided</span>
                <span className="text-lg font-bold text-teal-600">{impactStats.helpProvided}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Volunteer Hours</span>
                <span className="text-lg font-bold text-purple-600">{impactStats.volunteering}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Donations Made</span>
                <span className="text-lg font-bold text-green-600">{impactStats.donations}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-gray-600">{activity.date}</p>
                  </div>
                  <Badge variant="secondary">+{activity.points} pts</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImpactTab;
