import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import EnhancedUserAccessPanel from '@/components/admin/EnhancedUserAccessPanel';
import TrainingManagementPanel from '@/components/admin/TrainingManagementPanel';
import AdminModerationDashboard from '@/components/moderation/AdminModerationDashboard';
import AdminWaitlistDashboard from '@/components/waitlist/AdminWaitlistDashboard';
import EvidenceReviewPanel from '@/components/admin/EvidenceReviewPanel';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Users, GraduationCap, AlertTriangle } from 'lucide-react';

const AdminOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Centralized management of all administrative tools
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Management</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Access Control</div>
            <p className="text-xs text-muted-foreground">
              Manage user permissions and roles
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Management</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Manual Review</div>
            <p className="text-xs text-muted-foreground">
              Assess helper training progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Moderation</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Safety First</div>
            <p className="text-xs text-muted-foreground">
              Review flagged content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Security</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Protected</div>
            <p className="text-xs text-muted-foreground">
              Triple-layer authentication
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
          <CardDescription>
            Navigate to different admin sections using the sidebar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>• User Management - Control user access and permissions</p>
            <p>• Training Management - Review and assess helper training</p>
            <p>• Content Moderation - Handle reported content</p>
            <p>• Waitlist - Approve or deny new user applications</p>
            <p>• Evidence Review - Verify user submissions</p>
            <p>• Settings - Configure system parameters</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const AdminSettings = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Settings</CardTitle>
        <CardDescription>Configure admin panel settings</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">Settings panel coming soon...</p>
      </CardContent>
    </Card>
  );
};

const AdminHub = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<EnhancedUserAccessPanel />} />
            <Route path="training" element={<TrainingManagementPanel />} />
            <Route path="moderation" element={<AdminModerationDashboard />} />
            <Route path="waitlist" element={<AdminWaitlistDashboard />} />
            <Route path="evidence" element={<EvidenceReviewPanel />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminHub;
