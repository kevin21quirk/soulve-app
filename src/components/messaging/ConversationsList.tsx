
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle } from 'lucide-react';
import { Conversation } from '@/hooks/messaging/types';

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
  return (
    <div className="w-full md:w-1/3 border-r bg-gray-50">
      <div className="p-4 border-b bg-white">
        <h3 className="font-semibold flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Messages
        </h3>
      </div>
      
      <ScrollArea className="h-[calc(600px-73px)]">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            No conversations yet. Start connecting with people!
          </div>
        ) : (
          <div className="p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.user_id}
                onClick={() => onConversationSelect(conversation.user_id)}
                className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                  activeConversation === conversation.user_id
                    ? 'bg-blue-100 border-blue-200'
                    : 'hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={conversation.avatar_url} alt={conversation.user_name} />
                    <AvatarFallback>
                      {conversation.user_name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conversation.user_name}</p>
                      {conversation.unread_count > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {conversation.unread_count}
                        </Badge>
                      )}
                    </div>
                    {conversation.last_message && (
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.last_message.content}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ConversationsList;
