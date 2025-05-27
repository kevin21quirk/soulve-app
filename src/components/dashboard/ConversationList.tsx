
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MessageSquare, Pin, Archive, VolumeOff, MoreVertical, Users } from "lucide-react";
import { Conversation, ConversationFilters } from "@/types/messaging";
import ConversationFiltersComponent from "./messaging/ConversationFilters";

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string;
  onSelectConversation: (id: string) => void;
  filters: ConversationFilters;
  onFiltersChange: (filters: ConversationFilters) => void;
  onTogglePin?: (conversationId: string) => void;
  onToggleMute?: (conversationId: string) => void;
  onArchiveConversation?: (conversationId: string) => void;
}

const ConversationList = ({ 
  conversations, 
  selectedConversation, 
  onSelectConversation,
  filters,
  onFiltersChange,
  onTogglePin,
  onToggleMute,
  onArchiveConversation
}: ConversationListProps) => {
  const unreadCount = conversations.filter(c => c.unread > 0).length;
  const totalCount = conversations.length;

  // Sort conversations: pinned first, then by timestamp
  const sortedConversations = [...conversations].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5" />
          <span>Messages</span>
        </CardTitle>
        <CardDescription>Your conversations with community members</CardDescription>
      </CardHeader>
      
      <ConversationFiltersComponent
        filters={filters}
        onFiltersChange={onFiltersChange}
        totalCount={totalCount}
        unreadCount={unreadCount}
      />

      <CardContent className="p-0">
        <div className="space-y-1">
          {sortedConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors relative ${
                selectedConversation === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="relative">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar} />
                    <AvatarFallback>
                      {conversation.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {conversation.isActive && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                  {conversation.type === "group" && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <Users className="h-2 w-2 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conversation.name}
                      </p>
                      {conversation.isPinned && (
                        <Pin className="h-3 w-3 text-gray-500" />
                      )}
                      {conversation.isMuted && (
                        <VolumeOff className="h-3 w-3 text-gray-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {conversation.unread > 0 && (
                        <Badge className="bg-red-500 text-white text-xs">
                          {conversation.unread}
                        </Badge>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-3 w-3" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onTogglePin?.(conversation.id)}>
                            {conversation.isPinned ? "Unpin" : "Pin"} conversation
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onToggleMute?.(conversation.id)}>
                            {conversation.isMuted ? "Unmute" : "Mute"} conversation
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onArchiveConversation?.(conversation.id)}>
                            {conversation.isArchived ? "Unarchive" : "Archive"} conversation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.isTyping ? (
                      <span className="text-blue-600 italic">typing...</span>
                    ) : (
                      conversation.lastMessage
                    )}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {conversation.timestamp}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ConversationList;
