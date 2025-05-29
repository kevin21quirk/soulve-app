
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock } from "lucide-react";

interface SearchResult {
  type: "conversation" | "message";
  id: string;
  name?: string;
  avatar?: string;
  lastMessage?: string;
  timestamp: string;
  isGroup?: boolean;
  conversationId?: string;
  conversationName?: string;
  content?: string;
  sender?: string;
}

interface MobileSearchResultsProps {
  results: SearchResult[];
  onResultClick: (result: SearchResult) => void;
}

const MobileSearchResults = ({ results, onResultClick }: MobileSearchResultsProps) => {
  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-600 mb-4">
        {results.length} result{results.length !== 1 ? 's' : ''} found
      </p>
      
      {results.map((result) => (
        <div
          key={`${result.type}-${result.id}`}
          onClick={() => onResultClick(result)}
          className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
        >
          {result.type === "conversation" ? (
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={result.avatar} alt={result.name} />
                <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                  {result.name?.charAt(0)}
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
  );
};

export default MobileSearchResults;
