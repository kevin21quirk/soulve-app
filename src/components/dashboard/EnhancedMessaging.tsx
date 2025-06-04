
import React from 'react';
import RealTimeMessagingInterface from '../messaging/RealTimeMessagingInterface';
import TestButtons from './TestButtons';

const EnhancedMessaging = () => {
  return (
    <div className="space-y-6">
      {/* Test Buttons Panel */}
      <TestButtons />
      
      {/* Real-time Messaging Interface */}
      <RealTimeMessagingInterface />
    </div>
  );
};

export default EnhancedMessaging;
