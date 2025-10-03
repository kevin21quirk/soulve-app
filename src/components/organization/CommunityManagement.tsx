import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, MessageSquare, MapPin, TrendingUp, Bell } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface CommunityManagementProps {
  organizationId: string;
}

const CommunityManagement = ({ organizationId }: CommunityManagementProps) => {
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);

  // Mock data - replace with real data from Supabase
  const communityMetrics = [
    { label: "Active Groups", value: 24, trend: "+4" },
    { label: "Community Events", value: 12, trend: "+3" },
    { label: "Active Members", value: 3450, trend: "+120" },
    { label: "Engagement Rate", value: "78%", trend: "+5%" },
  ];

  const communityGroups = [
    {
      id: 1,
      name: "Neighbourhood Watch - District 3",
      members: 245,
      activity: "high",
      lastActive: "2 hours ago",
      category: "Safety",
      coordinator: "Sarah Chen"
    },
    {
      id: 2,
      name: "Green Spaces Committee",
      members: 156,
      activity: "medium",
      lastActive: "1 day ago",
      category: "Environment",
      coordinator: "James Wright"
    },
    {
      id: 3,
      name: "Youth Council",
      members: 89,
      activity: "high",
      lastActive: "5 hours ago",
      category: "Youth",
      coordinator: "Emma Taylor"
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Town Hall Meeting",
      date: "2025-04-05",
      time: "18:00",
      location: "Community Centre",
      attendees: 145,
      capacity: 200
    },
    {
      id: 2,
      title: "Community Clean-Up Day",
      date: "2025-04-12",
      time: "09:00",
      location: "Central Park",
      attendees: 89,
      capacity: 150
    },
    {
      id: 3,
      title: "Youth Sports Festival",
      date: "2025-04-18",
      time: "14:00",
      location: "Sports Complex",
      attendees: 234,
      capacity: 300
    },
  ];

  const recentDiscussions = [
    {
      id: 1,
      topic: "Improving Local Transport",
      group: "Transport Forum",
      replies: 34,
      views: 245,
      lastActive: "15 min ago"
    },
    {
      id: 2,
      topic: "Summer Events Planning",
      group: "Events Committee",
      replies: 22,
      views: 156,
      lastActive: "1 hour ago"
    },
  ];

  const getActivityColor = (activity: string) => {
    switch (activity) {
      case 'high': return 'bg-green-500/10 text-green-700';
      case 'medium': return 'bg-yellow-500/10 text-yellow-700';
      case 'low': return 'bg-gray-500/10 text-gray-700';
      default: return 'bg-gray-500/10 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Community Management</h2>
          <p className="text-muted-foreground">
            Manage community groups, events, and engagement
          </p>
        </div>
        <Button onClick={() => {
          toast({
            title: "Create Event",
            description: "Opening event creation form...",
          });
        }}>
          Create Event
        </Button>
      </div>

      {/* Community Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {communityMetrics.map((metric) => (
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

      {/* Community Groups */}
      <Card>
        <CardHeader>
          <CardTitle>Active Community Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {communityGroups.map((group) => (
              <div
                key={group.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <div className="flex items-start space-x-4 flex-1">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{group.name}</h3>
                      <Badge className={getActivityColor(group.activity)}>
                        {group.activity} activity
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span>{group.members} members</span>
                      </span>
                      <span>{group.category}</span>
                      <span>Coordinator: {group.coordinator}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Last active {group.lastActive}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    if (expandedGroup === group.id) {
                      setExpandedGroup(null);
                    } else {
                      setExpandedGroup(group.id);
                      toast({
                        title: "Group Details",
                        description: `Viewing details for "${group.name}"`,
                      });
                    }
                  }}
                >
                  {expandedGroup === group.id ? "Hide Group" : "View Group"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Events */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold">{event.title}</h3>
                    <Badge variant="outline">
                      {event.attendees}/{event.capacity}
                    </Badge>
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4" />
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-muted-foreground">Registration</span>
                      <span className="font-semibold">
                        {Math.round((event.attendees / event.capacity) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all"
                        style={{ width: `${(event.attendees / event.capacity) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Discussions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Discussions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentDiscussions.map((discussion) => (
                <div
                  key={discussion.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                >
                  <h3 className="font-semibold mb-2">{discussion.topic}</h3>
                  <div className="text-sm text-muted-foreground mb-3">
                    in {discussion.group}
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center space-x-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{discussion.replies} replies</span>
                    </span>
                    <span>{discussion.views} views</span>
                    <span>Active {discussion.lastActive}</span>
                  </div>
                </div>
              ))}
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  toast({
                    title: "View All Discussions",
                    description: "Loading community discussions...",
                  });
                }}
              >
                <Bell className="h-4 w-4 mr-2" />
                View All Discussions
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommunityManagement;
