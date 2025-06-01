
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft } from 'lucide-react';
import { Conversation } from '@/hooks/messaging/types';

interface ChatHeaderProps {
  activePartner: Conversation | undefined;
  onBack: () => void;
  showBackButton?: boolean;
}

const ChatHeader = ({ activePartner, onBack, showBackButton = false }: ChatHeaderProps) => {
  return (
    <div className="p-4 border-b bg-white flex items-center gap-3">
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="md:hidden"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      )}
      
      <Avatar className="h-8 w-8">
        <AvatarImage src={activePartner?.avatar_url} alt={activePartner?.user_name} />
        <AvatarFallback>
          {activePartner?.user_name.split(' ').map(n => n[0]).join('') || '?'}
        </AvatarFallback>
      </Avatar>
      
      <h3 className="font-semibold">{activePartner?.user_name}</h3>
    </div>
  );
};

export default ChatHeader;
