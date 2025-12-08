import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter,
  Plus
} from "lucide-react";
import HelpCenterHero from "./help-center/HelpCenterHero";
import HelpRequestModal from "./help-center/HelpRequestModal";
import UrgentAlerts from "./help-center/UrgentAlerts";
import TrendingCauses from "./help-center/TrendingCauses";
import SearchFilters from "./help-center/SearchFilters";
import DiscoverTab from "./help-center/tabs/DiscoverTab";
import MyImpactTab from "./help-center/tabs/MyImpactTab";
import SkillsTab from "./help-center/tabs/SkillsTab";
import { useToast } from "@/hooks/use-toast";
import { useImpactTracking } from "@/hooks/useImpactTracking";

const HelpCenter = () => {
  const [activeTab, setActiveTab] = useState("discover");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedUrgency, setSelectedUrgency] = useState("all");
  const [showHelpRequestModal, setShowHelpRequestModal] = useState(false);
  
  const { toast } = useToast();
  const { trackHelpProvided, trackCommunityEngagement } = useImpactTracking();

  // Handler for help actions from DiscoverTab - now integrated with points system
  const handleHelpAction = async (type: string, target: string) => {
    if (type === 'help') {
      // Track that user is engaging with a help request
      await trackCommunityEngagement('help_engagement', `Engaged with help request: ${target}`);
    } else if (type === 'volunteer') {
      await trackCommunityEngagement('volunteer_interest', `Expressed interest in volunteering: ${target}`);
    } else if (type === 'share') {
      await trackCommunityEngagement('post_share', `Shared cause: ${target}`);
    }
    
    toast({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} action`,
      description: `Initiating ${type} for ${target}`,
    });
  };

  const handleCreateHelpRequest = () => {
    setShowHelpRequestModal(true);
  };

  return (
    <div className="space-y-6">
      <HelpCenterHero onCreateHelpRequest={handleCreateHelpRequest} />
      
      <UrgentAlerts />

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
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
            onClick={handleCreateHelpRequest}
            className="bg-soulve-teal hover:bg-soulve-teal/90 text-white border-none"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Help Request
          </Button>
        </div>
      </div>

      {showFilters && (
        <SearchFilters 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedUrgency={selectedUrgency}
          setSelectedUrgency={setSelectedUrgency}
          onClose={() => setShowFilters(false)} 
        />
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="my-impact">My Impact</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="mt-6" forceMount>
          <div className={activeTab === "discover" ? "" : "hidden"}>
            <DiscoverTab handleHelpAction={handleHelpAction} />
          </div>
        </TabsContent>

        <TabsContent value="my-impact" className="mt-6" forceMount>
          <div className={activeTab === "my-impact" ? "" : "hidden"}>
            <MyImpactTab />
          </div>
        </TabsContent>

        <TabsContent value="skills" className="mt-6" forceMount>
          <div className={activeTab === "skills" ? "" : "hidden"}>
            <SkillsTab />
          </div>
        </TabsContent>
      </Tabs>

      <TrendingCauses />

      {/* Help Request Modal */}
      <HelpRequestModal
        isOpen={showHelpRequestModal}
        onClose={() => setShowHelpRequestModal(false)}
      />
    </div>
  );
};

export default HelpCenter;
