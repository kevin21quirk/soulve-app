
import { Button } from "@/components/ui/button";
import { Search, BarChart3 } from "lucide-react";

interface ConnectionsHeaderProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  showAnalytics: boolean;
  setShowAnalytics: (show: boolean) => void;
}

const ConnectionsHeader = ({ 
  showSearch, 
  setShowSearch, 
  showAnalytics, 
  setShowAnalytics 
}: ConnectionsHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-center flex-1">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent mb-2">Your Network</h2>
        <p className="text-gray-600">Build trust and connections within your community</p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowSearch(!showSearch)}
          className="flex items-center space-x-2"
        >
          <Search className="h-4 w-4" />
          <span>Search</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAnalytics(!showAnalytics)}
          className="flex items-center space-x-2"
        >
          <BarChart3 className="h-4 w-4" />
          <span>Analytics</span>
        </Button>
      </div>
    </div>
  );
};

export default ConnectionsHeader;
