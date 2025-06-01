
import { Button } from "@/components/ui/button";
import { X, Reply } from "lucide-react";
import { Message } from "@/types/messaging";

interface ReplyPreviewProps {
  replyingToMessage?: Message;
  setReplyingTo: (messageId: string | null) => void;
}

const ReplyPreview = ({ replyingToMessage, setReplyingTo }: ReplyPreviewProps) => {
  if (!replyingToMessage) return null;

  return (
    <div className="px-4 py-2 bg-gray-50 border-b flex items-center justify-between">
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        <Reply className="h-4 w-4" />
        <span>Replying to: {replyingToMessage.content.substring(0, 50)}...</span>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setReplyingTo(null)}
        className="h-6 w-6 p-0"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default ReplyPreview;
