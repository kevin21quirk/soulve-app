
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Send, 
  Smile, 
  Paperclip, 
  Mic, 
  Image as ImageIcon,
  Camera,
  MapPin,
  Plus,
  X
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface MobileMessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isRecording: boolean;
  onToggleRecording: () => void;
}

const MobileMessageInput = ({ 
  value, 
  onChange, 
  onSend, 
  onKeyPress,
  isRecording,
  onToggleRecording 
}: MobileMessageInputProps) => {
  const [showAttachments, setShowAttachments] = useState(false);
  const [showEmojis, setShowEmojis] = useState(false);

  const emojis = ['😀', '😂', '😍', '🤔', '😢', '😡', '👍', '👎', '❤️', '🔥', '💯', '🎉'];

  const attachmentOptions = [
    { icon: Camera, label: "Camera", action: () => console.log("Camera") },
    { icon: ImageIcon, label: "Gallery", action: () => console.log("Gallery") },
    { icon: MapPin, label: "Location", action: () => console.log("Location") },
    { icon: Paperclip, label: "Document", action: () => console.log("Document") }
  ];

  const handleEmojiSelect = (emoji: string) => {
    onChange(value + emoji);
    setShowEmojis(false);
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex items-end space-x-2">
        {/* Attachment button */}
        <Popover open={showAttachments} onOpenChange={setShowAttachments}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="rounded-full">
              {showAttachments ? <X className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
            </Button>
          </PopoverTrigger>
          <PopoverContent side="top" className="w-auto p-2">
            <div className="grid grid-cols-2 gap-2">
              {attachmentOptions.map((option) => (
                <Button
                  key={option.label}
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    option.action();
                    setShowAttachments(false);
                  }}
                  className="flex flex-col items-center space-y-1 h-auto py-3"
                >
                  <option.icon className="h-5 w-5" />
                  <span className="text-xs">{option.label}</span>
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Message input */}
        <div className="flex-1 relative">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            placeholder="Type a message..."
            className="rounded-full pr-12 border-gray-300 focus:border-[#18a5fe] focus:ring-[#18a5fe]"
            disabled={isRecording}
          />
          
          {/* Emoji button */}
          <Popover open={showEmojis} onOpenChange={setShowEmojis}>
            <PopoverTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full"
              >
                <Smile className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent side="top" className="w-auto p-2">
              <div className="grid grid-cols-6 gap-1">
                {emojis.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEmojiSelect(emoji)}
                    className="text-lg p-1"
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Send/Record button */}
        {value.trim() ? (
          <Button
            onClick={onSend}
            size="sm"
            className="rounded-full bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={onToggleRecording}
            size="sm"
            variant={isRecording ? "destructive" : "ghost"}
            className={`rounded-full ${isRecording ? 'animate-pulse' : ''}`}
          >
            <Mic className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Recording indicator */}
      {isRecording && (
        <div className="flex items-center justify-center mt-2 space-x-2 text-red-500">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm">Recording audio...</span>
        </div>
      )}
    </div>
  );
};

export default MobileMessageInput;
