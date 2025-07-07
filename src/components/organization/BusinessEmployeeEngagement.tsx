import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Users, 
  Clock, 
  Award, 
  TrendingUp,
  Star,
  Calendar,
  Target
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { BusinessManagementService, EmployeeEngagement } from "@/services/businessManagementService";

interface BusinessEmployeeEngagementProps {
  organizationId: string;
}

const BusinessEmployeeEngagement = ({ organizationId }: BusinessEmployeeEngagementProps) => {
  const { toast } = useToast();
  const [engagements, setEngagements] = useState<EmployeeEngagement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEngagements();
  }, [organizationId]);

  const loadEngagements = async () => {
    try {
      setLoading(true);
      const engagementData = await BusinessManagementService.getEmployeeEngagement(organizationId);
      setEngagements(engagementData);
    } catch (error) {
      console.error('Error loading employee engagement:', error);
      toast({
        title: "Error",
        description: "Failed to load employee engagement data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'volunteer':
        return 'bg-green-100 text-green-800';
      case 'community_service':
        return 'bg-blue-100 text-blue-800';
      case 'mentorship':
        return 'bg-purple-100 text-purple-800';
      case 'fundraising':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getVerificationStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <Award className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Star className="h-4 w-4 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalHours = engagements.reduce((sum, e) => sum + e.hours_contributed, 0);
  const totalPoints = engagements.reduce((sum, e) => sum + e.impact_points, 0);
  const verifiedActivities = engagements.filter(e => e.verification_status === 'verified').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Employee Engagement</h2>
          <p className="text-gray-600">Track and recognize employee contributions to social impact</p>
        </div>
        
        <Button className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
          <Target className="h-4 w-4 mr-2" />
          Set Team Goals
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Active Employees</p>
                <p className="text-2xl font-bold">{new Set(engagements.map(e => e.employee_id)).size}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Total Hours</p>
                <p className="text-2xl font-bold">{totalHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Impact Points</p>
                <p className="text-2xl font-bold">{totalPoints}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Verified Activities</p>
                <p className="text-2xl font-bold">{verifiedActivities}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employee Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Top Contributors</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {engagements
              .reduce((acc, engagement) => {
                const existing = acc.find(e => e.employee_id === engagement.employee_id);
                if (existing) {
                  existing.total_hours += engagement.hours_contributed;
                  existing.total_points += engagement.impact_points;
                  existing.activities_count += 1;
                } else {
                  acc.push({
                    employee_id: engagement.employee_id,
                    profile: engagement.profile,
                    total_hours: engagement.hours_contributed,
                    total_points: engagement.impact_points,
                    activities_count: 1
                  });
                }
                return acc;
              }, [] as any[])
              .sort((a, b) => b.total_points - a.total_points)
              .slice(0, 5)
              .map((employee, index) => (
                <div key={employee.employee_id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-400">#{index + 1}</span>
                      <Avatar>
                        <AvatarImage src={employee.profile?.avatar_url} />
                        <AvatarFallback>
                          {employee.profile?.first_name?.[0]}{employee.profile?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    
                    <div>
                      <p className="font-medium">
                        {employee.profile?.first_name} {employee.profile?.last_name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {employee.activities_count} activities • {employee.total_hours} hours
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">{employee.total_points} points</p>
                    <Badge variant="secondary">Top Contributor</Badge>
                  </div>
                </div>
              ))}

            {engagements.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Employee Engagement Yet</h3>
                <p className="text-gray-600 mb-4">
                  Start tracking employee contributions to social impact initiatives.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Recent Activities</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {engagements.slice(0, 10).map((engagement) => (
              <div key={engagement.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={engagement.profile?.avatar_url} />
                    <AvatarFallback>
                      {engagement.profile?.first_name?.[0]}{engagement.profile?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{engagement.title}</p>
                      {getVerificationStatusIcon(engagement.verification_status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      {engagement.profile?.first_name} {engagement.profile?.last_name} • 
                      {engagement.hours_contributed} hours • {engagement.impact_points} points
                    </p>
                    {engagement.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                        {engagement.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Badge className={getActivityTypeColor(engagement.activity_type)}>
                    {engagement.activity_type.replace('_', ' ')}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {engagement.completed_at 
                      ? new Date(engagement.completed_at).toLocaleDateString()
                      : new Date(engagement.created_at).toLocaleDateString()
                    }
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BusinessEmployeeEngagement;