
import { useRef } from "react";
import { Reply } from "lucide-react";
import MessageAttachment from "./MessageAttachment";
import { Message } from "@/types/messaging";

interface MessageContentProps {
  message: Message;
  onTouchStart: () => void;
  onTouchEnd: () => void;
}

const MessageContent = ({ message, onTouchStart, onTouchEnd }: MessageContentProps) => {
  return (
    <div className="space-y-1">
      {/* Reply indicator */}
      {message.replyTo && (
        <div className={`text-xs text-gray-500 ${message.isOwn ? 'text-right' : 'text-left'}`}>
          <Reply className="h-3 w-3 inline mr-1" />
          Replying to previous message
        </div>
      )}
      
      {/* Message bubble */}
      <div
        className={`px-4 py-2 rounded-2xl relative ${
          message.isOwn
            ? 'bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white rounded-br-md'
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseUp={onTouchEnd}
        onMouseLeave={onTouchEnd}
      >
        {/* Priority indicator */}
        {message.priority === "urgent" && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        )}
        
        {/* Message content */}
        {message.content && (
          <p className="text-sm break-words">{message.content}</p>
        )}
        
        {/* Attachments */}
        {message.attachments?.map((attachment, index) => (
          <MessageAttachment key={index} attachment={attachment} />
        ))}
        
        {/* Forwarded indicator */}
        {message.isForwarded && (
          <div className={`text-xs mt-1 opacity-75 ${message.isOwn ? 'text-blue-100' : 'text-gray-600'}`}>
            Forwarded from {message.forwardedFrom}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageContent;
