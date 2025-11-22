import { useState } from "react";
import { Home, Users, MessageCircle, Target, Building2, TrendingUp, HeartHandshake, User, MoreHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface MobileNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const MobileNavigation = ({ activeTab, onTabChange }: MobileNavigationProps) => {
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  // Primary tabs visible in bottom nav
  const primaryTabs = [
    { id: "feed", icon: Home, label: "Feed" },
    { id: "discover", icon: Users, label: "Discover" },
    { id: "messaging", icon: MessageCircle, label: "Messages" },
    { id: "campaigns", icon: Target, label: "Campaigns" },
  ];

  // Secondary tabs in More menu
  const secondaryTabs = [
    { id: "organisation-tools", icon: Building2, label: "Org Tools" },
    { id: "impact", icon: TrendingUp, label: "Impact" },
    { id: "help-center", icon: HeartHandshake, label: "Help Center" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  // Check if any secondary tab is active
  const isSecondaryTabActive = secondaryTabs.some(tab => tab.id === activeTab);

  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    setIsMoreOpen(false);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 z-50 md:hidden">
      <div className="flex justify-around items-center">
        {primaryTabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-colors min-w-0 ${
                isActive
                  ? "bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <IconComponent className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{tab.label}</span>
            </button>
          );
        })}

        {/* More Menu */}
        <Sheet open={isMoreOpen} onOpenChange={setIsMoreOpen}>
          <SheetTrigger asChild>
            <button
              className={`flex flex-col items-center justify-center px-2 py-2 rounded-lg transition-colors min-w-0 ${
                isSecondaryTabActive
                  ? "bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="More options"
            >
              <MoreHorizontal className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">More</span>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto">
            <SheetHeader>
              <SheetTitle>More Options</SheetTitle>
            </SheetHeader>
            <div className="grid grid-cols-2 gap-3 mt-6 pb-4">
              {secondaryTabs.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-lg transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <IconComponent className="h-6 w-6 mb-2" />
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default MobileNavigation;
