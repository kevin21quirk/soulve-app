
import { useState } from "react";
import DiscoverHeader from "./DiscoverHeader";
import DiscoverCategories from "./DiscoverCategories";
import DiscoverFeed from "./DiscoverFeed";
import { useAuth } from "@/contexts/AuthContext";

const DiscoverContainer = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>();

  // Mock user location - in real app this would come from user profile
  const userLocation = "Downtown District";

  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? undefined : categoryId);
  };

  return (
    <div className="space-y-8">
      <DiscoverHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilters={activeFilters}
        onFilterToggle={handleFilterToggle}
        location={userLocation}
      />
      
      <DiscoverCategories
        onCategorySelect={handleCategorySelect}
        selectedCategory={selectedCategory}
      />
      
      <DiscoverFeed
        searchQuery={searchQuery}
        activeFilters={activeFilters}
        selectedCategory={selectedCategory}
      />
    </div>
  );
};

export default DiscoverContainer;
