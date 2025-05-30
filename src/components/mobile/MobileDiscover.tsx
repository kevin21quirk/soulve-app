
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DiscoverHeader from "./discover/DiscoverHeader";
import MobileDiscoverDashboard from "./discover/MobileDiscoverDashboard";

const MobileDiscover = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const { toast } = useToast();

  return (
    <div className="bg-gray-50 min-h-screen">
      <DiscoverHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      <div className="p-4">
        <MobileDiscoverDashboard />
      </div>
    </div>
  );
};

export default MobileDiscover;
