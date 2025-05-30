
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Target, Calendar, MapPin, Filter } from "lucide-react";
import EnhancedDiscoverCard from "./EnhancedDiscoverCard";
import { mockConnections, mockGroups, mockCampaigns } from "@/data/mockConnections";

interface EnhancedDiscoverGridProps {
  searchQuery?: string;
  activeFilters?: string[];
  onConnect: (personId: string) => void;
  onJoinGroup: (groupId: string) => void;
  onJoinCampaign: (campaignId: string) => void;
  onViewProfile: (userId: string) => void;
}

const EnhancedDiscoverGrid = ({ 
  searchQuery = "",
  activeFilters = [],
  onConnect,
  onJoinGroup,
  onJoinCampaign,
  onViewProfile
}: EnhancedDiscoverGridProps) => {
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");

  // Mock events data
  const mockEvents = [
    {
      id: "e1",
      title: "Community Cleanup Day",
      description: "Join us for a neighborhood cleanup event",
      date: "This Saturday",
      location: "Downtown Park",
      attendees: 25,
      category: "volunteering"
    },
    {
      id: "e2",
      title: "Senior Tech Workshop",
      description: "Teaching seniors how to use smartphones",
      date: "Next Monday",
      location: "Community Center",
      attendees: 12,
      category: "education"
    }
  ];

  const filterData = (data: any[], type: string) => {
    let filtered = data;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(item => {
        const searchableText = type === "person" 
          ? `${item.name} ${item.location} ${item.skills?.join(" ") || ""}`
          : type === "group"
          ? `${item.name} ${item.description} ${item.category}`
          : type === "campaign"
          ? `${item.title} ${item.description} ${item.category}`
          : `${item.title} ${item.description} ${item.category}`;
        
        return searchableText.toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // Apply active filters
    if (activeFilters.includes("nearby")) {
      filtered = filtered.filter(item => 
        item.location?.toLowerCase().includes("downtown") || 
        item.location?.toLowerCase().includes("area")
      );
    }

    if (activeFilters.includes("urgent") && type === "campaign") {
      filtered = filtered.filter(item => item.urgency === "high");
    }

    if (activeFilters.includes("popular")) {
      filtered = filtered.sort((a, b) => {
        const aCount = a.memberCount || a.participantCount || a.attendees || 0;
        const bCount = b.memberCount || b.participantCount || b.attendees || 0;
        return bCount - aCount;
      });
    }

    return filtered;
  };

  const handleAction = (id: string, actionType: string) => {
    switch (actionType) {
      case "connect":
        onConnect(id);
        break;
      case "join":
        if (activeTab === "groups") {
          onJoinGroup(id);
        } else if (activeTab === "campaigns") {
          onJoinCampaign(id);
        }
        break;
      default:
        break;
    }
  };

  const getTabData = (tab: string) => {
    switch (tab) {
      case "people":
        return { data: filterData(mockConnections, "person"), type: "person" };
      case "groups":
        return { data: filterData(mockGroups, "group"), type: "group" };
      case "campaigns":
        return { data: filterData(mockCampaigns, "campaign"), type: "campaign" };
      case "events":
        return { data: filterData(mockEvents, "event"), type: "event" };
      default:
        // "all" tab - mix of all types
        return {
          data: [
            ...filterData(mockConnections.slice(0, 2), "person").map(item => ({ ...item, type: "person" })),
            ...filterData(mockGroups.slice(0, 2), "group").map(item => ({ ...item, type: "group" })),
            ...filterData(mockCampaigns.slice(0, 2), "campaign").map(item => ({ ...item, type: "campaign" }))
          ],
          type: "mixed"
        };
    }
  };

  const tabData = getTabData(activeTab);

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "people": return Users;
      case "groups": return Users;
      case "campaigns": return Target;
      case "events": return Calendar;
      default: return Filter;
    }
  };

  const getTabCounts = () => ({
    all: mockConnections.length + mockGroups.length + mockCampaigns.length,
    people: filterData(mockConnections, "person").length,
    groups: filterData(mockGroups, "group").length,
    campaigns: filterData(mockCampaigns, "campaign").length,
    events: filterData(mockEvents, "event").length,
  });

  const counts = getTabCounts();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Discover</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-1" />
              Sort
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-4">
            <TabsTrigger value="all" className="text-xs">
              All
              <Badge variant="secondary" className="ml-1 text-xs">
                {counts.all}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="people" className="text-xs">
              People
              <Badge variant="secondary" className="ml-1 text-xs">
                {counts.people}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="groups" className="text-xs">
              Groups
              <Badge variant="secondary" className="ml-1 text-xs">
                {counts.groups}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="text-xs">
              Causes
              <Badge variant="secondary" className="ml-1 text-xs">
                {counts.campaigns}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="events" className="text-xs">
              Events
              <Badge variant="secondary" className="ml-1 text-xs">
                {counts.events}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            <div className="space-y-3">
              {tabData.data.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No results found</p>
                  <p className="text-sm text-gray-400">Try adjusting your search or filters</p>
                </div>
              ) : (
                tabData.data.map((item: any) => (
                  <EnhancedDiscoverCard
                    key={item.id}
                    type={tabData.type === "mixed" ? item.type : tabData.type as any}
                    data={item}
                    onAction={handleAction}
                    onViewProfile={onViewProfile}
                  />
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default EnhancedDiscoverGrid;
