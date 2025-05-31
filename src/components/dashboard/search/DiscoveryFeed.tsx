
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  TrendingUp, 
  MapPin, 
  Users, 
  Star, 
  MessageCircle,
  Share2,
  Bookmark,
  Clock,
  Filter,
  Search
} from "lucide-react";

interface DiscoveryItem {
  id: string;
  type: 'trending_post' | 'popular_user' | 'active_group' | 'local_event';
  title: string;
  description: string;
  metadata: any;
  engagement: {
    likes: number;
    comments: number;
    shares: number;
  };
  location?: string;
  timestamp: string;
  category: string;
}

interface DiscoveryFeedProps {
  searchQuery?: string;
  filters?: any;
  onItemClick: (item: DiscoveryItem) => void;
}

const DiscoveryFeed = ({ searchQuery = "", filters = {}, onItemClick }: DiscoveryFeedProps) => {
  const [activeTab, setActiveTab] = useState("trending");

  // Mock discovery data
  const discoveryItems: DiscoveryItem[] = [
    {
      id: '1',
      type: 'trending_post',
      title: 'Emergency Pet Care Needed Downtown',
      description: 'Looking for immediate help with pet sitting while I handle a family emergency. Will pay well for reliable care.',
      metadata: { urgency: 'urgent', author: 'Sarah M.', trustScore: 95 },
      engagement: { likes: 23, comments: 8, shares: 5 },
      location: 'Downtown London',
      timestamp: '2 hours ago',
      category: 'pet-care'
    },
    {
      id: '2',
      type: 'popular_user',
      title: 'Mike Johnson - Community Champion',
      description: 'Local handyman offering free repairs for elderly neighbors. Helped 50+ families this year.',
      metadata: { trustScore: 98, helpCount: 127, specialties: ['repairs', 'elderly-care'] },
      engagement: { likes: 156, comments: 34, shares: 67 },
      location: 'Manchester',
      timestamp: 'Active now',
      category: 'help-offered'
    },
    {
      id: '3',
      type: 'active_group',
      title: 'London Mutual Aid Network',
      description: 'Active community group coordinating neighborhood support and emergency assistance.',
      metadata: { memberCount: 1250, activeHelpers: 89, recentPosts: 23 },
      engagement: { likes: 89, comments: 45, shares: 23 },
      location: 'London',
      timestamp: '1 hour ago',
      category: 'community'
    },
    {
      id: '4',
      type: 'local_event',
      title: 'Community Garden Cleanup',
      description: 'Join us this Saturday for a neighborhood cleanup and garden maintenance. All skill levels welcome!',
      metadata: { attendees: 34, date: 'This Saturday', organizer: 'Green Spaces Initiative' },
      engagement: { likes: 67, comments: 12, shares: 18 },
      location: 'Birmingham',
      timestamp: 'Tomorrow',
      category: 'volunteer'
    }
  ];

  const filteredItems = useMemo(() => {
    let items = discoveryItems;

    // Filter by search query
    if (searchQuery) {
      items = items.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by active tab
    switch (activeTab) {
      case "trending":
        return items.sort((a, b) => (b.engagement.likes + b.engagement.shares) - (a.engagement.likes + a.engagement.shares));
      case "recent":
        return items.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      case "nearby":
        return items.filter(item => item.location?.includes("London"));
      case "urgent":
        return items.filter(item => item.metadata.urgency === 'urgent');
      default:
        return items;
    }
  }, [searchQuery, activeTab]);

  const tabs = [
    { id: "trending", label: "Trending", icon: TrendingUp },
    { id: "recent", label: "Recent", icon: Clock },
    { id: "nearby", label: "Nearby", icon: MapPin },
    { id: "urgent", label: "Urgent", icon: Filter }
  ];

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'popular_user': return Users;
      case 'active_group': return Users;
      case 'local_event': return MapPin;
      default: return MessageCircle;
    }
  };

  const getItemColor = (type: string) => {
    switch (type) {
      case 'trending_post': return 'border-orange-200 bg-orange-50';
      case 'popular_user': return 'border-blue-200 bg-blue-50';
      case 'active_group': return 'border-green-200 bg-green-50';
      case 'local_event': return 'border-purple-200 bg-purple-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Discovery Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center space-x-2 whitespace-nowrap"
            >
              <IconComponent className="h-4 w-4" />
              <span>{tab.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Discovery Items */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const ItemIcon = getItemIcon(item.type);
          return (
            <Card 
              key={item.id} 
              className={`cursor-pointer hover:shadow-md transition-all ${getItemColor(item.type)}`}
              onClick={() => onItemClick(item)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-full bg-white">
                      <ItemIcon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.type.replace('_', ' ')}
                        </Badge>
                        {item.location && (
                          <div className="flex items-center text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {item.location}
                          </div>
                        )}
                        <span className="text-xs text-gray-500">{item.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  
                  {item.metadata.urgency === 'urgent' && (
                    <Badge variant="destructive" className="text-xs">
                      Urgent
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <p className="text-gray-700 mb-4">{item.description}</p>
                
                {/* Metadata */}
                {item.type === 'popular_user' && (
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm">Trust Score: {item.metadata.trustScore}%</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      Helped {item.metadata.helpCount} people
                    </span>
                  </div>
                )}
                
                {item.type === 'active_group' && (
                  <div className="flex items-center space-x-4 mb-3">
                    <span className="text-sm">{item.metadata.memberCount} members</span>
                    <span className="text-sm text-green-600">
                      {item.metadata.activeHelpers} active helpers
                    </span>
                  </div>
                )}

                {/* Engagement */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{item.engagement.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{item.engagement.comments}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Share2 className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{item.engagement.shares}</span>
                    </div>
                  </div>
                  
                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No results found</h3>
              <p>Try adjusting your search or filters to find what you're looking for.</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DiscoveryFeed;
