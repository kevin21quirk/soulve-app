
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell, Keyboard, Search, Users, UserPlus, Activity } from "lucide-react";
import EnhancedSearchBar from "./search/EnhancedSearchBar";
import RealTimeActivity from "./RealTimeActivity";
import NotificationCenter from "./NotificationCenter";
import KeyboardShortcuts from "./KeyboardShortcuts";
import { useToast } from "@/hooks/use-toast";

interface DashboardHeaderProps {
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  showNotifications: boolean;
  setShowNotifications: (show: boolean) => void;
  showShortcuts: boolean;
  setShowShortcuts: (show: boolean) => void;
  showActivity: boolean;
  setShowActivity: (show: boolean) => void;
}

const DashboardHeader = ({
  showSearch,
  setShowSearch,
  showNotifications,
  setShowNotifications,
  showShortcuts,
  setShowShortcuts,
  showActivity,
  setShowActivity,
}: DashboardHeaderProps) => {
  const { toast } = useToast();

  const handleGlobalSearch = (query: string) => {
    if (query) {
      toast({
        title: "Searching...",
        description: `Looking for "${query}" across all content.`,
      });
      console.log("Global search:", query);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/25feaabf-2868-4cfc-a034-77054efffb53.png" 
              alt="SouLVE Icon" 
              className="h-8 w-8 hover:scale-110 transition-transform" 
            />
            <h1 className="text-2xl font-bold text-gray-900">SouLVE</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Popover open={showSearch} onOpenChange={setShowSearch}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-4">
                <EnhancedSearchBar 
                  onSearch={handleGlobalSearch}
                  placeholder="Search posts, people, locations..."
                  className="w-full"
                  showTrending={true}
                />
              </PopoverContent>
            </Popover>

            <Popover open={showActivity} onOpenChange={setShowActivity}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                  <Activity className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <RealTimeActivity />
              </PopoverContent>
            </Popover>

            <Popover open={showNotifications} onOpenChange={setShowNotifications}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">3</span>
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0">
                <NotificationCenter />
              </PopoverContent>
            </Popover>

            <Popover open={showShortcuts} onOpenChange={setShowShortcuts}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                  <Keyboard className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0">
                <KeyboardShortcuts />
              </PopoverContent>
            </Popover>

            <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
              <Users className="h-4 w-4 mr-2" />
              My Network
            </Button>
            <Button size="sm" className="hover:scale-105 transition-transform">
              <UserPlus className="h-4 w-4 mr-2" />
              Help Someone
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
