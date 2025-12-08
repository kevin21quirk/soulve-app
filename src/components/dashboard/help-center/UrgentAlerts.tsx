import { AlertCircle, MapPin, Clock, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useUrgentHelpRequests, getRelativeTime } from "@/hooks/useHelpCenterData";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const UrgentAlerts = () => {
  const { data: urgentRequests, isLoading } = useUrgentHelpRequests();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleHelpNow = (requestId: string, authorId: string, title: string) => {
    // Navigate to messaging with the author
    toast({
      title: "Connecting you",
      description: `Opening conversation to help with "${title}"`,
    });
    // Navigate to the post to offer help via comments/messaging
    navigate(`/dashboard?tab=feed&post=${requestId}`);
  };

  if (isLoading) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2 text-red-800">
            <AlertCircle className="h-5 w-5" />
            <span>Urgent Help Needed</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-40 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!urgentRequests || urgentRequests.length === 0) {
    return null;
  }

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-500 hover:bg-orange-600">High Priority</Badge>;
      default:
        return <Badge variant="secondary">{urgency}</Badge>;
    }
  };

  return (
    <Card className="border-red-200 bg-red-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-red-800">
          <AlertCircle className="h-5 w-5" />
          <span>Urgent Help Needed</span>
          <Badge variant="destructive" className="ml-2">LIVE</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {urgentRequests.slice(0, 4).map((request) => (
            <div key={request.id} className="bg-white p-4 rounded-lg border border-red-200">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-red-900 line-clamp-1">{request.title}</h4>
                {getUrgencyBadge(request.urgency)}
              </div>
              <p className="text-sm text-red-700 mb-3 line-clamp-2">{request.content}</p>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 text-xs text-red-600">
                  {request.location && (
                    <span className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {request.location}
                    </span>
                  )}
                  <span className="flex items-center">
                    <MessageSquare className="h-3 w-3 mr-1" />
                    {request.response_count} responses
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {getRelativeTime(request.created_at)}
                  </span>
                </div>
              </div>
              <Button 
                size="sm" 
                className="w-full bg-red-600 hover:bg-red-700"
                onClick={() => handleHelpNow(request.id, request.author_id, request.title)}
              >
                Help Now
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UrgentAlerts;
