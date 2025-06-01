
import HelpApprovalDashboard from '@/components/help-completion/HelpApprovalDashboard';

const HelpApprovalTab = () => {
  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">Help Approvals</h2>
        <p className="text-gray-600 mt-1">
          Review help completions and manage point awards
        </p>
      </div>
      
      <HelpApprovalDashboard />
    </div>
  );
};

export default HelpApprovalTab;
