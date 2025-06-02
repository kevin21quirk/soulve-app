
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface MobilePostHeaderProps {
  user: User | null;
  onCancel: () => void;
}

const MobilePostHeader = ({ user, onCancel }: MobilePostHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user?.user_metadata?.avatar_url || ''} />
          <AvatarFallback className="bg-gradient-to-r from-[#0ce4af] to-[#18a5fe] text-white">
            {user?.user_metadata?.first_name?.charAt(0) || 'U'}
          </AvatarFallback>
        </Avatar>
        <div className="font-medium text-sm">
          {user?.user_metadata?.first_name} {user?.user_metadata?.last_name}
        </div>
      </div>
      <Button variant="ghost" size="sm" onClick={onCancel}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default MobilePostHeader;
