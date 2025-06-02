
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Smile, Users, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface SocialPostCollapsedProps {
  onExpand: () => void;
}

const SocialPostCollapsed = ({ onExpand }: SocialPostCollapsedProps) => {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow">
      {/* Main compose area */}
      <div className="flex items-center space-x-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
          <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
            {user?.user_metadata?.first_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <button
          onClick={onExpand}
          className="flex-1 bg-gray-50 hover:bg-gray-100 rounded-full px-4 py-3 text-left text-gray-500 text-sm transition-colors border border-transparent hover:border-gray-200"
        >
          What's on your mind, {user?.user_metadata?.first_name}?
        </button>
      </div>
      
      {/* Quick action buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExpand}
            className="flex items-center space-x-2 text-green-600 hover:bg-green-50 px-3 py-2"
          >
            <Camera className="h-4 w-4" />
            <span className="text-xs font-medium">Photo</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onExpand}
            className="flex items-center space-x-2 text-yellow-600 hover:bg-yellow-50 px-3 py-2"
          >
            <Smile className="h-4 w-4" />
            <span className="text-xs font-medium">Feeling</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onExpand}
            className="flex items-center space-x-2 text-blue-600 hover:bg-blue-50 px-3 py-2"
          >
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium">Help</span>
          </Button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={onExpand}
          className="flex items-center space-x-2 text-red-600 hover:bg-red-50 px-3 py-2"
        >
          <Zap className="h-4 w-4" />
          <span className="text-xs font-medium">Urgent</span>
        </Button>
      </div>
    </div>
  );
};

export default SocialPostCollapsed;
