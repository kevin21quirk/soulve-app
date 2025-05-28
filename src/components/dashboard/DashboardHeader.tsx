
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
  onNavigateToTab: (tab: string) => void;
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
  onNavigateToTab,
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

  const handleMyNetworkClick = () => {
    onNavigateToTab("connections");
    toast({
      title: "Navigating to My Network",
      description: "Explore your connections and build new relationships.",
    });
  };

  const handleHelpSomeoneClick = () => {
    onNavigateToTab("help-center");
    toast({
      title: "Opening Help Center",
      description: "Find comprehensive ways to support your community.",
    });
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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">SouLVE</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <Popover open={showSearch} onOpenChange={setShowSearch}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform border-teal-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50">
                  <Search className="h-4 w-4 mr-2 text-teal-600" />
                  <span className="text-teal-700">Search</span>
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
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform border-teal-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50">
                  <Activity className="h-4 w-4 text-teal-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <RealTimeActivity />
              </PopoverContent>
            </Popover>

            <Popover open={showNotifications} onOpenChange={setShowNotifications}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform relative border-teal-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50">
                  <Bell className="h-4 w-4 text-teal-600" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
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
                <Button variant="outline" size="sm" className="hover:scale-105 transition-transform border-teal-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50">
                  <Keyboard className="h-4 w-4 text-teal-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-96 p-0">
                <KeyboardShortcuts />
              </PopoverContent>
            </Popover>

            <Button 
              variant="outline" 
              size="sm" 
              className="hover:scale-105 transition-transform border-teal-300 hover:bg-gradient-to-r hover:from-teal-50 hover:to-blue-50"
              onClick={handleMyNetworkClick}
            >
              <Users className="h-4 w-4 mr-2 text-teal-600" />
              <span className="text-teal-700">My Network</span>
            </Button>
            <Button 
              size="sm" 
              className="hover:scale-105 transition-transform bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white shadow-lg"
              onClick={handleHelpSomeoneClick}
            >
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
