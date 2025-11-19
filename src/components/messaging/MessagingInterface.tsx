import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import ConversationList from "./ConversationList";
import MessageThread from "./MessageThread";
import EmptyStates from "./EmptyStates";

const MessagingInterface = () => {
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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
          <div className="hidden md:flex h-full">
            <EmptyStates type="no-selection" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagingInterface;
