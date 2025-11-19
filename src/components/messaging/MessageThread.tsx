import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessagesQuery } from "@/hooks/useMessagesQuery";
import { useSendMessage } from "@/hooks/useSendMessage";
import { useConversationsQuery } from "@/hooks/useConversationsQuery";
import { useQuery } from "@tanstack/react-query";
import { getUserProfile } from "@/services/messagingService";
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
const MessageThread = ({
  partnerId,
  onBack,
  isMobile
}: MessageThreadProps) => {
  const {
    data: messages,
    isLoading
  } = useMessagesQuery(partnerId);
  const {
    data: conversations
  } = useConversationsQuery();
  const sendMutation = useSendMessage(partnerId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const conversation = conversations?.find(c => c.partner_id === partnerId);

  // Fetch partner profile if no conversation exists (new conversation)
  const {
    data: partnerProfile,
    isLoading: isLoadingProfile
  } = useQuery({
    queryKey: ['user-profile', partnerId],
    queryFn: () => getUserProfile(partnerId),
    enabled: !conversation && !!partnerId
  });

  // Create a temporary conversation object for new conversations
  const displayConversation = conversation || (partnerProfile ? {
    id: partnerId,
    partner_id: partnerId,
    partner_name: `${partnerProfile.first_name || ''} ${partnerProfile.last_name || ''}`.trim() || 'Unknown User',
    partner_avatar: partnerProfile.avatar_url,
    unread_count: 0
  } : null);

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
  if (isLoadingProfile) {
    return <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Skeleton className="h-24 w-64" />
        </div>
      </div>;
  }
  if (!displayConversation) {
    return <EmptyStates type="no-selection" />;
  }
  return <div className="h-full max-h-full flex flex-col overflow-hidden">
      <ConversationHeader conversation={displayConversation} onBack={onBack} isMobile={isMobile} />

      <ScrollArea className="flex-1 min-h-0 px-4 py-2 overflow-y-auto">
        <div ref={scrollRef} className="space-y-2 pb-2">
          {isLoading ? <div className="space-y-4">
              {Array.from({
            length: 5
          }).map((_, i) => <div key={i} className={`flex gap-2 ${i % 2 === 0 ? '' : 'flex-row-reverse'}`}>
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-16 w-48 rounded-2xl" />
                </div>)}
            </div> : messages && messages.length > 0 ? messages.map((message, index) => <MessageBubble key={message.id} message={message} showAvatar={shouldShowAvatar(index)} showTimestamp={shouldShowTimestamp(index)} />) : <EmptyStates type="no-messages" />}
        </div>
      </ScrollArea>

      <div className="py-2 border-t border-border bg-background mx-0 px-0">
        <MessageInputField onSend={handleSend} disabled={!partnerId} isSending={sendMutation.isPending} className="mx-0 px-0" />
      </div>
    </div>;
};
export default MessageThread;