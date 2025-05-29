
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SmartRecommendations from "../SmartRecommendations";
import EnhancedConnections from "../EnhancedConnections";

const DiscoverConnectTab = () => {
  return (
    <Tabs defaultValue="recommendations" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="recommendations">Discover</TabsTrigger>
        <TabsTrigger value="connections">Connect</TabsTrigger>
      </TabsList>

      <TabsContent value="recommendations" className="mt-6">
        <SmartRecommendations />
      </TabsContent>

      <TabsContent value="connections" className="mt-6">
        <EnhancedConnections />
      </TabsContent>
    </Tabs>
  );
};

export default DiscoverConnectTab;
