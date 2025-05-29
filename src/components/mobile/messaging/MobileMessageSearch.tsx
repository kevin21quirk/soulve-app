
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Search, Filter, Clock, Users, MessageCircle } from "lucide-react";
import { useMessaging } from "@/hooks/useMessaging";

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

  const filters = [
    { id: "all", label: "All", icon: Search },
    { id: "people", label: "People", icon: Users },
    { id: "groups", label: "Groups", icon: Users },
    { id: "messages", label: "Messages", icon: MessageCircle }
  ];

  // Mock search results - in real app this would come from API
  const searchResults = [
    {
      type: "conversation",
      id: "1",
      name: "Sarah Chen",
      avatar: "/placeholder.svg",
      lastMessage: "Thanks for helping with the move!",
      timestamp: "2h ago",
      isGroup: false
    },
    {
      type: "conversation", 
      id: "2",
      name: "Community Garden Group",
      avatar: "/placeholder.svg",
      lastMessage: "The planting event was amazing!",
      timestamp: "1d ago",
      isGroup: true
    },
    {
      type: "message",
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
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
        <div className="flex items-center space-x-3 mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="p-0 hover:bg-transparent"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search conversations and messages..."
              className="pl-10 rounded-full border-gray-300 focus:border-[#18a5fe] focus:ring-[#18a5fe]"
              autoFocus
            />
          </div>
        </div>
        
        {/* Filter tabs */}
        <div className="flex space-x-2 overflow-x-auto">
          {filters.map((filter) => {
            const IconComponent = filter.icon;
            return (
              <Button
                key={filter.id}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-1 whitespace-nowrap ${
                  activeFilter === filter.id 
                    ? 'bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white' 
                    : ''
                }`}
              >
                <IconComponent className="h-3 w-3" />
                <span>{filter.label}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Search Results */}
      <div className="p-4">
        {!searchQuery ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Search className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium mb-2">Search Messages</p>
            <p className="text-sm text-center px-8">
              Find conversations, people, and messages
            </p>
          </div>
        ) : filteredResults.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Search className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium mb-2">No results found</p>
            <p className="text-sm text-center px-8">
              Try different keywords or check spelling
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-4">
              {filteredResults.length} result{filteredResults.length !== 1 ? 's' : ''} found
            </p>
            
            {filteredResults.map((result) => (
              <div
                key={`${result.type}-${result.id}`}
                onClick={() => handleResultClick(result)}
                className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {result.type === "conversation" ? (
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={result.avatar} alt={result.name} />
                      <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                        {result.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-medium text-gray-900 truncate">
                          {result.name}
                        </h3>
                        {result.isGroup && (
                          <Badge variant="secondary" className="text-xs">Group</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{result.lastMessage}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{result.timestamp}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        Message in {result.conversationName}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{result.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{result.content}</p>
                    <p className="text-xs text-gray-500">From: {result.sender}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMessageSearch;
