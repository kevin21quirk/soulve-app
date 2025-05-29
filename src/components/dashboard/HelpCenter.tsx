import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Clock, 
  Users, 
  Heart, 
  TrendingUp, 
  Filter,
  Plus,
  AlertCircle,
  Target,
  BookOpen,
  Award
} from "lucide-react";
import HelpCenterHero from "./help-center/HelpCenterHero";
import UrgentAlerts from "./help-center/UrgentAlerts";
import TrendingCauses from "./help-center/TrendingCauses";
import SearchFilters from "./help-center/SearchFilters";
import DiscoverTab from "./help-center/tabs/DiscoverTab";
import MyImpactTab from "./help-center/tabs/MyImpactTab";
import SkillsTab from "./help-center/tabs/SkillsTab";
import AutoFeedPublisher from "./help-center/AutoFeedPublisher";
import { HelpCenterPost } from "@/services/feedIntegrationService";
import { useAutoFeedIntegration } from "@/hooks/useAutoFeedIntegration";
import { useToast } from "@/hooks/use-toast";

const HelpCenter = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [pendingFeedPost, setPendingFeedPost] = useState<HelpCenterPost | undefined>();
  
  const { publishHelpCenterToFeed } = useAutoFeedIntegration();
  const { toast } = useToast();

  // Mock function to simulate help center post creation
  const handleCreateHelpPost = (title: string, description: string, category: 'help-needed' | 'help-offered') => {
    const helpPost: HelpCenterPost = {
      id: Date.now().toString(),
      title,
      description,
      author: "You",
      category,
      location: "Your Area",
      urgency: 'medium',
      tags: ['help-center', category]
    };

    // Auto-publish to feed
    publishHelpCenterToFeed(helpPost);
    
    toast({
      title: "Help request posted!",
      description: "Your request has been posted in the Help Center and shared with the community feed.",
    });
  };

  return (
    <div className="space-y-6">
      <HelpCenterHero />
      
      <UrgentAlerts />

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search help requests, skills, locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filters
          </Button>
          
          <Button 
            onClick={() => handleCreateHelpPost(
              "Quick Help Request", 
              "I need assistance with something in my area", 
              "help-needed"
            )}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post Help Request
          </Button>
        </div>
      </div>

      {showFilters && <SearchFilters onClose={() => setShowFilters(false)} />}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="my-impact">My Impact</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="mt-6">
          <DiscoverTab searchQuery={searchQuery} />
        </TabsContent>

        <TabsContent value="my-impact" className="mt-6">
          <MyImpactTab />
        </TabsContent>

        <TabsContent value="skills" className="mt-6">
          <SkillsTab />
        </TabsContent>
      </Tabs>

      <TrendingCauses />

      {/* Auto Feed Publisher Component */}
      <AutoFeedPublisher 
        helpPost={pendingFeedPost}
        onPublished={() => setPendingFeedPost(undefined)}
      />
    </div>
  );
};

export default HelpCenter;
