
import { Card, CardContent } from "@/components/ui/card";

const ChatEmptyState = () => {
  return (
    <Card className="flex-1 flex items-center justify-center">
      <CardContent className="text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Select a conversation</h3>
        <p className="text-gray-500">Choose from your existing conversations or start a new one</p>
      </CardContent>
    </Card>
  );
};

export default ChatEmptyState;
