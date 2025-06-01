
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrustFootprint from "../TrustFootprint";
import ImpactFootprint from "../ImpactFootprint";
import InteractiveImpactDashboard from "../../impact/InteractiveImpactDashboard";
import { mockTrustFootprint } from "@/data/mockTrustFootprint";

const ImpactTab = () => {
  return (
    <Tabs defaultValue="analytics" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="analytics">Impact Analytics</TabsTrigger>
        <TabsTrigger value="trust">Trust Footprint</TabsTrigger>
        <TabsTrigger value="journey">Impact Journey</TabsTrigger>
      </TabsList>

      <TabsContent value="analytics" className="mt-6">
        <InteractiveImpactDashboard />
      </TabsContent>

      <TabsContent value="trust" className="mt-6">
        <TrustFootprint trustFootprint={mockTrustFootprint} />
      </TabsContent>

      <TabsContent value="journey" className="mt-6">
        <ImpactFootprint 
          activities={mockTrustFootprint.activities} 
          userName={mockTrustFootprint.userName} 
        />
      </TabsContent>
    </Tabs>
  );
};

export default ImpactTab;
