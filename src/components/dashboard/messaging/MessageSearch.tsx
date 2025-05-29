
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Filter, Clock, User, Hash } from "lucide-react";
import { MessageSearchResult } from "@/types/messaging";

interface MessageSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchResults: MessageSearchResult[];
  onResultClick: (result: MessageSearchResult) => void;
  isOpen: boolean;
  onClose: () => void;
}

const MessageSearch = ({
  searchQuery,
  onSearchChange,
  searchResults,
  onResultClick,
  isOpen,
  onClose
}: MessageSearchProps) => {
  const [searchFilters, setSearchFilters] = useState({
    type: "all" as "all" | "text" | "image" | "file",
    sender: "",
    dateRange: "all" as "all" | "today" | "week" | "month"
  });

  if (!isOpen) return null;

  const filteredResults = searchResults.filter(result => {
    if (searchFilters.type !== "all" && result.message.type !== searchFilters.type) {
      return false;
    }
    if (searchFilters.sender && !result.message.sender.toLowerCase().includes(searchFilters.sender.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
      <Card className="w-full max-w-2xl mx-4 max-h-[70vh] overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Search Messages</h3>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>

          {/* Search filters */}
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={searchFilters.type}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, type: e.target.value as any }))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">All types</option>
                <option value="text">Text</option>
                <option value="image">Images</option>
                <option value="file">Files</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <select
                value={searchFilters.dateRange}
                onChange={(e) => setSearchFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="all">All time</option>
                <option value="today">Today</option>
                <option value="week">This week</option>
                <option value="month">This month</option>
              </select>
            </div>

            <Input
              placeholder="Filter by sender..."
              value={searchFilters.sender}
              onChange={(e) => setSearchFilters(prev => ({ ...prev, sender: e.target.value }))}
              className="text-sm h-8 w-40"
            />
          </div>
        </div>

        <CardContent className="p-0 overflow-y-auto max-h-96">
          {searchQuery.trim() === "" ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Start typing to search messages</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No messages found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredResults.map((result, index) => (
                <div
                  key={index}
                  onClick={() => onResultClick(result)}
                  className="p-4 hover:bg-gray-50 cursor-pointer border-b transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-sm">{result.message.sender}</span>
                      <span className="text-xs text-gray-500">in {result.conversation.name}</span>
                    </div>
                    <span className="text-xs text-gray-500">{result.message.timestamp}</span>
                  </div>
                  
                  <div className="text-sm text-gray-700 mb-2">
                    {result.highlights.map((highlight, hIndex) => (
                      <span key={hIndex} className="bg-yellow-200 px-1 rounded">
                        {highlight}
                      </span>
                    ))}
                    {result.message.content.replace(new RegExp(result.highlights.join('|'), 'gi'), '')}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {result.message.type !== "text" && (
                      <Badge variant="secondary" className="text-xs">
                        {result.message.type}
                      </Badge>
                    )}
                    {result.message.reactions && result.message.reactions.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {result.message.reactions.length} reactions
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MessageSearch;
