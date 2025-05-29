import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CalendarDateRangePicker } from "@/components/ui/calendar";
import { CalendarIcon, ChevronDown, Filter, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { FeedFilters } from "./FeedFilters";
import CampaignStatsWidget from "./CampaignStatsWidget";

const EnhancedSocialFeed = () => {
  const [filters, setFilters] = useState({
    type: "all",
    dateRange: undefined,
    sort: "recent",
  });
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      {/* Filters and Create Post */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <FeedFilters 
            filters={filters}
            onFiltersChange={setFilters}
            onSearch={setSearchQuery}
            searchQuery={searchQuery}
          />
        </div>
        <div className="lg:w-80">
          <CampaignStatsWidget />
        </div>
      </div>

      {/* Social Feed Content (Mock Data) */}
      <Card>
        <CardHeader>
          <CardTitle>Community Feed</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mock Feed Items - Replace with actual data fetching */}
          <div className="space-y-4">
            <div className="border rounded-md p-4">
              <p>
                Exciting news! We're hosting a community cleanup event this
                Saturday. Join us!
              </p>
              <div className="text-sm text-gray-500">Posted by John Doe</div>
            </div>
            <div className="border rounded-md p-4">
              <p>
                Check out our latest blog post on sustainable living tips.
                Let's make a difference together!
              </p>
              <div className="text-sm text-gray-500">Posted by Jane Smith</div>
            </div>
            {/* Add more feed items here */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedSocialFeed;
