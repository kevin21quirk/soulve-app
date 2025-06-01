
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';

interface MessageInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  onSendMessage: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  sending: boolean;
}

const MessageInput = ({
  newMessage,
  setNewMessage,
  onSendMessage,
  onKeyPress,
  sending
}: MessageInputProps) => {
  return (
    <div className="p-4 border-t bg-white">
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="Type a message..."
          disabled={sending}
          className="flex-1"
        />
        <Button
          onClick={onSendMessage}
          disabled={!newMessage.trim() || sending}
          size="sm"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
