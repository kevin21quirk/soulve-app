import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useConversationsQuery } from "@/hooks/useConversationsQuery";
import ConversationItem from "./ConversationItem";
import EmptyStates from "./EmptyStates";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

interface ConversationListProps {
  onSelect: (conversationId: string) => void;
  activeId: string | null;
}

const ConversationList = ({ onSelect, activeId }: ConversationListProps) => {
  const { data: conversations, isLoading } = useConversationsQuery();
  const [userId, setUserId] = React.useState<string>("");

  React.useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-4 py-4 border-b border-border">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <div className="flex-1 p-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!conversations || conversations.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-4 py-4 border-b border-border">
          <h2 className="text-xl font-semibold">Messages</h2>
        </div>
        <EmptyStates type="no-conversations" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-4 border-b border-border">
        <h2 className="text-xl font-semibold">Messages</h2>
      </div>

      <ScrollArea className="flex-1">
        <div className="divide-y divide-border">
          {conversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={activeId === conversation.partner_id}
              onClick={() => onSelect(conversation.partner_id)}
              userId={userId}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ConversationList;
