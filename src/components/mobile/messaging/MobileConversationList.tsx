
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Archive, Pin } from "lucide-react";
import { useMessaging } from "@/hooks/useMessaging";

interface MobileConversationListProps {
  onSelectConversation: (conversationId: string) => void;
}

const MobileConversationList = ({ onSelectConversation }: MobileConversationListProps) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const { conversations } = useMessaging();

  const filters = [
    { id: "all", label: "All", icon: MessageCircle },
    { id: "unread", label: "Unread", icon: MessageCircle },
    { id: "groups", label: "Groups", icon: Users },
    { id: "archived", label: "Archived", icon: Archive },
    { id: "pinned", label: "Pinned", icon: Pin }
  ];

  const filteredConversations = conversations.filter(conv => {
    switch (activeFilter) {
      case "unread":
        return conv.unread > 0;
      case "groups":
        return conv.type === "group";
      case "archived":
        return conv.isArchived;
      case "pinned":
        return conv.isPinned;
      default:
        return !conv.isArchived;
    }
  });

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Filter tabs */}
      <div className="px-4 py-2 bg-gray-50 border-b">
        <div className="flex space-x-2 overflow-x-auto pb-2">
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

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <MessageCircle className="h-12 w-12 mb-4" />
            <p className="text-lg font-medium mb-2">No conversations</p>
            <p className="text-sm text-center px-8">
              {activeFilter === "all" 
                ? "Start connecting with people to begin messaging"
                : `No ${activeFilter} conversations found`
              }
            </p>
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <Card
                key={conversation.id}
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors border-none shadow-none"
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={conversation.avatar} alt={conversation.name} />
                      <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
                        {conversation.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {conversation.isActive && conversation.type === "direct" && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                    {conversation.isPinned && (
                      <div className="absolute -top-1 -right-1">
                        <Pin className="h-3 w-3 text-yellow-500" />
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm font-medium truncate ${
                        conversation.unread > 0 ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {conversation.name}
                        {conversation.type === "group" && (
                          <Users className="h-3 w-3 inline ml-1 text-gray-400" />
                        )}
                      </h3>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(conversation.timestamp)}
                        </span>
                        {conversation.unread > 0 && (
                          <Badge className="bg-[#18a5fe] text-white text-xs h-5 w-5 rounded-full flex items-center justify-center p-0">
                            {conversation.unread > 99 ? '99+' : conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className={`text-sm truncate ${
                        conversation.unread > 0 ? 'text-gray-900 font-medium' : 'text-gray-600'
                      }`}>
                        {conversation.isTyping ? (
                          <span className="text-[#18a5fe] font-medium">Typing...</span>
                        ) : (
                          conversation.lastMessage
                        )}
                      </p>
                      {conversation.isMuted && (
                        <div className="text-gray-400 ml-2">
                          🔇
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileConversationList;
