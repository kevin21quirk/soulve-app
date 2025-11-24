import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import ConversationList from "./ConversationList";
import MessageThread from "./MessageThread";
import EmptyStates from "./EmptyStates";
import { useConversationsQuery } from "@/hooks/useConversationsQuery";
import { useUserPresence } from "@/hooks/useUserPresence";

const MessagingInterface = () => {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { data: conversations } = useConversationsQuery();
  const hadConversationForSelectedRef = useRef(false);
  
  // Track user presence globally
  useUserPresence();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset selection only if active conversation was deleted (not for new conversations)
  useEffect(() => {
    if (!selectedPartnerId || !conversations) return;

    const hasConversation = conversations.some(
      conv => conv.partner_id === selectedPartnerId
    );

    // Only clear if there WAS a conversation and now there isn't (deleted)
    if (hadConversationForSelectedRef.current && !hasConversation) {
      setSelectedPartnerId(null);
    }

    // Update ref for next check
    hadConversationForSelectedRef.current = hasConversation;
  }, [conversations, selectedPartnerId]);

  return (
    <div className="flex h-full bg-background">
      {/* Conversation List - Hide on mobile when conversation selected */}
      <div
        className={cn(
          "w-full md:w-[360px] md:border-r border-border",
          isMobile && selectedPartnerId && "hidden"
        )}
      >
        <ConversationList
          onSelect={setSelectedPartnerId}
          activeId={selectedPartnerId}
        />
      </div>

      {/* Message Thread - Hide on mobile when no conversation selected */}
      <div
        className={cn(
          "flex-1",
          isMobile && !selectedPartnerId && "hidden"
        )}
      >
        {selectedPartnerId ? (
          <MessageThread
            partnerId={selectedPartnerId}
            onBack={() => setSelectedPartnerId(null)}
            isMobile={isMobile}
          />
        ) : (
          <div className="hidden md:flex h-full w-full">
            <EmptyStates type="no-selection" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingInterface;
