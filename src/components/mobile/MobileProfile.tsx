
import React from 'react';
import { User } from 'lucide-react';

const MobileProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Profile</h2>
          <p className="text-gray-500">Your profile information will appear here</p>
        </div>
      </div>
    </div>
  );
};

export default MobileProfile;
