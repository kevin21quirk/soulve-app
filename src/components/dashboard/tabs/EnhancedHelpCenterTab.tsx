
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  HelpCircle,
  Shield,
  Heart,
  Users,
  Search,
  BookOpen
} from "lucide-react";
import HelpCenter from "../HelpCenter";
import SafeSpaceTab from "../../safe-space/SafeSpaceTab";

const EnhancedHelpCenterTab = () => {
  const [activeTab, setActiveTab] = useState("community-help");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <HelpCircle className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get the help you need or help others in your community. From peer support to anonymous assistance.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100">
          <TabsTrigger 
            value="community-help"
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <Users className="h-4 w-4" />
            <span>Community Help</span>
          </TabsTrigger>
          <TabsTrigger 
            value="safe-space"
            className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white hover:bg-gradient-to-r hover:from-[#0ce4af] hover:to-[#18a5fe] hover:text-white transition-all duration-200"
          >
            <Shield className="h-4 w-4" />
            <span>Safe Space</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="community-help" className="mt-6">
          <HelpCenter />
        </TabsContent>

        <TabsContent value="safe-space" className="mt-6">
          <SafeSpaceTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedHelpCenterTab;
