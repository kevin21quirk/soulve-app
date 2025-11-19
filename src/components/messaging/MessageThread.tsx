import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessagesQuery } from "@/hooks/useMessagesQuery";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useConversationsQuery } from "@/hooks/useConversationsQuery";
import MessageBubble from "./MessageBubble";
import ConversationHeader from "./ConversationHeader";
import MessageInputField from "./MessageInputField";
import EmptyStates from "./EmptyStates";
import { Skeleton } from "@/components/ui/skeleton";

interface MessageThreadProps {
  partnerId: string;
  onBack?: () => void;
  isMobile: boolean;
}

const MessageThread = ({ partnerId, onBack, isMobile }: MessageThreadProps) => {
  const { data: messages, isLoading } = useMessagesQuery(partnerId);
  const { data: conversations } = useConversationsQuery();
  const sendMutation = useSendMessage(partnerId);
  const scrollRef = useRef<HTMLDivElement>(null);

  const conversation = conversations?.find(c => c.partner_id === partnerId);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = (content: string) => {
    sendMutation.mutate(content);
  };

  const shouldShowAvatar = (index: number) => {
    if (!messages || index === 0) return true;
    const currentMsg = messages[index];
    const prevMsg = messages[index - 1];
    return currentMsg.sender_id !== prevMsg.sender_id;
  };

  const shouldShowTimestamp = (index: number) => {
    if (!messages || index === messages.length - 1) return true;
    const currentMsg = messages[index];
    const nextMsg = messages[index + 1];
    
    // Show if next message is from different sender
    if (currentMsg.sender_id !== nextMsg.sender_id) return true;
    
    // Show if more than 2 minutes apart
    const timeDiff = new Date(nextMsg.created_at).getTime() - new Date(currentMsg.created_at).getTime();
    return timeDiff > 120000; // 2 minutes
  };

  if (!conversation) {
    return <EmptyStates type="no-selection" />;
  }

  return (
    <div className="h-full flex flex-col">
      <ConversationHeader
        conversation={conversation}
        onBack={onBack}
        isMobile={isMobile}
      />

      <ScrollArea className="flex-1 p-4">
        <div ref={scrollRef} className="space-y-2">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`flex gap-2 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-16 w-48 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : messages && messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                showAvatar={shouldShowAvatar(index)}
                showTimestamp={shouldShowTimestamp(index)}
              />
            ))
          ) : (
            <EmptyStates type="no-messages" />
          )}
        </div>
      </ScrollArea>

      <MessageInputField
        onSend={handleSend}
        disabled={!partnerId}
        isSending={sendMutation.isPending}
      />
    </div>
  );
};

export default MessageThread;
