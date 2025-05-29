
import { Message } from "@/types/messaging";

interface MessageInfoProps {
  message: Message;
}

const MessageInfo = ({ message }: MessageInfoProps) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex items-center space-x-2 text-xs text-gray-500 ${
      message.isOwn ? 'justify-end' : 'justify-start'
    }`}>
      <span>{formatTime(message.timestamp)}</span>
      {message.isEdited && <span>(edited)</span>}
      {message.isOwn && message.status && (
        <span>
          {message.status === 'sent' && '✓'}
          {message.status === 'delivered' && '✓✓'}
          {message.status === 'read' && <span className="text-blue-500">✓✓</span>}
        </span>
      )}
    </div>
  );
};

export default MessageInfo;
