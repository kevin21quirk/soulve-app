import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, FileText, BarChart3 } from "lucide-react";
import StakeholderDataRequestsPanel from "@/components/dashboard/esg/StakeholderDataRequestsPanel";

interface AdminHubProps {
  organizationId: string;
}

const AdminHub = ({ organizationId }: AdminHubProps) => {
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
        <TabsList className="grid w-full grid-cols-4 bg-secondary/20">
          <TabsTrigger value="esg">
            <FileText className="h-4 w-4 mr-2" />
            ESG Management
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
          <StakeholderDataRequestsPanel organizationId={organizationId} />
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
