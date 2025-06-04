
import React from 'react';
import { MessageCircle } from 'lucide-react';

const MobileMessages = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Messages</h2>
          <p className="text-gray-500">Your conversations will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default MobileMessages;
