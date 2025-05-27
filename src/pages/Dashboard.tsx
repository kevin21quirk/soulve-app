
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MessageSquare, Upload, UserPlus, Users, Send, Bell, Keyboard, Search } from "lucide-react";
import SocialFeed from "@/components/dashboard/SocialFeed";
import ContentUpload from "@/components/dashboard/ContentUpload";
import EnhancedConnections from "@/components/dashboard/EnhancedConnections";
import EnhancedMessaging from "@/components/dashboard/EnhancedMessaging";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import KeyboardShortcuts from "@/components/dashboard/KeyboardShortcuts";
import SearchBar from "@/components/dashboard/SearchBar";
import ErrorBoundary from "@/components/ui/error-boundary";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("feed");
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { toast } = useToast();

  // Keyboard shortcuts configuration
  const shortcuts = [
    {
      key: 'k',
      ctrlKey: true,
      action: () => setShowSearch(true),
      description: 'Open search'
    },
    {
      key: 'n',
      ctrlKey: true,
      action: () => setActiveTab('upload'),
      description: 'Create new post'
    },
    {
      key: 'm',
      ctrlKey: true,
      action: () => setActiveTab('messages'),
      description: 'Open messages'
    },
    {
      key: 'c',
      ctrlKey: true,
      shiftKey: true,
      action: () => setActiveTab('connections'),
      description: 'Open connections'
    },
    {
      key: 'Escape',
      action: () => {
        setShowSearch(false);
        setShowNotifications(false);
        setShowShortcuts(false);
      },
      description: 'Close modals'
    },
    {
      key: '?',
      action: () => setShowShortcuts(true),
      description: 'Show shortcuts'
    }
  ];

  useKeyboardShortcuts(shortcuts);

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
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50">
        {/* Header */}
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
              
              {/* Enhanced Header Controls */}
              <div className="flex items-center space-x-4">
                {/* Global Search */}
                <Popover open={showSearch} onOpenChange={setShowSearch}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className="hover:scale-105 transition-transform">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4">
                    <SearchBar 
                      onSearch={handleGlobalSearch}
                      placeholder="Search posts, people, locations..."
                      className="w-full"
                    />
                  </PopoverContent>
                </Popover>

                {/* Notifications */}
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

                {/* Keyboard Shortcuts */}
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

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white/80 backdrop-blur">
              <TabsTrigger value="feed" className="flex items-center space-x-2 transition-all data-[state=active]:scale-105">
                <MessageSquare className="h-4 w-4" />
                <span>Feed</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="flex items-center space-x-2 transition-all data-[state=active]:scale-105">
                <Upload className="h-4 w-4" />
                <span>Share Need</span>
              </TabsTrigger>
              <TabsTrigger value="connections" className="flex items-center space-x-2 transition-all data-[state=active]:scale-105">
                <UserPlus className="h-4 w-4" />
                <span>Connections</span>
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center space-x-2 transition-all data-[state=active]:scale-105">
                <Send className="h-4 w-4" />
                <span>Messages</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="animate-fade-in">
              <SocialFeed />
            </TabsContent>

            <TabsContent value="upload" className="animate-fade-in">
              <ContentUpload />
            </TabsContent>

            <TabsContent value="connections" className="animate-fade-in">
              <EnhancedConnections />
            </TabsContent>

            <TabsContent value="messages" className="animate-fade-in">
              <EnhancedMessaging />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default Dashboard;
