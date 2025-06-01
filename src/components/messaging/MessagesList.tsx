
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardContent } from "@/components/ui/card";
import { format } from "date-fns";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender_profile?: {
    first_name?: string;
    last_name?: string;
  };
}

interface MessagesListProps {
  messages: Message[];
  userId?: string;
}

const MessagesList = ({ messages, userId }: MessagesListProps) => {
  return (
    <CardContent className="flex-1 overflow-hidden p-0">
      <ScrollArea className="h-[400px] p-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => {
              const isOwn = message.sender_id === userId;
              const senderName = message.sender_profile 
                ? `${message.sender_profile.first_name || ''} ${message.sender_profile.last_name || ''}`.trim() || 'You'
                : 'You';

              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[70%] ${isOwn ? "order-2" : "order-1"}`}>
                    {!isOwn && (
                      <p className="text-xs text-gray-500 mb-1 px-3">{senderName}</p>
                    )}
                    <div
                      className={`px-4 py-2 rounded-2xl ${
                        isOwn
                          ? "bg-blue-600 text-white rounded-br-md"
                          : "bg-gray-100 text-gray-900 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${isOwn ? "text-blue-100" : "text-gray-500"}`}>
                        {format(new Date(message.created_at), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </ScrollArea>
    </CardContent>
  );
};

export default MessagesList;
