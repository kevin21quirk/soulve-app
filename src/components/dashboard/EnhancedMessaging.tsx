
import React from 'react';
import { RealMessaging } from './RealMessaging';
import TestButtons from './TestButtons';

const EnhancedMessaging = () => {
  return (
    <div className="space-y-6">
      {/* Test Buttons Panel */}
      <TestButtons />
      
      {/* Real Messaging Component */}
      <RealMessaging />
    </div>
  );
};

export default EnhancedMessaging;
