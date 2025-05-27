
import ConversationList from "./ConversationList";
import MessageThread from "./MessageThread";
import { useMessaging } from "@/hooks/useMessaging";

const EnhancedMessaging = () => {
  const {
    selectedConversation,
    setSelectedConversation,
    newMessage,
    setNewMessage,
    conversations,
    messages,
    selectedConv,
    handleSendMessage,
  } = useMessaging();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      <ConversationList
        conversations={conversations}
        selectedConversation={selectedConversation}
        onSelectConversation={setSelectedConversation}
      />
      
      <MessageThread
        selectedConv={selectedConv}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default EnhancedMessaging;
