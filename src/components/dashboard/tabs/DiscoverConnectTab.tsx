
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SmartRecommendations from "../SmartRecommendations";
import EnhancedConnections from "../EnhancedConnections";
import EnhancedUserDiscovery from "../../connections/EnhancedUserDiscovery";
import { useNavigate } from "react-router-dom";

const DiscoverConnectTab = () => {
  const navigate = useNavigate();

  const handleUserClick = (userId: string) => {
    navigate(`/profile/${userId}`);
  };

  const handleMessage = (userId: string) => {
    navigate(`/dashboard?tab=messaging&userId=${userId}`);
  };

  return (
    <Tabs defaultValue="discover" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="discover">Discover</TabsTrigger>
        <TabsTrigger value="connect">My Network</TabsTrigger>
        <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
      </TabsList>

      <TabsContent value="discover" className="mt-6">
        <EnhancedUserDiscovery 
          onUserClick={handleUserClick}
          onMessage={handleMessage}
        />
      </TabsContent>

      <TabsContent value="connect" className="mt-6">
        <EnhancedConnections />
      </TabsContent>

      <TabsContent value="recommendations" className="mt-6">
        <SmartRecommendations />
      </TabsContent>
    </Tabs>
  );
};

export default DiscoverConnectTab;
