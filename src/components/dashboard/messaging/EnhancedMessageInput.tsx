
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Mic, 
  MicOff, 
  X, 
  Reply,
  Image,
  File,
  Camera,
  MapPin,
  Calendar
} from "lucide-react";
import { Message } from "@/types/messaging";

interface EnhancedMessageInputProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  replyingTo: string | null;
  setReplyingTo: (messageId: string | null) => void;
  replyingToMessage?: Message;
  isRecording: boolean;
  onVoiceRecording: (start: boolean) => void;
  disabled?: boolean;
}

const EnhancedMessageInput = ({
  newMessage,
  setNewMessage,
  onSendMessage,
  replyingTo,
  setReplyingTo,
  replyingToMessage,
  isRecording,
  onVoiceRecording,
  disabled = false
}: EnhancedMessageInputProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const commonEmojis = ["😊", "😂", "❤️", "👍", "👎", "😮", "😢", "😡", "🎉", "🔥", "💯", "🙏"];

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(newMessage + emoji);
    setShowEmojis(false);
  };

  const handleFileAttach = (type: 'file' | 'image') => {
    if (type === 'file') {
      fileInputRef.current?.click();
    } else {
      imageInputRef.current?.click();
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(e);
      setAttachments([]);
      setIsExpanded(false);
    }
  };

  return (
    <div className="border-t p-4 space-y-3">
      {/* Reply indicator */}
      {replyingTo && replyingToMessage && (
        <div className="bg-gray-50 p-2 rounded mb-2 text-sm flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Reply className="h-4 w-4 text-gray-500" />
            <span className="text-gray-600">Replying to:</span>
            <span className="font-medium">{replyingToMessage.sender}</span>
            <span className="text-gray-500 truncate max-w-xs">
              {replyingToMessage.content.substring(0, 50)}...
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setReplyingTo(null)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Attachments preview */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {attachments.map((file, index) => (
            <div key={index} className="bg-blue-50 px-3 py-1 rounded-full text-sm flex items-center space-x-2">
              <span className="truncate max-w-20">{file.name}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeAttachment(index)}
                className="h-4 w-4 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-2">
        {/* Main input area */}
        <div className="flex space-x-2">
          {isExpanded ? (
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 min-h-[80px] resize-none"
              disabled={disabled}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setIsExpanded(false);
                }
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          ) : (
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1"
              disabled={disabled}
              onFocus={() => setIsExpanded(true)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
          )}

          {/* Action buttons */}
          <div className="flex space-x-1">
            {/* Attachment menu */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" disabled={disabled}>
                  <Paperclip className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-40 p-2">
                <div className="grid gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFileAttach('image')}
                    className="justify-start"
                  >
                    <Image className="h-4 w-4 mr-2" />
                    Photo
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFileAttach('file')}
                    className="justify-start"
                  >
                    <File className="h-4 w-4 mr-2" />
                    File
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                  >
                    <Camera className="h-4 w-4 mr-2" />
                    Camera
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="justify-start"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Location
                  </Button>
                </div>
              </PopoverContent>
            </Popover>

            {/* Emoji picker */}
            <Popover open={showEmojis} onOpenChange={setShowEmojis}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" disabled={disabled}>
                  <Smile className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2">
                <div className="grid grid-cols-6 gap-1">
                  {commonEmojis.map((emoji) => (
                    <Button
                      key={emoji}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => handleEmojiSelect(emoji)}
                    >
                      {emoji}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            {/* Voice recording */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onVoiceRecording(!isRecording)}
              disabled={disabled}
              className={isRecording ? "text-red-500" : ""}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            {/* Send button */}
            <Button 
              type="submit" 
              size="sm" 
              disabled={(!newMessage.trim() && attachments.length === 0) || disabled}
              className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] hover:from-[#0bd19c] hover:to-[#1690e8]"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        multiple
        onChange={handleFileSelect}
      />
      <input
        ref={imageInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default EnhancedMessageInput;
