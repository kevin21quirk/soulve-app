
import ConversationList from "./ConversationList";
import MessageThread from "./MessageThread";
import { useEnhancedMessaging } from "@/hooks/useEnhancedMessaging";

const EnhancedMessaging = () => {
  const {
    selectedConversation,
    setSelectedConversation,
    newMessage,
    setNewMessage,
    conversations,
    messages,
    selectedConv,
    filters,
    setFilters,
    showParticipants,
    setShowParticipants,
    replyingTo,
    setReplyingTo,
    handleSendMessage,
    handleReactToMessage,
    handleTogglePin,
    handleToggleMute,
    handleArchiveConversation,
  } = useEnhancedMessaging();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      <ConversationList
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
        filters={filters}
        onFiltersChange={setFilters}
        onTogglePin={handleTogglePin}
        onToggleMute={handleToggleMute}
        onArchiveConversation={handleArchiveConversation}
      />
      
      <MessageThread
        selectedConv={selectedConv}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        showParticipants={showParticipants}
        setShowParticipants={setShowParticipants}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        onReactToMessage={handleReactToMessage}
      />
    </div>
  );
};

export default EnhancedMessaging;
