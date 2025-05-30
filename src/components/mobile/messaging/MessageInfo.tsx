
import { Message } from "@/types/messaging";

interface MessageInfoProps {
  message: Message;
}

const MessageInfo = ({ message }: MessageInfoProps) => {
  const formatTime = (timestamp: string) => {
    // Handle both time strings and full timestamps
    if (timestamp.includes(':') && !timestamp.includes('T')) {
      return timestamp;
    }
    
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className={`flex items-center space-x-2 text-xs text-gray-500 mt-1 ${
      message.isOwn ? 'justify-end' : 'justify-start'
    }`}>
      <span>{formatTime(message.timestamp)}</span>
      {message.isEdited && <span>(edited)</span>}
      {message.isOwn && message.status && (
        <span className={`font-medium ${
          message.status === 'read' ? 'text-blue-500' : 
          message.status === 'delivered' ? 'text-green-500' : 'text-gray-400'
        }`}>
          {message.status === 'sent' && '✓'}
          {message.status === 'delivered' && '✓✓'}
          {message.status === 'read' && '✓✓'}
        </span>
      )}
    </div>
  );
};

export default MessageInfo;
