
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DiscoverSearchBar from "./DiscoverSearchBar";
import QuickConnectActions from "./QuickConnectActions";
import EnhancedDiscoverGrid from "./EnhancedDiscoverGrid";

const MobileDiscoverDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSearch = (query: string, filters: string[]) => {
    setSearchQuery(query);
    setActiveFilters(filters);
  };

  const handleClearFilters = () => {
    setSearchQuery("");
    setActiveFilters([]);
  };

  const handleConnect = (personId: string) => {
    toast({
      title: "Connection request sent!",
      description: "Your request has been sent successfully",
    });
  };

  const handleJoinGroup = (groupId: string) => {
    toast({
      title: "Joined group!",
      description: "You're now a member of this group",
    });
  };

  const handleJoinCampaign = (campaignId: string) => {
    toast({
      title: "Joined campaign!",
      description: "You're now participating in this campaign",
    });
  };

  const handleViewProfile = (userId: string) => {
    toast({
      title: "Profile viewed",
      description: "Opening profile details",
    });
  };

  const handleQuickAction = (actionType: string, data?: any) => {
    switch (actionType) {
      case "find-helpers":
        setActiveFilters(["nearby"]);
        toast({
          title: "Finding helpers nearby",
          description: "Showing people who can help in your area",
        });
        break;
      case "join-groups":
        setActiveFilters(["popular"]);
        toast({
          title: "Showing popular groups",
          description: "These groups are active in your community",
        });
        break;
      case "support-campaigns":
        setActiveFilters(["urgent"]);
        toast({
          title: "Showing urgent campaigns",
          description: "These causes need immediate support",
        });
        break;
      case "nearby-events":
        toast({
          title: "Finding nearby events",
          description: "Showing events in your area",
        });
        break;
      case "search-topic":
        setSearchQuery(data);
        toast({
          title: "Searching trending topic",
          description: `Showing results for ${data}`,
        });
        break;
      case "ai-suggestions":
        toast({
          title: "AI suggestions coming soon!",
          description: "Personalized conversation starters will be available soon",
        });
        break;
      case "nearby-connections":
        setActiveFilters(["nearby"]);
        toast({
          title: "Finding people nearby",
          description: "Showing neighbors you can connect with",
        });
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-4">
      <DiscoverSearchBar 
        onSearch={handleSearch}
        onClearFilters={handleClearFilters}
      />
      
      <QuickConnectActions onAction={handleQuickAction} />
      
      <EnhancedDiscoverGrid
        searchQuery={searchQuery}
        activeFilters={activeFilters}
        onConnect={handleConnect}
        onJoinGroup={handleJoinGroup}
        onJoinCampaign={handleJoinCampaign}
        onViewProfile={handleViewProfile}
      />
    </div>
  );
};

export default MobileDiscoverDashboard;
