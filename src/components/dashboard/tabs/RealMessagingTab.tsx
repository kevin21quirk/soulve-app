
import RealTimeMessagingInterface from '@/components/messaging/RealTimeMessagingInterface';

const RealMessagingTab = () => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Messages</h2>
      </div>
      
      <RealTimeMessagingInterface />
    </div>
  );
};

export default RealMessagingTab;
