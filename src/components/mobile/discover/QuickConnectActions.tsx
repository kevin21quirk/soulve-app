
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  Users, 
  Target, 
  MapPin, 
  Zap, 
  TrendingUp,
  MessageCircle,
  Calendar
} from "lucide-react";

interface QuickConnectActionsProps {
  onAction: (type: string, data?: any) => void;
}

const QuickConnectActions = ({ onAction }: QuickConnectActionsProps) => {
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const quickActions = [
    {
      id: "find-helpers",
      title: "Find Helpers",
      description: "Connect with people who can help",
      icon: UserPlus,
      color: "blue",
      count: 23
    },
    {
      id: "join-groups",
      title: "Join Groups",
      description: "Find communities near you",
      icon: Users,
      color: "green",
      count: 15
    },
    {
      id: "support-campaigns",
      title: "Support Causes",
      description: "Join ongoing campaigns",
      icon: Target,
      color: "purple",
      count: 8
    },
    {
      id: "nearby-events",
      title: "Nearby Events",
      description: "Attend local meetups",
      icon: Calendar,
      color: "orange",
      count: 5
    }
  ];

  const trendingTopics = [
    { tag: "#CommunityHelp", posts: 142 },
    { tag: "#LocalFood", posts: 89 },
    { tag: "#SeniorCare", posts: 67 },
    { tag: "#TechSupport", posts: 45 }
  ];

  const handleActionClick = (actionId: string) => {
    setActiveAction(actionId);
    onAction(actionId);
  };

  return (
    <div className="space-y-4">
      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Zap className="h-5 w-5 text-orange-500" />
            <span>Quick Connect</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                className={`h-auto p-3 flex flex-col items-center space-y-2 ${
                  activeAction === action.id ? 'border-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleActionClick(action.id)}
              >
                <action.icon className={`h-6 w-6 text-${action.color}-500`} />
                <div className="text-center">
                  <div className="font-medium text-xs">{action.title}</div>
                  <div className="text-xs text-gray-500">{action.description}</div>
                  <Badge variant="secondary" className="mt-1 text-xs">
                    {action.count}
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Trending Topics */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span>Trending Now</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {trendingTopics.map((topic) => (
              <Button
                key={topic.tag}
                variant="ghost"
                className="w-full justify-between h-auto p-2"
                onClick={() => onAction("search-topic", topic.tag)}
              >
                <span className="font-medium text-sm">{topic.tag}</span>
                <Badge variant="outline" className="text-xs">
                  {topic.posts} posts
                </Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Suggested Connections */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <MessageCircle className="h-5 w-5 text-blue-500" />
            <span>Start Conversations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-3"
              onClick={() => onAction("ai-suggestions")}
            >
              <div className="text-left">
                <div className="font-medium text-sm">AI Conversation Starters</div>
                <div className="text-xs text-gray-500">Get personalized icebreakers</div>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start h-auto p-3"
              onClick={() => onAction("nearby-connections")}
            >
              <div className="text-left">
                <div className="font-medium text-sm">People Nearby</div>
                <div className="text-xs text-gray-500">Connect with neighbors</div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickConnectActions;
