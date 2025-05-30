
import { Home, Users, MessageCircle, Bell, User, TrendingUp, Menu } from "lucide-react";

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileNavigation = ({ activeTab, onTabChange }: MobileNavigationProps) => {
  const tabs = [
    { id: "feed", icon: Home, label: "Home" },
    { id: "discover", icon: Users, label: "Discover" },
    { id: "messaging", icon: MessageCircle, label: "Messages" },
    { id: "notifications", icon: Bell, label: "Activity" },
    { id: "analytics-points", icon: TrendingUp, label: "Trust" },
    { id: "menu", icon: Menu, label: "Menu" },
  ];

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
      </div>
    </nav>
  );
};

export default MobileNavigation;
