
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Rss, 
  Users, 
  MessageCircle, 
  HelpCircle, 
  Target,
  BarChart3, 
  User 
} from "lucide-react";

const MainTabsList = () => {
  return (
    <TabsList className="grid w-full grid-cols-7 bg-white border border-gray-200 p-3 gap-3 rounded-lg h-auto">
      <TabsTrigger 
        value="feed" 
        className="flex items-center gap-2 bg-transparent border-none rounded-md px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white text-gray-600 hover:bg-gray-50 transition-all"
      >
        <Rss className="h-4 w-4" />
        <span className="hidden sm:inline">Feed</span>
      </TabsTrigger>
      <TabsTrigger 
        value="discover-connect" 
        className="flex items-center gap-2 bg-transparent border-none rounded-md px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white text-gray-600 hover:bg-gray-50 transition-all"
      >
        <Users className="h-4 w-4" />
        <span className="hidden sm:inline">Discover & Connect</span>
      </TabsTrigger>
      <TabsTrigger 
        value="messaging" 
        className="flex items-center gap-2 bg-transparent border-none rounded-md px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white text-gray-600 hover:bg-gray-50 transition-all"
      >
        <MessageCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Messages</span>
      </TabsTrigger>
      <TabsTrigger 
        value="help-center" 
        className="flex items-center gap-2 bg-transparent border-none rounded-md px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white text-gray-600 hover:bg-gray-50 transition-all"
      >
        <HelpCircle className="h-4 w-4" />
        <span className="hidden sm:inline">Help Center</span>
      </TabsTrigger>
      <TabsTrigger 
        value="campaigns" 
        className="flex items-center gap-2 bg-transparent border-none rounded-md px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white text-gray-600 hover:bg-gray-50 transition-all"
      >
        <Target className="h-4 w-4" />
        <span className="hidden sm:inline">Campaigns</span>
      </TabsTrigger>
      <TabsTrigger 
        value="analytics-points" 
        className="flex items-center gap-2 bg-transparent border-none rounded-md px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white text-gray-600 hover:bg-gray-50 transition-all"
      >
        <BarChart3 className="h-4 w-4" />
        <span className="hidden sm:inline">Analytics & Points</span>
      </TabsTrigger>
      <TabsTrigger 
        value="profile" 
        className="flex items-center gap-2 bg-transparent border-none rounded-md px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#0ce4af] data-[state=active]:to-[#18a5fe] data-[state=active]:text-white text-gray-600 hover:bg-gray-50 transition-all"
      >
        <User className="h-4 w-4" />
        <span className="hidden sm:inline">Profile</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default MainTabsList;
