
import { Home, Users, MessageCircle, Bell, User, TrendingUp, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileNavigation = ({ activeTab, onTabChange }: MobileNavigationProps) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const tabs = [
    { id: "feed", icon: Home, label: "Home" },
    { id: "discover", icon: Users, label: "Discover" },
    { id: "messaging", icon: MessageCircle, label: "Messages" },
    { id: "notifications", icon: Bell, label: "Activity" },
    { id: "analytics-points", icon: TrendingUp, label: "Trust" },
  ];

  const profileMenuItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "settings", label: "Settings", icon: User },
    { id: "help", label: "Help & Support", icon: User },
    { id: "logout", label: "Log Out", icon: User },
  ];

  const handleProfileMenuClick = (itemId: string) => {
    if (itemId === "profile") {
      onTabChange("profile");
    }
    // Handle other menu items as needed
    setShowProfileMenu(false);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1 ${
                isActive 
                  ? 'bg-gradient-to-r from-[#0ce4af]/10 to-[#18a5fe]/10 text-[#18a5fe]' 
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <IconComponent className={`h-5 w-5 mb-1 ${isActive ? 'text-[#18a5fe]' : ''}`} />
              <span className={`text-xs font-medium truncate ${isActive ? 'text-[#18a5fe]' : ''}`}>
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Profile Menu */}
        <Popover open={showProfileMenu} onOpenChange={setShowProfileMenu}>
          <PopoverTrigger asChild>
            <button className="flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200 min-w-0 flex-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50">
              <div className="relative mb-1">
                <Avatar className="h-5 w-5">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
                  <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-xs">
                    U
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="h-2 w-2 absolute -right-1 -top-1 text-gray-400" />
              </div>
              <span className="text-xs font-medium truncate">
                Menu
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end" side="top">
            <div className="space-y-1">
              {profileMenuItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => handleProfileMenuClick(item.id)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.label}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </nav>
  );
};

export default MobileNavigation;
