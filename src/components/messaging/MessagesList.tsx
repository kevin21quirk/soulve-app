
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Loader2, Download, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  is_read: boolean;
  attachment_url?: string;
  attachment_name?: string;
  attachment_type?: string;
  attachment_size?: number;
  sender_profile?: {
    first_name?: string;
    last_name?: string;
  };
}

interface MessagesListProps {
  messages: Message[];
  userId?: string;
  loading?: boolean;
  partnerTyping?: boolean;
}

const MessagesList = ({ messages, userId, loading = false, partnerTyping = false }: MessagesListProps) => {
  const handleDownload = (url: string, name: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderAttachment = (message: Message) => {
    if (!message.attachment_url) return null;

    const isImage = message.attachment_type === 'image';
    
    return (
      <div className="mt-2">
        {isImage ? (
          <img 
            src={message.attachment_url} 
            alt={message.attachment_name}
            className="max-w-xs rounded-lg cursor-pointer"
            onClick={() => window.open(message.attachment_url, '_blank')}
          />
        ) : (
          <div className="flex items-center space-x-2 p-2 bg-gray-100 rounded-lg max-w-xs">
            <Download className="h-4 w-4 text-gray-500" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.attachment_name}</p>
              {message.attachment_size && (
                <p className="text-xs text-gray-500">
                  {(message.attachment_size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDownload(message.attachment_url!, message.attachment_name!)}
              className="p-1 h-6 w-6"
            >
              <Download className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
    );
  };

  const renderReadReceipt = (message: Message, isOwn: boolean) => {
    if (!isOwn) return null;
    
    return (
      <div className="flex items-center justify-end mt-1">
        {message.is_read ? (
          <CheckCheck className="h-3 w-3 text-blue-500" />
        ) : (
          <Check className="h-3 w-3 text-gray-400" />
        )}
      </div>
    );
  };

  return (
    <ScrollArea className="h-full p-4">
        {loading ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <p>Loading messages...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
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
                      {message.content && (
                        <p className="text-sm">{message.content}</p>
                      )}
                      {renderAttachment(message)}
                      <div className="flex items-center justify-between mt-1">
                        <p className={`text-xs ${isOwn ? "text-blue-100" : "text-gray-500"}`}>
                          {format(new Date(message.created_at), 'HH:mm')}
                        </p>
                      </div>
                    </div>
                    {renderReadReceipt(message, isOwn)}
                  </div>
                </div>
              );
            })}
            
            {/* Typing indicator */}
            {partnerTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-md max-w-[70%]">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>
  );
};

export default MessagesList;
