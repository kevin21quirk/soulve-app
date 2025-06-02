import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  Home, 
  Users, 
  Bell, 
  Settings, 
  Plus,
  MessageSquare,
  Search,
  Shield
} from "lucide-react";

import MobileDashboard from "@/components/mobile/MobileDashboard";
import SocialFeed from "@/components/dashboard/SocialFeed";
import UserProfile from "@/components/dashboard/UserProfile";
import EnhancedConnections from "@/components/dashboard/EnhancedConnections";
import NotificationCenter from "@/components/notifications/NotificationCenter";
import PrivacySettingsPanel from "@/components/privacy/PrivacySettingsPanel";
import CreatePostModal from "@/components/dashboard/post-creation/CreatePostModal";
import EnhancedUserDiscovery from "@/components/connections/EnhancedUserDiscovery";
import MessagingInterface from "@/components/dashboard/messaging/MessagingInterface";

interface DashboardProps {
  // Define any props for the Dashboard component here
}

const Dashboard = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("feed");
  const [showCreatePost, setShowCreatePost] = useState(false);

  if (isMobile) {
    return <MobileDashboard />;
  }

  const tabItems = [
    { value: "feed", label: "Feed", icon: Home },
    { value: "connections", label: "Network", icon: Users },
    { value: "discover", label: "Discover", icon: Search },
    { value: "messages", label: "Messages", icon: MessageSquare },
    { value: "notifications", label: "Notifications", icon: Bell },
    { value: "profile", label: "Profile", icon: Users },
    { value: "privacy", label: "Privacy", icon: Shield },
    { value: "settings", label: "Settings", icon: Settings }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">SouLVE</h1>
          <Button onClick={() => setShowCreatePost(true)} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-8 w-full max-w-4xl">
            {tabItems.map((item) => (
              <TabsTrigger
                key={item.value}
                value={item.value}
                className="flex items-center space-x-2"
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="mt-6">
            <TabsContent value="feed">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <SocialFeed />
                </div>
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab("discover")}
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Discover People
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab("connections")}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        View Network
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => setActiveTab("privacy")}
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        Privacy Settings
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="connections">
              <EnhancedConnections />
            </TabsContent>

            <TabsContent value="discover">
              <EnhancedUserDiscovery />
            </TabsContent>

            <TabsContent value="messages">
              <MessagingInterface />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationCenter />
            </TabsContent>

            <TabsContent value="profile">
              <UserProfile />
            </TabsContent>

            <TabsContent value="privacy">
              <PrivacySettingsPanel />
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Additional settings coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        <CreatePostModal 
          isOpen={showCreatePost} 
          onOpenChange={setShowCreatePost} 
        />
      </div>
    </div>
  );
};

export default Dashboard;
