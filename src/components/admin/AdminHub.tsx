import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, FileText, BarChart3, Download, MessageSquare } from "lucide-react";
import StakeholderDataRequestsPanel from "@/components/dashboard/esg/StakeholderDataRequestsPanel";
import ESGReportsPanel from "@/components/dashboard/esg/ESGReportsPanel";
import DataVerificationPanel from "@/components/dashboard/esg/DataVerificationPanel";
import { AICreditManagement } from "@/components/dashboard/esg/AICreditManagement";
import { useESGRealtimeUpdates } from "@/hooks/esg/useESGRealtimeUpdates";
import { FeedbackManagementPanel } from "./FeedbackManagementPanel";
import AdminESGReports from "@/pages/AdminESGReports";

interface AdminHubProps {
  organizationId: string;
}

const AdminHub = ({ organizationId }: AdminHubProps) => {
  // Enable real-time updates for ESG data
  useESGRealtimeUpdates({ organizationId, enabled: true });
  
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent flex items-center">
            <Shield className="h-8 w-8 mr-3 text-primary" />
            Admin Hub
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage organization settings, users, and ESG data collection
          </p>
        </div>
      </div>

      <Tabs defaultValue="esg" className="w-full">
        <TabsList className="grid w-full grid-cols-7 bg-secondary/20">
          <TabsTrigger value="esg">
            <FileText className="h-4 w-4 mr-2" />
            ESG Management
          </TabsTrigger>
          <TabsTrigger value="feedback">
            <MessageSquare className="h-4 w-4 mr-2" />
            Feedback
          </TabsTrigger>
          <TabsTrigger value="esg-reports">
            <FileText className="h-4 w-4 mr-2" />
            ESG Reports
          </TabsTrigger>
          <TabsTrigger value="reports">
            <Download className="h-4 w-4 mr-2" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            User Management
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Shield className="h-4 w-4 mr-2" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="esg" className="mt-6">
          <div className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DataVerificationPanel organizationId={organizationId} />
              </div>
              <div>
                <AICreditManagement organizationId={organizationId} />
              </div>
            </div>
            <StakeholderDataRequestsPanel organizationId={organizationId} />
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="mt-6">
          <FeedbackManagementPanel />
        </TabsContent>

        <TabsContent value="esg-reports" className="mt-6">
          <AdminESGReports />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <ESGReportsPanel organizationId={organizationId} />
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">User Management</h3>
            <p className="text-muted-foreground">User management features coming soon...</p>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Analytics Dashboard</h3>
            <p className="text-muted-foreground">Analytics features coming soon...</p>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Organization Settings</h3>
            <p className="text-muted-foreground">Settings management coming soon...</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminHub;
