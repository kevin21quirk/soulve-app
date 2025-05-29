
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
        className="flex items-center gap-2 bg-transparent border-none rounded-md px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-transparent bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text hover:bg-gray-50 data-[state=active]:hover:bg-gradient-to-r data-[state=active]:hover:from-teal-500 data-[state=active]:hover:to-blue-500"
      >
        <Rss className="h-4 w-4 text-transparent bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text [&>*]:fill-current data-[state=active]:text-white" />
        <span className="hidden sm:inline bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent data-[state=active]:text-white">Feed</span>
      </TabsTrigger>
      <TabsTrigger 
        value="discover-connect" 
        className="flex items-center gap-2 bg-transparent border-none rounded-md px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-transparent bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text hover:bg-gray-50 data-[state=active]:hover:bg-gradient-to-r data-[state=active]:hover:from-teal-500 data-[state=active]:hover:to-blue-500"
      >
        <Users className="h-4 w-4 text-transparent bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text [&>*]:fill-current data-[state=active]:text-white" />
        <span className="hidden sm:inline bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent data-[state=active]:text-white">Discover & Connect</span>
      </TabsTrigger>
      <TabsTrigger 
        value="messaging" 
        className="flex items-center gap-2 bg-transparent border-none rounded-md px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-transparent bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text hover:bg-gray-50 data-[state=active]:hover:bg-gradient-to-r data-[state=active]:hover:from-teal-500 data-[state=active]:hover:to-blue-500"
      >
        <MessageCircle className="h-4 w-4 text-transparent bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text [&>*]:fill-current data-[state=active]:text-white" />
        <span className="hidden sm:inline bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent data-[state=active]:text-white">Messages</span>
      </TabsTrigger>
      <TabsTrigger 
        value="help-center" 
        className="flex items-center gap-2 bg-transparent border-none rounded-md px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-transparent bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text hover:bg-gray-50 data-[state=active]:hover:bg-gradient-to-r data-[state=active]:hover:from-teal-500 data-[state=active]:hover:to-blue-500"
      >
        <HelpCircle className="h-4 w-4 text-transparent bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text [&>*]:fill-current data-[state=active]:text-white" />
        <span className="hidden sm:inline bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent data-[state=active]:text-white">Help Center</span>
      </TabsTrigger>
      <TabsTrigger 
        value="campaigns" 
        className="flex items-center gap-2 bg-transparent border-none rounded-md px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-transparent bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text hover:bg-gray-50 data-[state=active]:hover:bg-gradient-to-r data-[state=active]:hover:from-teal-500 data-[state=active]:hover:to-blue-500"
      >
        <Target className="h-4 w-4 text-transparent bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text [&>*]:fill-current data-[state=active]:text-white" />
        <span className="hidden sm:inline bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent data-[state=active]:text-white">Campaigns</span>
      </TabsTrigger>
      <TabsTrigger 
        value="analytics-points" 
        className="flex items-center gap-2 bg-transparent border-none rounded-md px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-transparent bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text hover:bg-gray-50 data-[state=active]:hover:bg-gradient-to-r data-[state=active]:hover:from-teal-500 data-[state=active]:hover:to-blue-500"
      >
        <BarChart3 className="h-4 w-4 text-transparent bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text [&>*]:fill-current data-[state=active]:text-white" />
        <span className="hidden sm:inline bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent data-[state=active]:text-white">Analytics & Points</span>
      </TabsTrigger>
      <TabsTrigger 
        value="profile" 
        className="flex items-center gap-2 bg-transparent border-none rounded-md px-4 py-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-transparent bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text hover:bg-gray-50 data-[state=active]:hover:bg-gradient-to-r data-[state=active]:hover:from-teal-500 data-[state=active]:hover:to-blue-500"
      >
        <User className="h-4 w-4 text-transparent bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text [&>*]:fill-current data-[state=active]:text-white" />
        <span className="hidden sm:inline bg-gradient-to-r from-teal-500 to-blue-500 bg-clip-text text-transparent data-[state=active]:text-white">Profile</span>
      </TabsTrigger>
    </TabsList>
  );
};

export default MainTabsList;
