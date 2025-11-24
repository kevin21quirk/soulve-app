import { useState, useRef, KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Send, Smile, Loader2 } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";

interface MessageInputFieldProps {
  onSend: (content: string) => void;
  disabled?: boolean;
  isSending?: boolean;
  className?: string;
  partnerId?: string | null;
}

const MessageInputField = ({ onSend, disabled, isSending, className, partnerId }: MessageInputFieldProps) => {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { notifyTyping, stopTyping } = useTypingIndicator(partnerId);

  const handleSend = () => {
    if (message.trim() && !disabled && !isSending) {
      stopTyping(); // Stop typing indicator before sending
      onSend(message.trim());
      setMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Notify that user is typing
    if (e.target.value.length > 0) {
      notifyTyping();
    }
    
    // Auto-expand textarea
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setMessage(prev => prev + emojiData.emoji);
    textareaRef.current?.focus();
  };

  return (
    <div className={`px-4 py-3 border-t border-border bg-background ${className || ''}`}>
      <div className="flex items-end gap-2">
        <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              disabled={disabled}
            >
              <Smile className="h-5 w-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" align="start" className="w-auto p-0 border-0">
            <EmojiPicker onEmojiClick={onEmojiClick} searchDisabled />
          </PopoverContent>
        </Popover>

        <Textarea
          ref={textareaRef}
          value={message}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="min-h-[40px] max-h-[120px] resize-none"
          disabled={disabled || isSending}
          rows={1}
        />

        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled || isSending}
          size="icon"
          className="shrink-0 rounded-full"
        >
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default MessageInputField;
