
import { useEffect, useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Loader2, Download, Check, CheckCheck, ArrowDown } from "lucide-react";
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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [highlightedMessages, setHighlightedMessages] = useState<Set<string>>(new Set());
  const [showScrollButton, setShowScrollButton] = useState(false);
  const previousMessageCountRef = useRef(messages.length);

  // Check scroll position to show/hide scroll to bottom button
  useEffect(() => {
    const scrollArea = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollArea) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollArea;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom && messages.length > 0);
    };

    scrollArea.addEventListener('scroll', handleScroll);
    return () => scrollArea.removeEventListener('scroll', handleScroll);
  }, [messages.length]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    const isNewMessage = messages.length > previousMessageCountRef.current;
    
    if (isNewMessage && messages.length > 0) {
      // Get the last message ID
      const lastMessage = messages[messages.length - 1];
      
      // Only highlight if it's from someone else (not own message)
      if (lastMessage.sender_id !== userId) {
        setHighlightedMessages(prev => new Set(prev).add(lastMessage.id));
        
        // Remove highlight after 3 seconds
        setTimeout(() => {
          setHighlightedMessages(prev => {
            const newSet = new Set(prev);
            newSet.delete(lastMessage.id);
            return newSet;
          });
        }, 3000);
      }

      // Scroll to the new message
      scrollToBottom();
    }

    previousMessageCountRef.current = messages.length;
  }, [messages, userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
    <div className="relative h-full">
      <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
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
              const isHighlighted = highlightedMessages.has(message.id);

              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"} transition-all duration-300`}
                >
                  <div className={`max-w-[70%] ${isOwn ? "ml-12" : "mr-12"}`}>
                    {!isOwn && (
                      <p className="text-xs text-gray-500 mb-1 px-1">{senderName}</p>
                    )}
                    <div 
                      className={`
                        relative rounded-lg p-3 
                        ${isOwn 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted text-foreground"
                        }
                        ${isHighlighted ? "message-highlight" : ""}
                      `}
                    >
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {renderAttachment(message)}
                      <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {format(new Date(message.created_at), "MMM d, h:mm a")}
                      </p>
                    </div>
                    {renderReadReceipt(message, isOwn)}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
            
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
      
      {/* Scroll to bottom button */}
      {showScrollButton && (
        <Button
          onClick={scrollToBottom}
          size="icon"
          className="absolute bottom-4 right-4 h-8 w-8 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-10"
          aria-label="Scroll to bottom"
        >
          <ArrowDown className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default MessagesList;
