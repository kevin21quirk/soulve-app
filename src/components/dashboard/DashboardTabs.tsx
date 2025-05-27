
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import EnhancedSocialFeed from "./EnhancedSocialFeed";
import EnhancedAnalyticsDashboard from "./EnhancedAnalyticsDashboard";
import EnhancedConnections from "./EnhancedConnections";
import EnhancedMessaging from "./EnhancedMessaging";
import SmartRecommendations from "./SmartRecommendations";
import GamificationPanel from "./GamificationPanel";
import TrustFootprint from "./TrustFootprint";
import { useRealTimeNotifications, NotificationPanel } from "@/components/ui/real-time-notifications";
import { useIsMobile } from "@/components/ui/mobile-optimized";
import { useScreenReader } from "@/hooks/useAccessibility";
import { mockTrustFootprint } from "@/data/mockTrustFootprint";

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardTabs = ({ activeTab, setActiveTab }: DashboardTabsProps) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useRealTimeNotifications();
  const { announce } = useScreenReader();
  const isMobile = useIsMobile();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    announce(`Switched to ${value} tab`);
  };

  const tabs = [
    { id: "feed", label: "Community Feed", component: EnhancedSocialFeed },
    { id: "analytics", label: "Analytics", component: EnhancedAnalyticsDashboard },
    { id: "connections", label: "Connections", component: EnhancedConnections },
    { id: "messaging", label: "Messages", component: EnhancedMessaging, badge: 3 },
    { id: "recommendations", label: "Recommendations", component: SmartRecommendations },
    { id: "gamification", label: "Achievements", component: GamificationPanel },
    { id: "trust", label: "Trust", component: () => <TrustFootprint trustFootprint={mockTrustFootprint} /> },
  ];

  if (isMobile) {
    // Mobile tab layout
    return (
      <div className="pb-20"> {/* Account for mobile action bar */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <div className="sticky top-0 z-40 bg-white border-b">
            <TabsList className="w-full justify-start overflow-x-auto">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative whitespace-nowrap"
                  aria-label={`${tab.label} tab${tab.badge ? ` with ${tab.badge} notifications` : ''}`}
                >
                  {tab.label}
                  {tab.badge && (
                    <Badge 
                      variant="destructive" 
                      className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
                      aria-hidden="true"
                    >
                      {tab.badge}
                    </Badge>
                  )}
                </TabsTrigger>
              ))}
              {unreadCount > 0 && (
                <TabsTrigger
                  value="notifications"
                  className="relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  Notifications
                  <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                    {unreadCount}
                  </Badge>
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          <div className="p-4">
            {tabs.map((tab) => (
              <TabsContent key={tab.id} value={tab.id} className="mt-0">
                <tab.component />
              </TabsContent>
            ))}

            {showNotifications && (
              <div className="mt-4">
                <NotificationPanel
                  notifications={notifications}
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={markAllAsRead}
                  onRemove={removeNotification}
                />
              </div>
            )}
          </div>
        </Tabs>
      </div>
    );
  }

  // Desktop tab layout
  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="flex items-center justify-between mb-6">
        <TabsList className="grid w-full grid-cols-7 lg:w-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="relative"
              aria-label={`${tab.label} tab${tab.badge ? ` with ${tab.badge} notifications` : ''}`}
            >
              {tab.label}
              {tab.badge && (
                <Badge 
                  variant="destructive" 
                  className="ml-2 h-5 w-5 rounded-full p-0 text-xs"
                  aria-hidden="true"
                >
                  {tab.badge}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {unreadCount > 0 && (
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 text-gray-600 hover:text-gray-900"
            aria-label={`${unreadCount} unread notifications`}
          >
            <span className="text-sm">Notifications</span>
            <Badge variant="destructive" className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
              {unreadCount}
            </Badge>
          </button>
        )}
      </div>

      {showNotifications && (
        <div className="mb-6">
          <NotificationPanel
            notifications={notifications}
            onMarkAsRead={markAsRead}
            onMarkAllAsRead={markAllAsRead}
            onRemove={removeNotification}
          />
        </div>
      )}

      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          <tab.component />
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default DashboardTabs;
