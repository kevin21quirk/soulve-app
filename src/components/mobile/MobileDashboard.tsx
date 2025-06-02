
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Users, 
  Plus, 
  Bell, 
  Settings,
  MessageSquare,
  Search,
  Shield
} from "lucide-react";

import EnhancedSocialFeed from "@/components/dashboard/EnhancedSocialFeed";
import UserProfile from "@/components/dashboard/UserProfile";
import EnhancedConnections from "@/components/dashboard/EnhancedConnections";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import PrivacySettingsPanel from "@/components/privacy/PrivacySettingsPanel";
import CreatePostModal from "@/components/dashboard/post-creation/CreatePostModal";
import EnhancedUserDiscovery from "@/components/connections/EnhancedUserDiscovery";
import MessagingInterface from "@/components/dashboard/messaging/MessagingInterface";
import MobileSettings from "@/components/mobile/settings/MobileSettings";

const MobileDashboard = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [showCreatePost, setShowCreatePost] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "feed":
        return <EnhancedSocialFeed />;
      case "connections":
        return <EnhancedConnections />;
      case "discover":
        return <EnhancedUserDiscovery />;
      case "messages":
        return <MessagingInterface />;
      case "notifications":
        return <NotificationCenter />;
      case "profile":
        return <UserProfile />;
      case "privacy":
        return <PrivacySettingsPanel />;
      case "settings":
        return <MobileSettings onBack={() => setActiveTab("feed")} />;
      default:
        return <EnhancedSocialFeed />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-teal-700">SouLVE</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("notifications")}
              className="relative"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">3</Badge>
            </Button>
            <Button
              onClick={() => setShowCreatePost(true)}
              size="sm"
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
        <div className="flex justify-around">
          {[
            { id: "feed", icon: Home, label: "Feed" },
            { id: "discover", icon: Search, label: "Discover" },
            { id: "connections", icon: Users, label: "Network" },
            { id: "messages", icon: MessageSquare, label: "Messages" },
            { id: "privacy", icon: Shield, label: "Privacy" },
            { id: "settings", icon: Settings, label: "Settings" },
          ].map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center p-2 h-auto"
            >
              <item.icon className="h-4 w-4 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>

      <CreatePostModal 
        isOpen={showCreatePost} 
        onOpenChange={setShowCreatePost} 
      />
    </div>
  );
};

export default MobileDashboard;
