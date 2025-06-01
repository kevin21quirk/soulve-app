
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useState } from "react";
import { Conversation } from "@/hooks/messaging/types";

interface ConversationsListProps {
  conversations: Conversation[];
  activeConversation: string | null;
  loading: boolean;
  onConversationSelect: (partnerId: string) => void;
}

const ConversationsList = ({
  conversations,
  activeConversation,
  loading,
  onConversationSelect
}: ConversationsListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredConversations = conversations.filter(conv => {
    const partnerName = conv.partner_profile 
      ? `${conv.partner_profile.first_name || ''} ${conv.partner_profile.last_name || ''}`.trim()
      : conv.user_name || 'Anonymous';
    return partnerName.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <Card className="w-full lg:w-96">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full lg:w-96">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Messages</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[480px]">
          {filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No conversations yet.</p>
              <p className="text-sm mt-1">Start connecting with people to begin messaging!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {filteredConversations.map((conversation) => {
                const partnerName = conversation.partner_profile 
                  ? `${conversation.partner_profile.first_name || ''} ${conversation.partner_profile.last_name || ''}`.trim() || 'Anonymous'
                  : conversation.user_name || 'Anonymous';

                const lastMessage = conversation.last_message?.content || 'No messages yet';
                const lastMessageTime = conversation.last_message?.created_at || conversation.last_message_time;

                return (
                  <div
                    key={conversation.id}
                    onClick={() => onConversationSelect(conversation.partner_id)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer border-l-4 transition-colors ${
                      activeConversation === conversation.partner_id
                        ? "bg-blue-50 border-l-blue-500"
                        : "border-l-transparent"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={conversation.partner_profile?.avatar_url || conversation.avatar_url || ''} alt={partnerName} />
                          <AvatarFallback>
                            {partnerName.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.is_read === false && (
                          <div className="absolute -top-1 -right-1 h-3 w-3 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 truncate">{partnerName}</h4>
                          <span className="text-xs text-gray-500">
                            {lastMessageTime && format(new Date(lastMessageTime), 'MMM d')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {lastMessage}
                        </p>
                        {conversation.unread_count > 0 && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {conversation.unread_count} new
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ConversationsList;
