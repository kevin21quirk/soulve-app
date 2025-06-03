
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Home, 
  Users, 
  Search, 
  MessageCircle, 
  User, 
  TrendingUp, 
  Settings,
  Shield
} from "lucide-react";
import { useWaitlist } from "@/hooks/useWaitlist";

interface MainTabsListProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MainTabsList = ({ activeTab, onTabChange }: MainTabsListProps) => {
  const { isAdmin } = useWaitlist();

  return (
    <TabsList className="grid w-full grid-cols-6 lg:grid-cols-8">
      <TabsTrigger 
        value="feed" 
        onClick={() => onTabChange("feed")}
        className="flex items-center space-x-2"
      >
        <Home className="h-4 w-4" />
        <span className="hidden sm:inline">Feed</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="discover" 
        onClick={() => onTabChange("discover")}
        className="flex items-center space-x-2"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Discover</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="connections" 
        onClick={() => onTabChange("connections")}
        className="flex items-center space-x-2"
      >
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Connect</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="messaging" 
        onClick={() => onTabChange("messaging")}
        className="flex items-center space-x-2"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Messages</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="analytics" 
        onClick={() => onTabChange("analytics")}
        className="flex items-center space-x-2"
      >
        <TrendingUp className="h-4 w-4" />
        <span className="hidden sm:inline">Impact</span>
      </TabsTrigger>
      
      <TabsTrigger 
        value="profile" 
        onClick={() => onTabChange("profile")}
        className="flex items-center space-x-2"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Profile</span>
      </TabsTrigger>

      {isAdmin && (
        <TabsTrigger 
          value="admin" 
          onClick={() => onTabChange("admin")}
          className="flex items-center space-x-2"
        >
          <Shield className="h-4 w-4" />
          <span className="hidden sm:inline">Admin</span>
        </TabsTrigger>
      )}
      
      <TabsTrigger 
        value="settings" 
        onClick={() => onTabChange("settings")}
        className="flex items-center space-x-2"
      >
        <Settings className="h-4 w-4" />
        <span className="hidden sm:inline">Settings</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default MainTabsList;
