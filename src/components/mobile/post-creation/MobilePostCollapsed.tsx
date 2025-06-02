
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@supabase/supabase-js';

interface MobilePostCollapsedProps {
  user: User | null;
  onExpand: () => void;
}

const MobilePostCollapsed = ({ user, onExpand }: MobilePostCollapsedProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
      {/* Quick Action Prompt */}
      <div className="flex items-center space-x-3">
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
    </div>
  );
};

export default MobilePostCollapsed;
