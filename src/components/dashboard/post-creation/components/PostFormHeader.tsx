
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';

const PostFormHeader = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center space-x-3 p-4 border-b border-gray-100">
      <Avatar className="h-10 w-10">
        <AvatarImage src={user?.user_metadata?.avatar_url} />
        <AvatarFallback className="bg-gradient-to-r from-teal-500 to-blue-500 text-white">
          {user?.user_metadata?.display_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
        </AvatarFallback>
      </Avatar>
      <div>
        <p className="font-medium text-gray-900">
          {user?.user_metadata?.display_name || user?.email}
        </p>
        <p className="text-sm text-gray-500">Share with your community</p>
      </div>
    </div>
  );
};

export default PostFormHeader;
