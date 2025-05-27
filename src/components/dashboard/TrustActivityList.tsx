
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, DollarSign, Clock, Users, CheckCircle, Clock3 } from "lucide-react";
import { TrustActivity } from "@/types/trustFootprint";

interface TrustActivityListProps {
  activities: TrustActivity[];
}

const TrustActivityList = ({ activities }: TrustActivityListProps) => {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case "donation": return DollarSign;
      case "volunteer": return Clock;
      case "help_provided": return Users;
      case "help_received": return Users;
      case "charity_support": return CheckCircle;
      default: return CheckCircle;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case "donation": return "text-green-600 bg-green-50 border-green-200";
      case "volunteer": return "text-blue-600 bg-blue-50 border-blue-200";
      case "help_provided": return "text-purple-600 bg-purple-50 border-purple-200";
      case "help_received": return "text-orange-600 bg-orange-50 border-orange-200";
      case "charity_support": return "text-teal-600 bg-teal-50 border-teal-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return CheckCircle;
      case "verified": return CheckCircle;
      case "ongoing": return Clock3;
      default: return Clock3;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-600";
      case "verified": return "text-blue-600";
      case "ongoing": return "text-yellow-600";
      default: return "text-gray-600";
    }
  };

  const formatActivityType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity History</CardTitle>
        <CardDescription>
          Your verified contributions and interactions on the platform
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const ActivityIcon = getActivityIcon(activity.type);
            const StatusIcon = getStatusIcon(activity.status);
            
            return (
              <Card key={activity.id} className={`border-l-4 ${getActivityColor(activity.type)}`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className={`p-2 rounded-full ${getActivityColor(activity.type)}`}>
                        <ActivityIcon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 mb-1">{activity.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {formatActivityType(activity.type)}
                          </Badge>
                          {activity.organization && (
                            <Badge variant="secondary" className="text-xs">
                              {activity.organization}
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(activity.date).toLocaleDateString()}</span>
                          </span>
                          {activity.amount && (
                            <span className="flex items-center space-x-1">
                              <DollarSign className="h-3 w-3" />
                              <span>${activity.amount}</span>
                            </span>
                          )}
                          {activity.hours && (
                            <span className="flex items-center space-x-1">
                              <Clock className="h-3 w-3" />
                              <span>{activity.hours}h</span>
                            </span>
                          )}
                          {activity.recipients && (
                            <span className="flex items-center space-x-1">
                              <Users className="h-3 w-3" />
                              <span>{activity.recipients} people</span>
                            </span>
                          )}
                        </div>

                        {activity.impact && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs text-gray-700">
                            <strong>Impact:</strong> {activity.impact}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-1">
                      <StatusIcon className={`h-4 w-4 ${getStatusColor(activity.status)}`} />
                      <span className={`text-xs capitalize ${getStatusColor(activity.status)}`}>
                        {activity.status}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TrustActivityList;
