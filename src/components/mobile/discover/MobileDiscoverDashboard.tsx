
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DiscoverSearchBar from "./DiscoverSearchBar";
import QuickConnectActions from "./QuickConnectActions";
import EnhancedDiscoverGrid from "./EnhancedDiscoverGrid";
import EnhancedUserDiscovery from "../../connections/EnhancedUserDiscovery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Search, Sparkles } from "lucide-react";

const MobileDiscoverDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();

  const handleUserClick = (userId: string) => {
    // Navigate to user profile
    window.location.hash = `#/profile/${userId}`;
  };

  const handleMessage = (userId: string) => {
    toast({
      title: "Messaging",
      description: "Opening chat with user...",
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Discover & Connect
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="people" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="people" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                People
              </TabsTrigger>
              <TabsTrigger value="activities" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Activities
              </TabsTrigger>
            </TabsList>

            <TabsContent value="people" className="mt-4 space-y-4">
              <EnhancedUserDiscovery 
                onUserClick={handleUserClick}
                onMessage={handleMessage}
              />
            </TabsContent>

            <TabsContent value="activities" className="mt-4 space-y-4">
              <DiscoverSearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                activeFilter={activeFilter}
                setActiveFilter={setActiveFilter}
              />

              <QuickConnectActions />

              <EnhancedDiscoverGrid />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MobileDiscoverDashboard;
