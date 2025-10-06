
import { Home, Users, MessageCircle, Target, Building2, TrendingUp, HeartHandshake, User } from "lucide-react";

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileNavigation = ({ activeTab, onTabChange }: MobileNavigationProps) => {
  const tabs = [
    { id: "feed", icon: Home, label: "Feed" },
    { id: "discover", icon: Users, label: "Discover" },
    { id: "messaging", icon: MessageCircle, label: "Messages" },
    { id: "campaigns", icon: Target, label: "Campaigns" },
    { id: "organisation-tools", icon: Building2, label: "Org Tools" },
    { id: "impact", icon: TrendingUp, label: "Impact" },
    { id: "help-center", icon: HeartHandshake, label: "Help" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-1 py-2 z-50">
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center px-1 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <IconComponent className="h-4 w-4 mb-1" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
