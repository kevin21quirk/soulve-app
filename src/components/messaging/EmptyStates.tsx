import { MessageSquare, Users, Mail } from "lucide-react";

interface EmptyStatesProps {
  type: 'no-conversations' | 'no-selection' | 'no-messages';
}

const EmptyStates = ({ type }: EmptyStatesProps) => {
  if (type === 'no-conversations') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-semibold text-lg mb-2">No conversations yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Connect with others to start messaging. Visit the Discover page to find people to connect with.
        </p>
      </div>
    );
  }

  if (type === 'no-selection') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <MessageSquare className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-semibold text-lg mb-2">Select a conversation</h3>
        <p className="text-muted-foreground max-w-sm">
          Choose a conversation from the list to start messaging
        </p>
      </div>
    );
  }

  if (type === 'no-messages') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Mail className="h-8 w-8 text-primary" />
        </div>
        <h3 className="font-semibold text-lg mb-2">No messages yet</h3>
        <p className="text-muted-foreground max-w-sm">
          Start the conversation by sending a message below
        </p>
      </div>
    );
  }

  return null;
};

export default EmptyStates;
