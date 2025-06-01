
import { Reply } from "lucide-react";
import { Message } from "@/types/messaging";
import MessageReactions from "./MessageReactions";
import MessageActions from "./MessageActions";

interface MessageBubbleProps {
  message: Message;
  messages: Message[];
  onReactToMessage: (messageId: string, emoji: string) => void;
  onReply: (messageId: string) => void;
  onEdit: (messageId: string) => void;
  onDelete: (messageId: string) => void;
  onForward: (messageId: string, conversationIds: string[]) => void;
  onPin: (messageId: string) => void;
  onCreateThread: (messageId: string) => void;
}

const MessageBubble = ({
  message,
  messages,
  onReactToMessage,
  onReply,
  onEdit,
  onDelete,
  onForward,
  onPin,
  onCreateThread
}: MessageBubbleProps) => {
  return (
    <div key={message.id}>
      {message.replyTo && (
        <div className="text-xs text-gray-500 mb-1 ml-2">
          <Reply className="h-3 w-3 inline mr-1" />
          Replying to: {messages.find(m => m.id === message.replyTo)?.content?.substring(0, 50)}...
        </div>
      )}
      
      <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} group`}>
        <div className="max-w-xs lg:max-w-md space-y-1">
          <div
            className={`px-4 py-2 rounded-lg relative ${
              message.isOwn
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {message.priority === "urgent" && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            )}
            
            <p className="text-sm">{message.content}</p>
            
            {message.isForwarded && (
              <div className="text-xs opacity-75 mt-1">
                Forwarded from {message.forwardedFrom}
              </div>
            )}
            
            <div className={`flex items-center justify-between mt-1 ${
              message.isOwn ? 'text-blue-100' : 'text-gray-500'
            }`}>
              <p className="text-xs">
                {message.timestamp}
                {message.isEdited && " (edited)"}
              </p>
              {message.isOwn && message.status && (
                <span className="text-xs">
                  {message.status === 'sent' && '✓'}
                  {message.status === 'delivered' && '✓✓'}
                  {message.status === 'read' && '✓✓'}
                </span>
              )}
            </div>
          </div>
          
          <MessageReactions
            reactions={message.reactions}
            onReact={(emoji) => onReactToMessage(message.id, emoji)}
            isOwn={message.isOwn}
          />
          
          {/* Message actions */}
          <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${
            message.isOwn ? 'text-right' : 'text-left'
          }`}>
            <MessageActions
              messageId={message.id}
              messageContent={message.content}
              isOwn={message.isOwn}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              onForward={onForward}
              onPin={onPin}
              onCreateThread={onCreateThread}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
