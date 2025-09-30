import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, ThumbsUp, Share2, Calendar, TrendingUp } from "lucide-react";

interface PublicEngagementProps {
  organizationId: string;
}

const PublicEngagement = ({ organizationId }: PublicEngagementProps) => {
  // Mock data - replace with real data from Supabase
  const engagementMetrics = [
    { label: "Active Consultations", value: 8, trend: "+2" },
    { label: "Public Comments", value: 342, trend: "+45" },
    { label: "Event Attendees", value: 1250, trend: "+120" },
    { label: "Survey Responses", value: 567, trend: "+89" },
  ];

  const activeConsultations = [
    {
      id: 1,
      title: "Local Park Renovation Plan",
      status: "active",
      responses: 145,
      deadline: "2025-04-15",
      engagement: "high"
    },
    {
      id: 2,
      title: "Transport Infrastructure Review",
      status: "active",
      responses: 89,
      deadline: "2025-04-20",
      engagement: "medium"
    },
    {
      id: 3,
      title: "Community Safety Initiative",
      status: "closing-soon",
      responses: 203,
      deadline: "2025-04-02",
      engagement: "high"
    },
  ];

  const recentFeedback = [
    {
      id: 1,
      author: "Sarah Mitchell",
      topic: "Park Renovation",
      comment: "Love the new accessibility features in the design!",
      likes: 24,
      date: "2 hours ago"
    },
    {
      id: 2,
      author: "James Wilson",
      topic: "Transport Review",
      comment: "We need better cycling infrastructure on Main Street.",
      likes: 18,
      date: "5 hours ago"
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/10 text-green-700';
      case 'closing-soon': return 'bg-orange-500/10 text-orange-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  const getEngagementColor = (engagement: string) => {
    switch (engagement) {
      case 'high': return 'bg-blue-500/10 text-blue-700';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700';
      case 'low': return 'bg-gray-500/10 text-gray-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Public Engagement</h2>
          <p className="text-muted-foreground">
            Manage consultations, surveys, and citizen feedback
          </p>
        </div>
        <Button>
          Start New Consultation
        </Button>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {engagementMetrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{metric.label}</span>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-bold">{metric.value}</span>
                <span className="text-sm text-green-600">{metric.trend}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Consultations */}
      <Card>
        <CardHeader>
          <CardTitle>Active Consultations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activeConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold">{consultation.title}</h3>
                    <Badge className={getStatusColor(consultation.status)}>
                      {consultation.status.replace('-', ' ')}
                    </Badge>
                    <Badge className={getEngagementColor(consultation.engagement)}>
                      {consultation.engagement} engagement
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{consultation.responses} responses</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>Closes {consultation.deadline}</span>
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Public Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Public Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentFeedback.map((feedback) => (
              <div key={feedback.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="font-semibold">{feedback.author}</div>
                    <div className="text-sm text-muted-foreground">
                      on {feedback.topic}
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">{feedback.date}</span>
                </div>
                <p className="text-sm mb-3">{feedback.comment}</p>
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    {feedback.likes}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    Reply
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PublicEngagement;
