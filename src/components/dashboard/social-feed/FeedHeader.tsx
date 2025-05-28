
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
    <Card className="border-gray-100 shadow-sm">
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
              className="flex items-center space-x-2 border-teal-200 hover:bg-teal-50 hover:border-teal-300"
            >
              <Search className="h-4 w-4 text-teal-600" />
              <span>Search</span>
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onFilter}
              className="flex items-center space-x-2 border-teal-200 hover:bg-teal-50 hover:border-teal-300"
            >
              <Filter className="h-4 w-4 text-teal-600" />
              <span>Filter</span>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-teal-600" />
            <span className="text-sm text-gray-600">{totalPosts} active posts</span>
          </div>
          
          {urgentPosts > 0 && (
            <Badge variant="destructive" className="flex items-center space-x-1 bg-gradient-to-r from-red-500 to-pink-500">
              <Zap className="h-3 w-3" />
              <span>{urgentPosts} urgent</span>
            </Badge>
          )}
          
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-600">247 helpers online</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Bell className="h-4 w-4 text-cyan-600" />
            <span className="text-sm text-gray-600">12 new this hour</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedHeader;
