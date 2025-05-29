
import { useState } from "react";
import ConversationList from "./ConversationList";
import MessageThread from "./MessageThread";
import MessageSearch from "./messaging/MessageSearch";
import { useAdvancedMessaging } from "@/hooks/useAdvancedMessaging";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

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
    searchQuery,
    searchResults,
    editingMessage,
    setEditingMessage,
    isRecording,
    handleSendMessage,
    handleReactToMessage,
    handleEditMessage,
    handleDeleteMessage,
    handleForwardMessage,
    handlePinMessage,
    handleSearchMessages,
    handleTogglePin,
    handleToggleMute,
    handleArchiveConversation,
    handleCreateThread,
    handleVoiceRecording,
  } = useAdvancedMessaging();

  const [showSearch, setShowSearch] = useState(false);

  const replyingToMessage = replyingTo ? messages.find(m => m.id === replyingTo) : undefined;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px] relative">
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
      
      <div className="lg:col-span-2 relative">
        {/* Search button */}
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSearch(true)}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

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
          replyingToMessage={replyingToMessage}
          editingMessage={editingMessage}
          setEditingMessage={setEditingMessage}
          isRecording={isRecording}
          onReactToMessage={handleReactToMessage}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
          onForwardMessage={handleForwardMessage}
          onPinMessage={handlePinMessage}
          onCreateThread={handleCreateThread}
          onVoiceRecording={handleVoiceRecording}
        />
      </div>

      {/* Search overlay */}
      <MessageSearch
        searchQuery={searchQuery}
        onSearchChange={handleSearchMessages}
        searchResults={searchResults}
        onResultClick={(result) => {
          setSelectedConversation(result.conversation.id);
          setShowSearch(false);
        }}
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
      />
    </div>
  );
};

export default EnhancedMessaging;
