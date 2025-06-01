
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Users, UserPlus, Globe, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { RealConnections } from '../RealConnections';
import DiscoverPeople from '../discover/DiscoverPeople';
import DiscoverGroups from '../discover/DiscoverGroups';
import DiscoverCampaigns from '../discover/DiscoverCampaigns';
import NetworkInsights from '../discover/NetworkInsights';

const RealDiscoverConnectTab = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const filters = [
    { id: "all", label: "All", icon: Globe },
    { id: "people", label: "People", icon: Users },
    { id: "groups", label: "Groups", icon: Users },
    { id: "campaigns", label: "Campaigns", icon: TrendingUp },
    { id: "nearby", label: "Nearby", icon: UserPlus }
  ];

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Discover & Connect</h1>
          <p className="text-gray-600 mt-2">Build meaningful connections within your community</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search people, groups, campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {filters.map((filter) => {
              const IconComponent = filter.icon;
              return (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "gradient" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter.id)}
                  className="flex items-center space-x-1 whitespace-nowrap"
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{filter.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      <Tabs defaultValue="discover" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="discover">Discover</TabsTrigger>
          <TabsTrigger value="connections">My Network</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="discover" className="space-y-6">
          {(activeFilter === "all" || activeFilter === "people") && (
            <DiscoverPeople searchQuery={searchQuery} />
          )}
          
          {(activeFilter === "all" || activeFilter === "groups") && (
            <DiscoverGroups searchQuery={searchQuery} />
          )}
          
          {(activeFilter === "all" || activeFilter === "campaigns") && (
            <DiscoverCampaigns searchQuery={searchQuery} />
          )}
        </TabsContent>

        <TabsContent value="connections" className="space-y-6">
          <RealConnections />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <NetworkInsights />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RealDiscoverConnectTab;
