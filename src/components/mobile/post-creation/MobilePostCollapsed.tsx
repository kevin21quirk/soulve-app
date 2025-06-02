
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Camera, Video, BarChart3, Calendar } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface MobilePostCollapsedProps {
  user: User | null;
  onExpand: () => void;
}

const MobilePostCollapsed = ({ user, onExpand }: MobilePostCollapsedProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      {/* Quick Action Prompt */}
      <div className="flex items-center space-x-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
          <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
            {user?.user_metadata?.first_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        
        <button
          onClick={onExpand}
          className="flex-1 bg-gray-50 rounded-full px-4 py-3 text-left text-gray-500 text-sm hover:bg-gray-100 transition-colors"
        >
          What's on your mind, {user?.user_metadata?.first_name}?
        </button>
      </div>
      
      {/* Enhanced Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExpand}
            className="flex items-center space-x-1 text-green-600 hover:bg-green-50 flex-1"
          >
            <Camera className="h-4 w-4" />
            <span className="text-xs">Photo</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onExpand}
            className="flex items-center space-x-1 text-red-600 hover:bg-red-50 flex-1"
          >
            <Video className="h-4 w-4" />
            <span className="text-xs">Live</span>
          </Button>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExpand}
            className="flex items-center space-x-1 text-yellow-600 hover:bg-yellow-50 flex-1"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="text-xs">Poll</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onExpand}
            className="flex items-center space-x-1 text-blue-600 hover:bg-blue-50 flex-1"
          >
            <Calendar className="h-4 w-4" />
            <span className="text-xs">Event</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobilePostCollapsed;
