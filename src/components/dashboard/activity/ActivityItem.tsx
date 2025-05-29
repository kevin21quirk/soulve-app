
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, MapPin, Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";
import { ActivityItem as ActivityItemType, getActivityIcon, getPriorityColor, getCategoryColor, formatTimeAgo } from "./ActivityTypes";

interface ActivityItemProps {
  activity: ActivityItemType;
}

const ActivityItem = ({ activity }: ActivityItemProps) => {
  const iconConfig = getActivityIcon(activity.type);
  const IconComponent = {
    MessageSquare,
    Users: MessageSquare, // fallback
    UserPlus: MessageSquare, // fallback
    Heart,
    Share2,
    Bookmark: MessageSquare, // fallback
    MapPin,
    Activity: MessageSquare // fallback
  }[iconConfig.icon] || MessageSquare;

  return (
    <div
      className={`p-3 border-b border-gray-100 border-l-4 transition-all duration-500 hover:bg-gray-50 ${
        getPriorityColor(activity.priority)
      } ${activity.isNew ? 'animate-fade-in' : ''}`}
    >
      <div className="flex items-start space-x-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={activity.avatar} />
            <AvatarFallback className="text-xs">
              {activity.user.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
            <IconComponent className={`h-4 w-4 ${iconConfig.color}`} />
          </div>
          {activity.isNew && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {activity.user}
            </p>
            <div className="flex items-center space-x-1">
              <Badge variant="outline" className={`text-xs ${getCategoryColor(activity.category)}`}>
                {activity.category}
              </Badge>
              <Button variant="ghost" size="sm" className="h-5 w-5 p-0">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            {activity.content}
          </p>
          
          {activity.location && (
            <div className="flex items-center space-x-1 mb-2">
              <MapPin className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500">{activity.location}</span>
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-400">
                {formatTimeAgo(activity.timestamp)}
              </span>
            </div>
            
            {activity.engagement && (
              <div className="flex items-center space-x-3 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Heart className="h-3 w-3" />
                  <span>{activity.engagement.likes}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-3 w-3" />
                  <span>{activity.engagement.comments}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Share2 className="h-3 w-3" />
                  <span>{activity.engagement.shares}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
