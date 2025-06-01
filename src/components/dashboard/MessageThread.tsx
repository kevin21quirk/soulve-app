
import { Card, CardContent } from "@/components/ui/card";
import { Message, Conversation } from "@/types/messaging";
import MessageThreadHeader from "./messaging/MessageThreadHeader";
import ReplyPreview from "./messaging/ReplyPreview";
import MessageBubble from "./messaging/MessageBubble";
import TypingIndicator from "./messaging/TypingIndicator";
import ConversationParticipants from "./messaging/ConversationParticipants";
import EnhancedMessageInput from "./messaging/EnhancedMessageInput";

interface MessageThreadProps {
  selectedConv: Conversation | undefined;
  messages: Message[];
  newMessage: string;
  setNewMessage: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  showParticipants: boolean;
  setShowParticipants: (show: boolean) => void;
  replyingTo: string | null;
  setReplyingTo: (messageId: string | null) => void;
  replyingToMessage?: Message;
  editingMessage: string | null;
  setEditingMessage: (messageId: string | null) => void;
  isRecording: boolean;
  onReactToMessage: (messageId: string, emoji: string) => void;
  onEditMessage: (messageId: string, newContent: string) => void;
  onDeleteMessage: (messageId: string) => void;
  onForwardMessage: (messageId: string, conversationIds: string[]) => void;
  onPinMessage: (messageId: string) => void;
  onCreateThread: (messageId: string) => void;
  onVoiceRecording: (start: boolean) => void;
}

const MessageThread = ({ 
  selectedConv, 
  messages, 
  newMessage, 
  setNewMessage, 
  onSendMessage,
  showParticipants,
  setShowParticipants,
  replyingTo,
  setReplyingTo,
  replyingToMessage,
  editingMessage,
  setEditingMessage,
  isRecording,
  onReactToMessage,
  onEditMessage,
  onDeleteMessage,
  onForwardMessage,
  onPinMessage,
  onCreateThread,
  onVoiceRecording
}: MessageThreadProps) => {
  if (!selectedConv) return null;

  return (
    <div className="lg:col-span-2 flex">
      <Card className="flex-1 flex flex-col">
        <MessageThreadHeader
          selectedConv={selectedConv}
          showParticipants={showParticipants}
          setShowParticipants={setShowParticipants}
        />

        <ReplyPreview
          replyingToMessage={replyingToMessage}
          setReplyingTo={setReplyingTo}
        />

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              messages={messages}
              onReactToMessage={onReactToMessage}
              onReply={setReplyingTo}
              onEdit={setEditingMessage}
              onDelete={onDeleteMessage}
              onForward={onForwardMessage}
              onPin={onPinMessage}
              onCreateThread={onCreateThread}
            />
          ))}
          
          {selectedConv.isTyping && <TypingIndicator />}
        </CardContent>

        <EnhancedMessageInput
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          onSendMessage={onSendMessage}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          replyingToMessage={replyingToMessage}
          isRecording={isRecording}
          onVoiceRecording={onVoiceRecording}
        />
      </Card>

      {showParticipants && (
        <div className="ml-4">
          <ConversationParticipants
            conversation={selectedConv}
            onClose={() => setShowParticipants(false)}
          />
        </div>
      )}
    </div>
  );
};

export default MessageThread;
