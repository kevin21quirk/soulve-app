import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import AdminSidebar from '@/components/admin/AdminSidebar';
import EnhancedUserAccessPanel from '@/components/admin/EnhancedUserAccessPanel';
import TrainingManagementPanel from '@/components/admin/TrainingManagementPanel';
import AdminModerationDashboard from '@/components/moderation/AdminModerationDashboard';
import AdminWaitlistDashboard from '@/components/waitlist/AdminWaitlistDashboard';
import EvidenceReviewPanel from '@/components/admin/EvidenceReviewPanel';
import SafeSpaceHelperVerification from '@/components/admin/SafeSpaceHelperVerification';
import BadgeManagementPanel from '@/components/admin/BadgeManagementPanel';
import RedFlagsPanel from '@/components/admin/RedFlagsPanel';
import AdminCustomizationPanel from '@/components/dashboard/AdminCustomizationPanel';
import PointsConfigPanel from '@/components/admin/PointsConfigPanel';
import CampaignModerationPanel from '@/components/admin/CampaignModerationPanel';
import OrganizationVerificationPanel from '@/components/admin/OrganizationVerificationPanel';
import { FeedbackManagementPanel } from '@/components/admin/FeedbackManagementPanel';
import { IDVerificationReview } from '@/components/admin/IDVerificationReview';
import AdminSafeguardingAlerts from './AdminSafeguardingAlerts';
import AdminSafeguardingSessions from './AdminSafeguardingSessions';
import AdminSafeguardingDBS from './AdminSafeguardingDBS';
import AdminSafeguardingKeywords from './AdminSafeguardingKeywords';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Shield, Users, GraduationCap, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminOverview = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingUsers: 0,
    approvedUsers: 0,
    activeReports: 0,
    pendingTraining: 0,
    pendingEvidence: 0,
    totalPosts: 0,
    activeCampaigns: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Set up real-time subscriptions
    const profilesChannel = supabase
      .channel('admin-profiles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchStats();
      })
      .subscribe();

    const reportsChannel = supabase
      .channel('admin-reports-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reports' }, () => {
        fetchStats();
      })
      .subscribe();

    const trainingChannel = supabase
      .channel('admin-training-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'safe_space_helper_training_progress' }, () => {
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(profilesChannel);
      supabase.removeChannel(reportsChannel);
      supabase.removeChannel(trainingChannel);
    };
  }, []);

  const fetchStats = async () => {
    try {
      const [profilesData, reportsData, trainingData, evidenceData, postsData, campaignsData] = await Promise.all([
        supabase.from('profiles').select('id, waitlist_status', { count: 'exact' }),
        supabase.from('reports').select('id, status', { count: 'exact' }),
        supabase.from('safe_space_helper_training_progress').select('id, status', { count: 'exact' }),
        supabase.from('evidence_submissions').select('id, verification_status', { count: 'exact' }),
        supabase.from('posts').select('id, is_active', { count: 'exact' }),
        supabase.from('campaigns').select('id, status', { count: 'exact' })
      ]);

      setStats({
        totalUsers: profilesData.count || 0,
        pendingUsers: profilesData.data?.filter(p => p.waitlist_status === 'pending').length || 0,
        approvedUsers: profilesData.data?.filter(p => p.waitlist_status === 'approved').length || 0,
        activeReports: reportsData.data?.filter(r => r.status === 'pending').length || 0,
        pendingTraining: trainingData.data?.filter(t => t.status === 'in_progress' || t.status === 'not_started').length || 0,
        pendingEvidence: evidenceData.data?.filter(e => e.verification_status === 'pending').length || 0,
        totalPosts: postsData.data?.filter(p => p.is_active).length || 0,
        activeCampaigns: campaignsData.data?.filter(c => c.status === 'active').length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Real-time platform statistics and management tools
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingUsers} pending approval
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reports</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeReports}</div>
            <p className="text-xs text-muted-foreground">
              Content moderation needed
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Reviews</CardTitle>
            <GraduationCap className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingTraining}</div>
            <p className="text-xs text-muted-foreground">
              Helper training in progress
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Evidence Queue</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingEvidence}</div>
            <p className="text-xs text-muted-foreground">
              Pending verification
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platform Activity</CardTitle>
            <CardDescription>Current system metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Posts</span>
              <span className="text-2xl font-bold">{stats.totalPosts}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Campaigns</span>
              <span className="text-2xl font-bold">{stats.activeCampaigns}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Approved Users</span>
              <span className="text-2xl font-bold">{stats.approvedUsers}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Navigate to different admin sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                User Management - Control access and permissions
              </p>
              <p className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                Training Management - Review helper progress
              </p>
              <p className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                Content Moderation - Handle reports
              </p>
              <p className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Evidence Review - Verify submissions
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
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
    <SidebarProvider defaultOpen={true}>
      <div className="flex min-h-screen w-full bg-background">
        <AdminSidebar />
        <main className="flex-1 p-6 overflow-auto bg-muted/30">
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="users" element={<EnhancedUserAccessPanel />} />
            <Route path="waitlist" element={<AdminWaitlistDashboard />} />
            <Route path="id-verifications" element={<IDVerificationReview />} />
            <Route path="helpers" element={<SafeSpaceHelperVerification />} />
            <Route path="training" element={<TrainingManagementPanel />} />
            <Route path="evidence" element={<EvidenceReviewPanel />} />
            <Route path="moderation" element={<AdminModerationDashboard />} />
            <Route path="feedback" element={<FeedbackManagementPanel />} />
            <Route path="red-flags" element={<RedFlagsPanel />} />
            <Route path="badges" element={<BadgeManagementPanel />} />
            <Route path="customization" element={<AdminCustomizationPanel />} />
            <Route path="points-config" element={<PointsConfigPanel />} />
            <Route path="campaigns" element={<CampaignModerationPanel />} />
            <Route path="organizations" element={<OrganizationVerificationPanel />} />
            <Route path="safeguarding/alerts" element={<AdminSafeguardingAlerts />} />
            <Route path="safeguarding/sessions" element={<AdminSafeguardingSessions />} />
            <Route path="safeguarding/dbs" element={<AdminSafeguardingDBS />} />
            <Route path="safeguarding/keywords" element={<AdminSafeguardingKeywords />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminHub;
