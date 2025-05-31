
import React from 'react';
import { RealMessaging } from '../RealMessaging';

const RealMessagingTab = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Messages</h1>
      </div>
      
      <RealMessaging />
    </div>
  );
};

export default RealMessagingTab;
