
import { useState } from "react";
import { useMessaging } from "@/hooks/useMessaging";
import MobileSearchHeader from "./MobileSearchHeader";
import MobileSearchFilters from "./MobileSearchFilters";
import MobileSearchResults from "./MobileSearchResults";
import MobileSearchEmptyState from "./MobileSearchEmptyState";

interface MobileMessageSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onBack: () => void;
  onSelectConversation: (conversationId: string) => void;
}

const MobileMessageSearch = ({ 
  searchQuery, 
  onSearchChange, 
  onBack,
  onSelectConversation 
}: MobileMessageSearchProps) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const { conversations, messages } = useMessaging();

  // Mock search results - in real app this would come from API
  const searchResults = [
    {
      type: "conversation" as const,
      id: "1",
      name: "Sarah Chen",
      avatar: "/placeholder.svg",
      lastMessage: "Thanks for helping with the move!",
      timestamp: "2h ago",
      isGroup: false
    },
    {
      type: "conversation" as const, 
      id: "2",
      name: "Community Garden Group",
      avatar: "/placeholder.svg",
      lastMessage: "The planting event was amazing!",
      timestamp: "1d ago",
      isGroup: true
    },
    {
      type: "message" as const,
      id: "msg1",
      conversationId: "1",
      conversationName: "Sarah Chen",
      content: "Can you help me move this Saturday?",
      timestamp: "3h ago",
      sender: "Sarah Chen"
    }
  ];

  const filteredResults = searchResults.filter(result => {
    if (!searchQuery) return false;
    
    const matchesQuery = result.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        result.content?.toLowerCase().includes(searchQuery.toLowerCase());
    
    switch (activeFilter) {
      case "people":
        return result.type === "conversation" && !result.isGroup && matchesQuery;
      case "groups":
        return result.type === "conversation" && result.isGroup && matchesQuery;
      case "messages":
        return result.type === "message" && matchesQuery;
      default:
        return matchesQuery;
    }
  });

  const handleResultClick = (result: any) => {
    if (result.type === "conversation") {
      onSelectConversation(result.id);
    } else if (result.type === "message") {
      onSelectConversation(result.conversationId);
    }
  };

  return (
    <div className="bg-white min-h-screen">
      <MobileSearchHeader
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        onBack={onBack}
      />
      
      <MobileSearchFilters
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <div className="p-4">
        {filteredResults.length === 0 ? (
          <MobileSearchEmptyState searchQuery={searchQuery} />
        ) : (
          <MobileSearchResults
            results={filteredResults}
            onResultClick={handleResultClick}
          />
        )}
      </div>
    </div>
  );
};

export default MobileMessageSearch;
