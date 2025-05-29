
export interface ActivityItem {
  id: string;
  type: "new_post" | "help_offered" | "connection_made" | "post_liked" | "comment_added" | "share" | "bookmark" | "location_tagged" | "group_joined";
  user: string;
  avatar: string;
  content: string;
  timestamp: Date;
  isNew: boolean;
  priority: "high" | "medium" | "low";
  engagement?: {
    likes: number;
    comments: number;
    shares: number;
  };
  location?: string;
  category: "social" | "help" | "network" | "engagement";
}

export const getActivityIcon = (type: string) => {
  const iconMap = {
    "new_post": { icon: "MessageSquare", color: "text-blue-500" },
    "help_offered": { icon: "Users", color: "text-green-500" },
    "connection_made": { icon: "UserPlus", color: "text-purple-500" },
    "post_liked": { icon: "Heart", color: "text-red-500" },
    "comment_added": { icon: "MessageSquare", color: "text-orange-500" },
    "share": { icon: "Share2", color: "text-blue-600" },
    "bookmark": { icon: "Bookmark", color: "text-yellow-500" },
    "location_tagged": { icon: "MapPin", color: "text-green-600" },
    "group_joined": { icon: "Users", color: "text-indigo-500" },
    "default": { icon: "Activity", color: "text-gray-500" }
  };
  return iconMap[type] || iconMap.default;
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "border-l-red-500 bg-red-50";
    case "medium": return "border-l-yellow-500 bg-yellow-50";
    case "low": return "border-l-green-500 bg-green-50";
    default: return "border-l-gray-300";
  }
};

export const getCategoryColor = (category: string) => {
  switch (category) {
    case "help": return "bg-blue-100 text-blue-800";
    case "network": return "bg-purple-100 text-purple-800";
    case "engagement": return "bg-green-100 text-green-800";
    case "social": return "bg-orange-100 text-orange-800";
    default: return "bg-gray-100 text-gray-800";
  }
};

export const formatTimeAgo = (timestamp: Date) => {
  const diff = Date.now() - timestamp.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};
