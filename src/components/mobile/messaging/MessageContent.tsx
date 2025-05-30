
import { Reply, Forward } from "lucide-react";
import MessageAttachment from "./MessageAttachment";
import { Message } from "@/types/messaging";
import { useTouchGestures } from "@/components/ui/mobile/touch-gestures";

interface MessageContentProps {
  message: Message;
  onLongPress?: () => void;
}

const MessageContent = ({ message, onLongPress }: MessageContentProps) => {
  const { onTouchStart, onTouchEnd } = useTouchGestures();

  const handleTouchStart = () => {
    onTouchStart;
    // Start long press timer for message options
    if (onLongPress) {
      setTimeout(onLongPress, 500);
    }
  };

  return (
    <div className="space-y-1">
      {/* Reply indicator */}
      {message.replyTo && (
        <div className={`text-xs text-gray-500 flex items-center space-x-1 mb-1 ${
          message.isOwn ? 'justify-end' : 'justify-start'
        }`}>
          <Reply className="h-3 w-3" />
          <span>Replying to previous message</span>
        </div>
      )}
      
      {/* Forwarded indicator */}
      {message.isForwarded && (
        <div className={`text-xs text-gray-500 flex items-center space-x-1 mb-1 ${
          message.isOwn ? 'justify-end' : 'justify-start'
        }`}>
          <Forward className="h-3 w-3" />
          <span>Forwarded from {message.forwardedFrom}</span>
        </div>
      )}
      
      {/* Message bubble */}
      <div
        className={`px-4 py-2 rounded-2xl relative max-w-[280px] ${
          message.isOwn
            ? 'bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white rounded-br-md ml-auto'
            : 'bg-gray-100 text-gray-900 rounded-bl-md'
        }`}
        onTouchStart={handleTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Priority indicator */}
        {message.priority === "urgent" && (
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        )}
        
        {/* Message content */}
        {message.content && (
          <p className="text-sm break-words leading-relaxed">{message.content}</p>
        )}
        
        {/* Attachments */}
        {message.attachments?.map((attachment, index) => (
          <MessageAttachment key={`${attachment.id}-${index}`} attachment={attachment} />
        ))}
        
        {/* Voice message waveform placeholder */}
        {message.type === 'voice' && (
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex space-x-1">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-current rounded-full ${
                    message.isOwn ? 'bg-white bg-opacity-70' : 'bg-gray-400'
                  }`}
                  style={{ height: `${Math.random() * 20 + 5}px` }}
                />
              ))}
            </div>
            <span className={`text-xs ${message.isOwn ? 'text-white text-opacity-80' : 'text-gray-500'}`}>
              0:15
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageContent;
