
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (value: string) => void;
  onSendMessage: () => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  sending: boolean;
}

const MessageInput = ({
  newMessage,
  setNewMessage,
  onSendMessage,
  onKeyPress,
  sending
}: MessageInputProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage();
  };

  return (
    <div className="border-t p-4">
      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
          disabled={sending}
          onKeyPress={onKeyPress}
        />
        <Button 
          type="submit" 
          size="sm" 
          disabled={!newMessage.trim() || sending}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};

export default MessageInput;
