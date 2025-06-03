
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useWaitlist } from '@/hooks/useWaitlist';
import AdminWaitlistDashboard from '@/components/waitlist/AdminWaitlistDashboard';
import QuickUserApproval from '@/components/admin/QuickUserApproval';

const AdminTab = () => {
  const { isAdmin, loading } = useWaitlist();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <QuickUserApproval />
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Admin Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Additional admin tools will be available here.</p>
          </CardContent>
        </Card>
      </div>

      <AdminWaitlistDashboard />
    </div>
  );
};

export default AdminTab;
