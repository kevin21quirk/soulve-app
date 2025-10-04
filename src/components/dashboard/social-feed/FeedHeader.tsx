
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Zap, TrendingUp, Users, Bell } from "lucide-react";

interface FeedHeaderProps {
  onSearch: () => void;
  onFilter: () => void;
  totalPosts: number;
  urgentPosts: number;
}

const FeedHeader = ({ onSearch, onFilter, totalPosts, urgentPosts }: FeedHeaderProps) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="text-center flex-1">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">Community Feed</h2>
            <p className="text-gray-600">Discover opportunities to help and make a difference</p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={onSearch}
              className="flex items-center space-x-2"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onFilter}
              className="flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-600">{totalPosts} active posts</span>
          </div>
          
          {urgentPosts > 0 && (
            <Badge variant="destructive" className="flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>{urgentPosts} urgent</span>
            </Badge>
          )}
          
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-green-600" />
            <span className="text-sm text-gray-600">247 helpers online</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-gray-600">12 new this hour</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedHeader;
