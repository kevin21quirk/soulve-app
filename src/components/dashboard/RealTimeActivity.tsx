
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { ActivityItem as ActivityItemType } from "./activity/ActivityTypes";
import ActivityHeader from "./activity/ActivityHeader";
import ActivityFilters from "./activity/ActivityFilters";
import ActivityItem from "./activity/ActivityItem";
import ActivityStats from "./activity/ActivityStats";

const RealTimeActivity = () => {
  const [activities, setActivities] = useState<ActivityItemType[]>([
    {
      id: "1",
      type: "new_post",
      user: "Sarah Chen",
      avatar: "",
      content: "posted a new help request: 'Need help moving this weekend'",
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      isNew: true,
      priority: "high",
      engagement: { likes: 12, comments: 3, shares: 2 },
      location: "London, UK",
      category: "help"
    },
    {
      id: "2",
      type: "help_offered",
      user: "Mike Johnson",
      avatar: "",
      content: "offered help with tutoring services",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isNew: true,
      priority: "high",
      engagement: { likes: 8, comments: 1, shares: 0 },
      category: "help"
    },
    {
      id: "3",
      type: "connection_made",
      user: "Emily Rodriguez",
      avatar: "",
      content: "connected with David Kim",
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      isNew: false,
      priority: "medium",
      category: "network"
    },
    {
      id: "4",
      type: "post_liked",
      user: "Alex Martinez",
      avatar: "",
      content: "liked your post about community gardening",
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      isNew: false,
      priority: "low",
      engagement: { likes: 25, comments: 7, shares: 4 },
      category: "engagement"
    }
  ]);

  const [activeTab, setActiveTab] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [isLiveEnabled, setIsLiveEnabled] = useState(true);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLiveEnabled) return;

    const interval = setInterval(() => {
      const activityTypes = ["new_post", "help_offered", "connection_made", "post_liked", "comment_added", "share", "bookmark", "location_tagged", "group_joined"];
      const users = ["Alex Martinez", "Lisa Park", "James Wilson", "Maria Santos", "David Kim", "Anna Thompson"];
      const contents = [
        "just joined the community!",
        "shared a success story",
        "offered to help with tech support",
        "liked your recent post",
        "commented on community discussion",
        "bookmarked your help offer",
        "tagged location in post",
        "joined the local helpers group"
      ];
      const locations = ["London, UK", "New York, US", "Berlin, DE", "Tokyo, JP", "Sydney, AU"];

      const newActivity: ActivityItemType = {
        id: Date.now().toString(),
        type: activityTypes[Math.floor(Math.random() * activityTypes.length)] as any,
        user: users[Math.floor(Math.random() * users.length)],
        avatar: "",
        content: contents[Math.floor(Math.random() * contents.length)],
        timestamp: new Date(),
        isNew: true,
        priority: ["high", "medium", "low"][Math.floor(Math.random() * 3)] as any,
        engagement: {
          likes: Math.floor(Math.random() * 50),
          comments: Math.floor(Math.random() * 20),
          shares: Math.floor(Math.random() * 10)
        },
        location: Math.random() > 0.5 ? locations[Math.floor(Math.random() * locations.length)] : undefined,
        category: ["social", "help", "network", "engagement"][Math.floor(Math.random() * 4)] as any
      };

      setActivities(prev => {
        const updated = [newActivity, ...prev.slice(0, 19)]; // Keep last 20
        // Mark older items as not new
        setTimeout(() => {
          setActivities(current => 
            current.map(item => 
              item.id === newActivity.id ? { ...item, isNew: false } : item
            )
          );
        }, 5000);
        return updated;
      });
    }, 8000); // New activity every 8 seconds

    return () => clearInterval(interval);
  }, [isLiveEnabled]);

  const getFilteredActivities = () => {
    if (activeTab === "all") return activities;
    return activities.filter(activity => activity.category === activeTab);
  };

  return (
    <Card className="w-96">
      <CardHeader className="pb-3">
        <ActivityHeader
          isLiveEnabled={isLiveEnabled}
          onToggleLive={() => setIsLiveEnabled(!isLiveEnabled)}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />
        
        <ActivityFilters
          activeTab={activeTab}
          onTabChange={setActiveTab}
          activities={activities}
        />
      </CardHeader>

      <CardContent className="p-0">
        <div className="max-h-96 overflow-y-auto">
          {getFilteredActivities().map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
          
          {getFilteredActivities().length === 0 && (
            <div className="p-6 text-center">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No activity in this category yet</p>
              <p className="text-xs text-gray-500 mt-1">Check back later for updates</p>
            </div>
          )}
        </div>
        
        <ActivityStats activities={activities} />
      </CardContent>
    </Card>
  );
};

export default RealTimeActivity;
