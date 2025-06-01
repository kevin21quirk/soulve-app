
import { MessageCircle } from 'lucide-react';

const ChatEmptyState = () => {
  return (
    <div className="flex-1 flex items-center justify-center text-gray-500">
      <div className="text-center">
        <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>Select a conversation to start messaging</p>
      </div>
    </div>
  );
};

export default ChatEmptyState;
