
import { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Reply, 
  MoreVertical, 
  Heart, 
  ThumbsUp, 
  Laugh,
  Download,
  Play,
  Pause
} from "lucide-react";
import { Message } from "@/types/messaging";

interface MobileMessageBubbleProps {
  message: Message;
}

const MobileMessageBubble = ({ message }: MobileMessageBubbleProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const reactions = ['❤️', '👍', '😂', '😮', '😢', '😡'];

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleReaction = (emoji: string) => {
    // Handle adding reaction
    setShowReactions(false);
  };

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      setShowReactions(true);
    }, 500); // 500ms long press
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const renderAttachment = (attachment: any) => {
    switch (attachment.type) {
      case 'image':
        return (
          <div className="relative rounded-lg overflow-hidden max-w-xs">
            <img 
              src={attachment.url} 
              alt={attachment.name}
              className="w-full h-auto"
            />
          </div>
        );
      
      case 'audio':
        return (
          <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-3 max-w-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="rounded-full"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1">
              <div className="w-full bg-gray-300 rounded-full h-1">
                <div className="bg-blue-600 h-1 rounded-full" style={{ width: '30%' }}></div>
              </div>
              <p className="text-xs text-gray-600 mt-1">0:15 / 0:47</p>
            </div>
          </div>
        );
      
      case 'file':
        return (
          <div className="flex items-center space-x-3 bg-gray-100 rounded-lg p-3 max-w-xs">
            <div className="bg-blue-100 rounded-lg p-2">
              <Download className="h-4 w-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{attachment.name}</p>
              <p className="text-xs text-gray-600">{(attachment.size / 1024 / 1024).toFixed(1)} MB</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex max-w-[85%] ${message.isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
        {!message.isOwn && (
          <Avatar className="h-8 w-8 mr-2 mt-auto">
            <AvatarImage src="/placeholder.svg" alt={message.sender} />
            <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white text-xs">
              {message.sender.charAt(0)}
            </AvatarFallback>
          </Avatar>
        )}
        
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
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}
            onMouseLeave={handleTouchEnd}
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
              <div key={index} className="mt-2">
                {renderAttachment(attachment)}
              </div>
            ))}
            
            {/* Forwarded indicator */}
            {message.isForwarded && (
              <div className={`text-xs mt-1 opacity-75 ${message.isOwn ? 'text-blue-100' : 'text-gray-600'}`}>
                Forwarded from {message.forwardedFrom}
              </div>
            )}
          </div>
          
          {/* Message info */}
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
          
          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className={`flex flex-wrap gap-1 ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
              {message.reactions.map((reaction, index) => (
                <Badge key={index} variant="secondary" className="text-xs px-2 py-1">
                  {reaction.emoji} {reaction.userId === 'current-user' ? 'You' : reaction.userName}
                </Badge>
              ))}
            </div>
          )}
          
          {/* Quick reactions (shown on long press) */}
          {showReactions && (
            <div className="absolute top-0 left-0 right-0 bg-white border rounded-lg shadow-lg p-2 z-10">
              <div className="flex space-x-2">
                {reactions.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleReaction(emoji)}
                    className="text-lg p-1"
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMessageBubble;
